import { BrowserRouter, Route, Routes } from "react-router-dom";
import Financas from "./pages/Financas";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Stock from "./pages/Stock";
import Simulador from "./pages/Simulador";
import Runs from "./pages/Runs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Financas />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/investiments" element={<Simulador />} />
        <Route path="/runs" element={<Runs />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
