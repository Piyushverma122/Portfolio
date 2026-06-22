"use client";

import React, { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface LiquidChromeProps extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

export const LiquidChrome: React.FC<LiquidChromeProps> = ({
  baseColor = [0.1, 0.1, 0.1],
  speed = 0.2,
  amplitude = 0.5,
  frequencyX = 3,
  frequencyY = 2,
  interactive = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    const renderer = new Renderer({ canvas, antialias: true });
    const gl = renderer.gl;

    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        vec2 p = -1.0 + 2.0 * uv;
        p.x *= uResolution.x / uResolution.y;

        for (float i = 1.0; i < 6.0; i++) {
          p.x += uAmplitude / i * sin(i * uFrequencyX * p.y + uTime * 0.8 + uMouse.x);
          p.y += uAmplitude / i * cos(i * uFrequencyY * p.x + uTime * 0.8 + uMouse.y);
        }

        float dist = length(p);
        float shine = sin(p.x * 2.0 - p.y * 2.0 + uTime) * 0.5 + 0.5;
        vec3 col = uBaseColor + vec3(0.06 * sin(p.x * 3.0 + uTime));
        col += vec3(0.1) / (1.0 + 40.0 * abs(p.y - p.x * 0.2));
        col += vec3(shine * 0.14);
        col *= 1.0 - 0.22 * dist;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [0, 0] },
        uBaseColor: { value: baseColor },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: [0, 0] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationFrameId: number;
    let mouse = [0, 0];

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouse = [x, y];
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.floor(container.clientWidth * dpr);
      const height = Math.floor(container.clientHeight * dpr);
      canvas.width = width;
      canvas.height = height;
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uResolution.value = [width, height];
    };

    window.addEventListener("resize", resize);
    resize();

    const update = (time: number) => {
      program.uniforms.uTime.value = time * 0.001 * speed;
      program.uniforms.uMouse.value = mouse;
      renderer.render({ scene: mesh });
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      container.removeChild(canvas);
    };
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, interactive]);

  return (
    <div
      ref={containerRef}
      {...props}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...props.style,
      }}
    />
  );
};

export default LiquidChrome;
