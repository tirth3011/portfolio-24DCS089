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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header name={studentName} />
      <main className="page-container" style={{ marginTop: "2rem", flexGrow: 1 }}>
        <About />
        <Skills skillList={skills} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
