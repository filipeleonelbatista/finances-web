import { useToast } from "@/components/ui/use-toast";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";


export const StockContext = createContext({});

export function StockContextProvider(props) {
  const { toast } = useToast()

  const [StockList, setStockList] = useState([]);

  const [selectedTransaction, setSelectedTransaction] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Todos os itens");
  const [search, setSearch] = useState("");

  const filteredList = useMemo(() => {
    const filteredCategory = StockList.filter((item) => {
      if (selectedCategory === "Todos os itens") {
        return true;
      } else {
        return item.category === selectedCategory;
      }
    });

    const filteredWords =
      search === ""
        ? filteredCategory
        : filteredCategory.filter((item) => item.description.includes(search));

    return filteredWords ?? [];
  }, [StockList, selectedCategory, search]);

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + item.amount * item.quantity;
    }

    return TotalList;
  }, [filteredList]);

  async function updateTransaction(currentTransaction) {
    const currentTransactions = StockList.filter(
      (transaction) => transaction.id !== currentTransaction.id
    );

    localStorage.setItem(
      "stock",
      JSON.stringify([currentTransaction, ...currentTransactions])
    );
    toast({
      description: "Item atualizado com sucesso!",
      variant: "success"
    })
    loadTransactions();
  }

  async function updateStock(
    currentTransaction,
    isAdd = false,
    isSubtract = false
  ) {
    const currentTransactions = StockList.filter(
      (transaction) => transaction.id !== currentTransaction.id
    );

    const currentQuantity = isAdd
      ? Number(currentTransaction.quantity) + 1
      : isSubtract
        ? Number(currentTransaction.quantity) - 1
        : currentTransaction.quantity;

    currentTransaction.quantity = currentQuantity;

    localStorage.setItem(
      "stock",
      JSON.stringify([currentTransaction, ...currentTransactions])
    );
    toast({
      description: "Item atualizado com sucesso!",
      variant: "success"
    })
    loadTransactions();
  }

  async function deleteTransaction(currentTransaction) {
    if (confirm("Deseja realmete excluir este item? Essa ação é permanente.")) {
      const currentTransactions = StockList.filter(
        (transaction) => transaction.id !== currentTransaction.id
      );

      localStorage.setItem(
        "stock",
        JSON.stringify([...currentTransactions])
      );
    }

    toast({
      description: "Item excluido com sucesso!",
      variant: "success"
    })
    loadTransactions();
  }

  async function addTransaction(newTransaction) {
    newTransaction.id = uuidv4();

    localStorage.setItem(
      "stock",
      JSON.stringify([newTransaction, ...StockList])
    );

    toast({
      description: "Item adicionado com sucesso!",
      variant: "success"
    })

    loadTransactions();
  }

  const loadTransactions = useCallback(async () => {
    const items = localStorage.getItem("stock");

    if (items) {
      setStockList(JSON.parse(items));
    } else {
      setStockList([]);
      localStorage.setItem("stock", JSON.stringify([]));
    }

    return;

  }, [setStockList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <StockContext.Provider
      value={{
        StockList,
        setStockList,
        filteredList,
        listTotal,
        selectedCategory,
        setSelectedCategory,
        addTransaction,
        deleteTransaction,
        selectedTransaction,
        setSelectedTransaction,
        updateTransaction,
        search,
        setSearch,
        updateStock,
        loadTransactions,
      }}
    >
      {props.children}
    </StockContext.Provider>
  );
}
