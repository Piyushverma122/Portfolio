import Hero from "../components/sections/Hero.jsx";
import GithubActivity from "../components/sections/GithubActivity.jsx";
import Experience from "../components/sections/Experience.jsx";
import Skills from "../components/sections/Skills.jsx";
import Projects from "../components/sections/Projects.jsx";
import Contact from "../components/sections/Contact.jsx";

export default function Home() {
  return (
    <div className="shell" id="top">
      <main>
        <Hero />

        <div className="bento-layout">
          <GithubActivity />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </div>
      </main>
    </div>
  );
}
