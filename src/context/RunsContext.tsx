import { useToast } from "@/components/ui/use-toast";
import { createContext, useCallback, useEffect, useState } from "react";
import { v4 } from 'uuid';

export const RunsContext = createContext({});

export function RunsContextProvider(props) {
  const { toast } = useToast()

  const [FuelList, setFuelList] = useState([]);
  const [autonomy, setAutonomy] = useState(0);

  const setAutonomyValue = async (value) => {
    setAutonomy(value)
    localStorage.setItem('@autonomy', JSON.stringify(value))
  }

  async function importTransactions(importedList) {
    const convertedList = importedList.map((item) => {
      const convertedItem = { ...item };

      // Convertendo 'date' para Date
      if (convertedItem.date && typeof convertedItem.date === "string") {
        convertedItem.date = new Date(parseInt(convertedItem.date, 10));
      }

      // Convertendo 'amount' para boolean
      if (convertedItem.amount && typeof convertedItem.amount === "string") {
        convertedItem.amount = parseFloat(convertedItem.amount);
      }

      // Convertendo 'unityAmount' para boolean
      if (convertedItem.unityAmount && typeof convertedItem.unityAmount === "string") {
        convertedItem.unityAmount = parseFloat(convertedItem.unityAmount);
      }

      return convertedItem;
    });

    localStorage.setItem(
      "runs",
      JSON.stringify([...convertedList, ...FuelList])
    );

    toast({
      description: "Importação conclúida com sucesso!",
      variant: "success"
    })

    loadTransactions();
  }

  async function deleteTransaction(currentTransaction) {
    if (confirm("Deseja realmete excluir este item? Essa ação é permanente.")) {
      const currentTransactions = FuelList.filter(
        (transaction) => transaction.id !== currentTransaction.id
      );

      localStorage.setItem(
        "runs",
        JSON.stringify([...currentTransactions])
      );
    }

    toast({
      description: "Item excluido com sucesso!",
      variant: "success"
    })
    loadTransactions();
  }

  async function deleteAllTransaction() {
    if (confirm("Deseja realmete excluir os dados da tabela de abastecimentos? Essa ação é permanente.")) {
      localStorage.setItem(
        "runs",
        JSON.stringify([])
      );
      toast({
        description: "Tabela apagada com sucesso!",
        variant: "success"
      })
    } else {
      toast({
        description: "Nada foi excluido!",
        variant: "success"
      })
    }


    loadTransactions();
  }

  async function addTransaction(newTransaction) {
    const newTransactionList = [
      ...FuelList,
      {
        id: v4(),
        ...newTransaction
      }
    ]

    localStorage.setItem('runs', JSON.stringify(newTransactionList));

    toast({
      description: "Abastecimento adicionado com sucesso!",
      variant: "success"
    })

    loadTransactions()
  }

  const loadTransactions = useCallback(async () => {
    try {
      const autonomyValue = localStorage.getItem('@autonomy');
      if (autonomyValue !== null) {
        const autonomyValueParsed = JSON.parse(autonomyValue ?? '0')
        setAutonomy(autonomyValueParsed)
      } else {
        localStorage.setItem('@autonomy', JSON.stringify(0));
      }

      const value = localStorage.getItem('runs');
      if (value !== null) {
        const valueArray = JSON.parse(value)
        setFuelList(valueArray)
      } else {
        localStorage.setItem('runs', JSON.stringify([]));
      }

    } catch (e) {
      console.log(e)
    }

    return;

  }, [setFuelList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <RunsContext.Provider
      value={{
        FuelList,
        setFuelList,
        autonomy,
        setAutonomyValue,
        addTransaction,
        deleteTransaction,
        importTransactions,
        deleteAllTransaction
      }}
    >
      {props.children}
    </RunsContext.Provider>
  );
}
