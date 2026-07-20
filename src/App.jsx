import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";

function App() {

  const studentName = "Tirth Patel";

  const skills = [
    "CCNA",
    "CyberSecurity",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js"
  ];

  return (
    <>
      <Header name={studentName} />
      <About />
      <Skills skills={skills} />
      <Footer />
    </>
  );
}

export default App;