import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "./components/Home";
import "./main.css";
import RaceDetail from "./components/RaceDetail/RaceDetail";
import { Header } from "./common/Header";
import { CircuitDetails } from "./components/RaceDetail/CircuitDetail";
import { LineUps } from "./components/RaceDetail/LineUp";
import { Results } from "./components/RaceDetail/Result";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="w-full min-h-0 flex-1 flex flex-col bg-[#0A0F1F] text-white">
        <Header />
        <div className="p-8 flex flex-col gap-10 flex-1 min-h-0 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/race-detail" element={<RaceDetail />}>
              <Route path=":id" element={<CircuitDetails />} />
              <Route path=":id/line-ups" element={<LineUps />} />
              <Route path=":id/results" element={<Results />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Router>
  </StrictMode>
);
