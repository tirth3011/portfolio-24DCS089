import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingFallback from "./components/LoadingFallback";
import { AuthModal } from "./components/AuthModal";
import { TaskModal } from "./components/TaskModal";
import { Toast } from "./components/Toast";
import { createTask } from "./api/apiClient";
import Home from "./pages/Home";

// Route-based Code Splitting using React.lazy()
// Chunks are loaded asynchronously over the network only when the route is visited
const Projects = lazy(() => import("./pages/Projects"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Contact = lazy(() => import("./pages/Contact"));
const Benchmark = lazy(() => import("./pages/Benchmark"));
const NotFound = lazy(() => import("./pages/NotFound"));

function MainApp() {
  const { logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Listen for 401 auth expiration
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
      addToast("Session expired or token invalid. Please log in again.", "error");
      setIsAuthModalOpen(true);
    };

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [logout, addToast]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      addToast(`Task "${taskData.title}" created successfully.`);
      setIsCreateModalOpen(false);
      // Trigger reload on Home if currently on Home
      window.dispatchEvent(new CustomEvent("tasks:refresh"));
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to create task.";
      addToast(msg, "error");
    }
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCreate={() => setIsCreateModalOpen(true)}
      />

      <main className="main-content">
        <Suspense fallback={<LoadingFallback pageName="Asynchronous Route Chunk" />}>
          <Routes>
            <Route path="/" element={<Home onOpenAuth={() => setIsAuthModalOpen(true)} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(msg) => addToast(msg)}
      />

      <TaskModal
        isOpen={isCreateModalOpen}
        task={null}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTask}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
