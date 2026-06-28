import { memo, useEffect, useRef } from "react";

const VS = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FS = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform float uAmplitude;
uniform float uFrequency;
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = -1.0 + 2.0 * uv;
  p.x *= uResolution.x / uResolution.y;
  for (float i = 1.0; i < 6.0; i++) {
    p.x += uAmplitude / i * sin(i * uFrequency * p.y + uTime * 0.8);
    p.y += uAmplitude / i * cos(i * uFrequency * p.x + uTime * 0.8);
  }
  float dist = length(p);
  float shine = sin(p.x * 2.0 - p.y * 2.0 + uTime) * 0.5 + 0.5;
  vec3 col = uBaseColor + vec3(0.06 * sin(p.x * 3.0 + uTime));
  col += vec3(0.1) / (1.0 + 40.0 * abs(p.y - p.x * 0.2));
  col += vec3(shine * 0.14);
  col *= 1.0 - 0.22 * dist;
  gl_FragColor = vec4(col, 1.0);
}`;

/**
 * "Open for Opportunities" pill with the animated liquid-chrome WebGL bg.
 *
 * PERF (per the canvas-fix brief):
 *  - Capped to 30fps via a delta check (was an uncapped 60fps loop).
 *  - Paused when the button scrolls off-screen (IntersectionObserver).
 *  - Paused when the tab is hidden (visibilitychange).
 *  - Honors prefers-reduced-motion (no loop at all).
 *  - The RAF is always cancelled and GL resources freed on unmount.
 */
function OpenToWorkButton() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return undefined;

    const compile = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(VS, gl.VERTEX_SHADER);
    const fs = compile(FS, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uBaseColor = gl.getUniformLocation(program, "uBaseColor");
    const uAmplitude = gl.getUniformLocation(program, "uAmplitude");
    const uFrequency = gl.getUniformLocation(program, "uFrequency");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const baseColor = [0.0392, 0.0392, 0.0392];
    const speed = 2.0;
    const amplitude = 0.1;
    const frequency = 3.0;

    // ----- 30fps throttling + visibility gating -----
    const TARGET_FPS = 30;
    const FRAME_DURATION = 1000 / TARGET_FPS;
    let lastTime = 0;
    let rafId = 0;
    let onScreen = true;
    let tabVisible = !document.hidden;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // clamp DPR → fewer pixels to shade
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = () => {
      resize();
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(uTime, performance.now() * 0.001 * speed);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform3fv(uBaseColor, baseColor);
      gl.uniform1f(uAmplitude, amplitude);
      gl.uniform1f(uFrequency, frequency);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (timestamp) => {
      if (!onScreen || !tabVisible) {
        rafId = 0;
        return; // fully stop the loop while hidden/off-screen
      }
      rafId = requestAnimationFrame(loop);
      const delta = timestamp - lastTime;
      if (delta < FRAME_DURATION) return; // skip frames that arrive too fast
      lastTime = timestamp - (delta % FRAME_DURATION);
      draw();
    };

    const start = () => {
      if (!rafId && onScreen && tabVisible) {
        lastTime = 0;
        rafId = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      });
      io.observe(canvas);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (io) io.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <span className="otw-wrap">
      <button className="otw" type="button">
        <canvas className="otw__canvas" ref={canvasRef} />
        <span className="otw__content">
          <span className="otw__dot" />
          <span className="otw__label">Open for Opportunities</span>
        </span>
      </button>
    </span>
  );
}

export default memo(OpenToWorkButton);
