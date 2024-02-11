import { useContext } from "react";
import { StockContext } from "../context/StockContext";

export function useStock() {
  const value = useContext(StockContext);
  return value;
}
