import { BrowserRouter, Route, Routes } from "react-router-dom";
import Financas from "./Financas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Financas />} />
        
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
