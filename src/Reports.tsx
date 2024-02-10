import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { CiFilter } from "react-icons/ci";
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiDollarSign, FiPlus
} from "react-icons/fi";
import AiTips from "./components/ai-tips";
import { DatePicker } from "./components/date-picker";
import EmptyMessage from "./components/empty-message";
import FinanceItem from "./components/finance-item";
import Footer from "./components/footer";
import FormAddTransaction from "./components/form-add-transactions";
import Header from "./components/header";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { usePayments } from "./hooks/usePayments";
import { useTheme } from "./components/theme-provider";

function Reports() {
  const { theme } = useTheme();
  const [showFilter, setShowFilter] = useState(false);

  const {
    Incomings,
    Expenses,
    Total,
    filteredList,
    selectedtypeofpayment,
    setselectedtypeofpayment,
    pamentStatusLabel,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    selectedFavoritedFilter,
    setSelectedFavoritedFilter,
    favoritedFilterLabel,
    categoriesList,
    selectedPaymentCategory,
    setSelectedPaymentCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = usePayments();

  const expensesByCategory = useMemo(() => {
    const gastosHabilitados = filteredList.filter(item => item.isEnabled);
    // Extrair categorias únicas
    const categoriasUnicas = [...new Set(gastosHabilitados.map(item => item.category))];

    // Calcular somatório dos gastos de cada categoria
    const gastosPorCategoria = categoriasUnicas.map(categoria => {
      return gastosHabilitados
        .filter(item => item.category === categoria)
        .reduce((acc, cur) => acc + cur.amount, 0);
    });

    const totalGastos = gastosPorCategoria.reduce((acc, cur) => acc + cur, 0);

    const percentuais = gastosPorCategoria.map(gasto => (gasto / totalGastos) * 100);

    return { label: categoriasUnicas, value: gastosPorCategoria, percentage: percentuais };
  }, [filteredList]);

  const filteredAndSortedData = useMemo(() => {
    const enabledData = filteredList.filter(item => item.isEnabled);

    const sortedData = enabledData.sort((a, b) => b.amount - a.amount).slice(0, 5);
    return sortedData;
  }, [filteredList]);

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  };

  const onChangeStartDate = (selectedDate) => {
    setStartDate(selectedDate);
  };

  const onChangeEndDate = (selectedDate) => {
    setEndDate(selectedDate);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 items-center">
      <Header title="Relatorio" />
      <div className="w-full max-w-[800px] px-2 grid sm:grid-rows-3 sm:grid-cols-none md:grid-rows-none md:grid-cols-3 gap-4 mt-[-64px] mb-2">
        <div className="px-4 py-3 flex flex-col rounded bg-white dark:bg-gray-800 drop-shadow-lg">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-xl">Entradas</p>
            <FiArrowUpCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-2xl mt-6">
            {formatCurrency(Incomings ? Incomings : 0)}
          </p>
        </div>

        <div className="px-4 py-3 flex flex-col rounded bg-white dark:bg-gray-800 drop-shadow-lg">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-xl">Saidas</p>
            <FiArrowDownCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-2xl mt-6">
            {formatCurrency(Expenses ? Expenses : 0)}
          </p>
        </div>

        <div className="px-4 py-3 flex flex-col rounded bg-purple-700 drop-shadow-lg">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-xl text-white">Total</p>
            <FiDollarSign className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl mt-6 text-white">
            {formatCurrency(Total ? Total : 0)}
          </p>
        </div>
      </div>
      <div className="w-full max-w-[800px] px-2 flex mb-4">
        <p>* Totais apenas dos itens do período selecionado</p>
      </div>

      <div className="w-full max-w-[800px] px-2 flex flex-row justify-between items-center gap-4 mb-4">
        <h2 className="font-bold dark:text-white text-gray-800 text-xl">
          Filtros do relatório
        </h2>
        <Button
          className="border-purple-600 text-purple-600 bg-transparent hover:border-purple-900 hover:text-purple-900"
          variant="outline"
          onClick={() => setShowFilter(!showFilter)}
        >
          <CiFilter className="w-6 h-6 text-purple-600 hover:text-purple-900" />
          Filtros
        </Button>
      </div>

      <div
        id="filters"
        data-showfilter={showFilter}
        className="transition-all duration-400 ease-in-out w-full overflow-hidden max-w-[800px] h-0 p-0 data-[showfilter=true]:h-fit flex flex-col gap-3 data-[showfilter=true]:px-2 data-[showfilter=true]:py-4"
      >
        <div className="w-full flex flex-col">
          <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
            Filtrar por período
          </p>
          <div className="w-full flex flex-row gap-2">
            <DatePicker
              label="Data inicial"
              id="startDate"
              date={startDate}
              setDate={onChangeStartDate}
            />
            <DatePicker
              label="Data final"
              id="endDate"
              date={endDate}
              setDate={onChangeEndDate}
            />
          </div>
        </div>

        <div className="w-full flex flex-row gap-2">
          <div className="w-full flex flex-col gap-1">
            <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
              Entradas/Saídas
            </p>
            <Select
              value={selectedtypeofpayment}
              onValueChange={setselectedtypeofpayment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Entrada/Saída" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todas</SelectItem>
                <SelectItem value="1">Entradas</SelectItem>
                <SelectItem value="2">Saídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex flex-col gap-1">
            <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
              Categorias
            </p>
            <Select
              value={selectedPaymentCategory}
              onValueChange={(value) => setSelectedPaymentCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Categorias" />
              </SelectTrigger>
              <SelectContent>
                {categoriesList.map((cat, index) => (
                  <SelectItem key={index} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full flex flex-row gap-2">
          <div className="w-full flex flex-col gap-1">
            <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
              Status de pagamento
            </p>
            <Select
              value={selectedPaymentStatus}
              onValueChange={(value) => setSelectedPaymentStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {pamentStatusLabel.map((status, index) => (
                  <SelectItem key={index} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex flex-col gap-1">
            <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
              Favoritos
            </p>
            <Select
              value={selectedFavoritedFilter}
              onValueChange={(value) => setSelectedFavoritedFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Favoritos" />
              </SelectTrigger>
              <SelectContent>
                {favoritedFilterLabel.map((fav, index) => (
                  <SelectItem key={index} value={fav}>
                    {fav}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[800px] px-2 flex flex-col gap-4 mb-4">
        <AiTips />
      </div>

      <div className="w-full max-w-[800px] px-2 flex flex-col justify-between items-center gap-4 mb-4">
        <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
          <div className="w-full flex flex-col gap-2 md:gap-4">
            <div className="w-full px-4 py-3 gap-2 md:gap-4 flex flex-col">
              <h3 className="text-lg font-semibold">Gastos por categoria</h3>
              <Chart
                type="pie"
                options={
                  {
                    chart: {
                      width: '100%',
                      type: 'pie',
                    },
                    labels: expensesByCategory.label,
                    theme: {
                      monochrome: {
                        color: "#9333ea",
                        enabled: true
                      }
                    },
                    plotOptions: {
                      pie: {
                        dataLabels: {
                          offset: -5
                        }
                      }
                    },
                    dataLabels: {
                      formatter(val: number, opts?: any) {
                        const name = opts.w.globals.labels[opts.seriesIndex]
                        return [name, formatCurrency(expensesByCategory.value[opts.seriesIndex] ?? 0), val.toFixed(1) + '%']
                      }
                    },
                    legend: {
                      show: false
                    },
                    stroke: {
                      show: false
                    },
                    tooltip: {
                      marker: {
                        show: false,
                      },
                      enabled: true,
                      y: {
                        formatter: () => "",
                        title: {
                          formatter(val: number, opts?: any) {
                            const name = opts.w.globals.labels[opts.seriesIndex]
                            return `${name + " - " + formatCurrency(expensesByCategory.value[opts.seriesIndex] ?? 0)}`
                          }
                        }
                      }
                    }
                  }
                }
                series={expensesByCategory.percentage} />
            </div>
            <div className="w-full px-4 py-3 flex flex-col rounded bg-white dark:bg-gray-800 drop-shadow-lg">
              <h3 className="text-lg font-semibold">Saúde Financeira</h3>
              <div className="w-full space-y-2 flex flex-row items-center justify-between">
                <div className="space-x-2 flex flex-row items-center">
                  <FiArrowUpCircle className="w-10 h-10 text-green-500" />
                  <div>
                    <p className="text-sm">Ganhos</p>
                    <p className="font-semibold">{formatCurrency(Incomings ? Incomings : 0)}</p>
                  </div>
                </div>
                <div className="space-x-2 flex flex-row items-center">
                  <div>
                    <p className="text-sm">Despesas</p>
                    <p className="font-semibold">{formatCurrency(Expenses ? Expenses : 0)}</p>
                  </div>
                  <FiArrowDownCircle className="w-10 h-10 text-red-500" />
                </div>
              </div>
              <div className="w-full bg-red-500 rounded-full h-2.5 my-2">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{
                  width: `${(Incomings * 100) / (Incomings + Expenses) >= 100
                    ? 100
                    : (Incomings * 100) / (Incomings + Expenses)
                    }%`
                }}></div>
              </div>
            </div>
          </div>

          <div className="w-full py-3 flex flex-col">
            <h3 className="ml-2 text-lg font-semibold">Maiores gastos</h3>
            {filteredAndSortedData.length === 0 ? (
              <EmptyMessage />
            ) : (
              <div className="w-full max-w-[800px] flex flex-col gap-3 px-2 py-4">
                {filteredAndSortedData.map((item, index) => (
                  <FinanceItem item={item} index={index} key={index} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />

      <Dialog>
        <DialogTrigger className="fixed bottom-4 transition-all duration-400 ease-in-out right-6 w-12 h-12 flex items-center justify-center rounded-full drop-shadow-lg bg-purple-600 hover:bg-purple-900">
          <FiPlus className="w-6 h-6 text-white" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar transação</DialogTitle>
            <DialogDescription>
              Adicione informações sobre o entrada ou saída que está adicionando
            </DialogDescription>
          </DialogHeader>
          <FormAddTransaction />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Reports;
