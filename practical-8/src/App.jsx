import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingFallback from "./components/LoadingFallback";
import Home from "./pages/Home";

// Route-based Code Splitting using React.lazy()
// Chunks are loaded asynchronously over the network only when the route is visited
const Projects = lazy(() => import("./pages/Projects"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Contact = lazy(() => import("./pages/Contact"));
const Benchmark = lazy(() => import("./pages/Benchmark"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Suspense fallback={<LoadingFallback pageName="Requested Route" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
