import { BrowserRouter, Route, Routes } from "react-router-dom";
import Financas from "./Financas";
import Reports from "./Reports";
import Settings from "./Settings";
import Stock from "./stock";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Financas />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stock" element={<Stock />} />
        
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
