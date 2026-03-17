import React from "react";
import { Toaster } from "react-hot-toast";
import { TaskProvider } from "./context/TaskContext";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

function App() {
  return (
    <TaskProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#1e1e2e", color: "#cdd6f4", border: "1px solid #313244" },
        }}
      />
      <Dashboard />
    </TaskProvider>
  );
}

export default App;