import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/hooks/useSettings";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const PaymentsContext = createContext({});

export function PaymentsContextProvider(props) {
  const { toast } = useToast()
  const { willUsePrefixToRemoveTihteSum, prefixTithe } = useSettings();

  const [transactionsList, setTransactionsList] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("Todos");
  const [selectedDateOrderFilter, setSelectedDateOrderFilter] =
    useState("Vencimento");
  const [selectedFavoritedFilter, setSelectedFavoritedFilter] =
    useState("Todos");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf("month").toDate());
  const [endDate, setEndDate] = useState(dayjs().endOf("month").toDate());

  const favoritedFilterLabel = ["Todos", "Favoritos", "Não favoritados"];

  const pamentStatusLabel = ["Todos", "Pago", "Não Pago"];

  const dateOrderOptions = ["Vencimento", "Pagamento"];

  const filterLabels = [
    "Este mês",
    "Próximo mês",
    "Esta semana",
    "Próxima semana",
    "Em duas semanas",
    "Em três semanas",
    "Em quatro semanas",
    "Semana passada",
    "Duas semanas atrás",
    "Três semanas atrás",
    "Quatro semanas atrás",
    "Mês passado",
    "Todos",
  ];

  const categoriesList = [
    "Todos",
    "Outros",
    "Bares e Restaurantes",
    "Beleza",
    "Cartão",
    "Empréstimos",
    "Emergência",
    "Estudos",
    "Ganhos",
    "Investimentos",
    "Mercado",
    "Moradia",
    "Saúde",
    "Streaming",
    "TV/Internet/Telefone",
    "Transporte",
    "Vestuário",
  ];

  const [selectedTransaction, setSelectedTransaction] = useState();

  const [selectedtypeofpayment, setselectedtypeofpayment] = useState("0");
  const [selectedPeriod, setSelectedPeriod] = useState("Este mês");
  const [selectedPaymentCategory, setSelectedPaymentCategory] =
    useState("Todos");

  const filteredList = useMemo(() => {
    if (transactionsList) {
      const filteredType = transactionsList.filter((item) => {
        if (selectedtypeofpayment === "0") {
          return true;
        }
        if (selectedtypeofpayment === "1" && !item.isEnabled) {
          return true;
        }
        if (selectedtypeofpayment === "2" && item.isEnabled) {
          return true;
        }
        return false;
      });

      const filteredWords =
        search === ""
          ? filteredType
          : filteredType.filter((item) => item.description.includes(search));

      const filteredByPeriod = filteredWords.filter((item) => {
        const itemDate = dayjs(item.date);

        return (
          itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate)
        );
      });

      const filteredByPaymentCategory = filteredByPeriod.filter((item) => {
        if (selectedPaymentCategory === "Todos") {
          return true;
        } else {
          return item.category === selectedPaymentCategory;
        }
      });

      const filteredByPaymentStatus = filteredByPaymentCategory.filter(
        (item) => {
          if (selectedPaymentStatus === "Todos") {
            return true;
          }
          if (selectedPaymentStatus === "Pago") {
            return item.paymentStatus;
          }
          if (selectedPaymentStatus === "Não Pago") {
            return !item.paymentStatus;
          }
        }
      );

      const filteredByFavoritedStatus = filteredByPaymentStatus.filter(
        (item) => {
          if (selectedFavoritedFilter === "Todos") {
            return true;
          }
          if (selectedFavoritedFilter === "Favoritos") {
            return item.isFavorited;
          }
          if (selectedFavoritedFilter === "Não favoritados") {
            return !item.isFavorited;
          }
        }
      );

      const sortedByDateArray = filteredByFavoritedStatus.sort((a, b) => {
        if (selectedDateOrderFilter === "Vencimento") {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);

          if (dateA.isBefore(dateB)) {
            return 1;
          }

          if (dateA.isAfter(dateB)) {
            return -1;
          }

          return 0;
        }
        if (selectedDateOrderFilter === "Pagamento") {
          const dateA = dayjs(a.paymentDate);
          const dateB = dayjs(b.paymentDate);

          if (dateA.isBefore(dateB)) {
            return 1;
          }

          if (dateA.isAfter(dateB)) {
            return -1;
          }

          return 0;
        }
        return 0;
      });

      return sortedByDateArray;
    }
    return [];
  }, [
    transactionsList,
    selectedPeriod,
    selectedtypeofpayment,
    selectedPaymentStatus,
    selectedDateOrderFilter,
    selectedFavoritedFilter,
    selectedPaymentCategory,
    search,
    startDate,
    endDate,
  ]);

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      if (item.isEnabled) {
        TotalList = TotalList - item.amount;
      } else {
        TotalList = TotalList + item.amount;
      }
    }
    return TotalList;
  }, [filteredList]);

  const Expenses = useMemo(() => {
    let soma = 0.0;
    for (const item of filteredList) {
      if (item.isEnabled) {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [filteredList, selectedPeriod]);

  const Incomings = useMemo(() => {
    let soma = 0.0;
    for (const item of filteredList) {
      if (!item.isEnabled) {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [filteredList, selectedPeriod]);

  const Total = useMemo(() => {
    let soma = 0.0;
    for (const item of filteredList) {
      if (item.isEnabled) {
        soma = soma - parseFloat(item.amount);
      } else {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [filteredList]);

  const Tithe = useMemo(() => {
    let soma = 0.0
    for (const item of filteredList) {
      if (!item.isEnabled) {
        soma = soma + item.amount
      }
      if (item.isEnabled && willUsePrefixToRemoveTihteSum) {
        if (prefixTithe != "" && item.description.includes(prefixTithe)) {
          soma = soma - item.amount
        }
      }
    }

    if (soma < 0) {
      soma = 0.0
    }

    return (soma * 10) / 100;
  }, [selectedPeriod, prefixTithe, willUsePrefixToRemoveTihteSum, filteredList])

  const Saldo = useMemo(() => {
    let soma = 0.0
    for (const item of transactionsList) {
      if (item.isEnabled) {
        soma = soma - parseFloat(item.amount);
      } else {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [transactionsList])


  async function handleFavorite(currentTransaction) {
    const transactionToUpdate = transactionsList.find(
      (transaction) => transaction.id === currentTransaction.id
    );

    if (transactionToUpdate) {
      transactionToUpdate.isFavorited = !transactionToUpdate.isFavorited;
      const currentTransactions = transactionsList.filter(
        (transaction) => transaction.id !== transactionToUpdate.id
      );

      localStorage.setItem(
        "finances",
        JSON.stringify([transactionToUpdate, ...currentTransactions])
      );
    }
    toast({
      description: transactionToUpdate.isFavorited ? "Item favoritado" : "Item desfavoritado",
      variant: "success"
    })
    loadTransactions();
  }

  async function updateTransaction(currentTransaction) {
    const currentTransactions = transactionsList.filter(
      (transaction) => transaction.id !== currentTransaction.id
    );

    localStorage.setItem(
      "finances",
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
      const currentTransactions = transactionsList.filter(
        (transaction) => transaction.id !== currentTransaction.id
      );

      localStorage.setItem(
        "finances",
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
    if (confirm("Deseja realmete excluir os dados da tabela finanças? Essa ação é permanente.")) {
      localStorage.setItem(
        "finances",
        JSON.stringify([])
      );
    }

    toast({
      description: "Tabela apagada com sucesso!",
      variant: "success"
    })

    loadTransactions();
  }

  async function importTransactions(importedList) {
    const convertedList = importedList.map((item) => {
      const convertedItem = { ...item };

      // Convertendo 'date' para Date
      if (convertedItem.date && typeof convertedItem.date === "string") {
        convertedItem.date = new Date(parseInt(convertedItem.date, 10));
      }

      // Convertendo 'paymentDate' para Date
      if (
        convertedItem.paymentDate &&
        typeof convertedItem.paymentDate === "string"
      ) {
        convertedItem.paymentDate = new Date(
          parseInt(convertedItem.paymentDate, 10)
        );
      }

      // Convertendo 'isEnabled' para boolean
      if (
        convertedItem.isEnabled &&
        typeof convertedItem.isEnabled === "string"
      ) {
        convertedItem.isEnabled = convertedItem.isEnabled === "1";
      }

      // Convertendo 'isFavorited' para boolean
      if (
        convertedItem.isFavorited &&
        typeof convertedItem.isFavorited === "string"
      ) {
        convertedItem.isFavorited = convertedItem.isFavorited === "1";
      }

      // Convertendo 'paymentStatus' para boolean
      if (
        convertedItem.paymentStatus &&
        typeof convertedItem.paymentStatus === "string"
      ) {
        convertedItem.paymentStatus = convertedItem.paymentStatus === "1";
      }

      // Convertendo 'amount' para boolean
      if (convertedItem.amount && typeof convertedItem.amount === "string") {
        convertedItem.amount = parseFloat(convertedItem.amount);
      }

      return convertedItem;
    });

    localStorage.setItem(
      "finances",
      JSON.stringify([...convertedList, ...transactionsList])
    );

    toast({
      description: "Importação conclúida com sucesso!",
      variant: "success"
    })
    loadTransactions();
  }

  async function addTransaction(newTransaction) {
    newTransaction.id = uuidv4();

    localStorage.setItem(
      "finances",
      JSON.stringify([newTransaction, ...transactionsList])
    );

    toast({
      description: "Item adicionado com sucesso!",
      variant: "success"
    })

    loadTransactions();
  }

  const loadTransactions = useCallback(async () => {
    const items = localStorage.getItem("finances");

    if (items) {
      setTransactionsList(JSON.parse(items));
    } else {
      setTransactionsList([]);
      localStorage.setItem("finances", JSON.stringify([]));
    }

    return;
  }, [setTransactionsList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <PaymentsContext.Provider
      value={{
        transactionsList,
        setTransactionsList,
        Incomings,
        Expenses,
        Total,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        selectedTransaction,
        setSelectedTransaction,
        filteredList,
        listTotal,
        selectedtypeofpayment,
        setselectedtypeofpayment,
        selectedPeriod,
        setSelectedPeriod,
        filterLabels,
        importTransactions,
        pamentStatusLabel,
        selectedPaymentStatus,
        setSelectedPaymentStatus,
        selectedDateOrderFilter,
        setSelectedDateOrderFilter,
        dateOrderOptions,
        handleFavorite,
        selectedFavoritedFilter,
        setSelectedFavoritedFilter,
        favoritedFilterLabel,
        categoriesList,
        selectedPaymentCategory,
        setSelectedPaymentCategory,
        search,
        setSearch,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        deleteAllTransaction,
        Tithe,
        Saldo
      }}
    >
      {props.children}
    </PaymentsContext.Provider>
  );
}
