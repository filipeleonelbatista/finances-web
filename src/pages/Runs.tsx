import { DatePicker } from "@/components/date-picker";
import FormAddRunItem from "@/components/form-add-run-item";
import RunItem from "@/components/run-item";
import { useRuns } from "@/hooks/useRuns";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useMemo, useState } from "react";
import { CiFilter } from "react-icons/ci";
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiDollarSign,
  FiPlus
} from "react-icons/fi";
import Ad from "../components/ad";
import EmptyMessage from "../components/empty-message";
import Footer from "../components/footer";
import Header from "../components/header";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

function Runs() {
  const {
    FuelList,
    autonomy,
    setAutonomyValue
  } = useRuns();

  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf("month").toDate());
  const [endDate, setEndDate] = useState(dayjs().endOf("month").toDate());

  const filteredList = useMemo(() => {
    if (FuelList) {

      const filteredByPeriod = FuelList.filter(item => {
        const itemDate = dayjs(item.date)
        const currentStartDate = dayjs(startDate)
        const currentEndDate = dayjs(endDate)
        return itemDate.isSameOrAfter(currentStartDate) && itemDate.isSameOrBefore(currentEndDate)
      })

      const sortedByDateArray = filteredByPeriod.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);

        if (dateA.isBefore(dateB)) {
          return 1;
        }

        if (dateA.isAfter(dateB)) {
          return -1;
        }

        return 0;
      })

      return sortedByDateArray;
    }
    return [];
  }, [FuelList, startDate, endDate])

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + item.amount
    }
    return TotalList
  }, [filteredList])

  const currentEstimative = useMemo(() => {
    return parseInt(filteredList[0] ? ((parseFloat(autonomy) * (filteredList[0]?.amount / filteredList[0]?.unityAmount)) + parseFloat(filteredList[0]?.currentDistance)) : 0.0);
  }, [filteredList, autonomy])

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
      <Header title="Corridas" />
      <div className="w-full max-w-[800px] px-2 grid sm:grid-rows-3 md:grid-cols-3 sm:grid-cols-none md:grid-rows-none gap-4 mt-[-64px] mb-2">
        <div className="w-full px-4 py-3 flex flex-col rounded bg-purple-700 drop-shadow-lg">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-xl text-white">Km Estimado</p>
            <FiArrowUpCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl mt-6 text-white">
            {currentEstimative}
          </p>
        </div>


        <Dialog>
          <DialogTrigger className="w-full transition-all hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer px-4 py-3 flex flex-col rounded bg-white dark:bg-gray-800 drop-shadow-lg">
            <div className="w-full flex flex-row items-center justify-between">
              <p className="text-xl">Autonomia</p>
              <FiArrowDownCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-2xl mt-6">
              {autonomy ?? 0}L
            </p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Autonomia</DialogTitle>
              <DialogDescription>
                Adicione a autonomia do veículo para estimar o uso do combustível
              </DialogDescription>
            </DialogHeader>
            <div className="w-full max-h-96 overflow-auto flex flex-col space-y-4 p-2">
              <div>
                <Label htmlFor="autonomy">Valor do Km/L</Label>
                <Input
                  id="autonomy"
                  onChange={(event) =>
                    setAutonomyValue(event.target.value === "" ? 0 : event.target.value)
                  }
                  value={autonomy}
                />
              </div>
              <Button
                onClick={() => {
                  document.getElementById("close-dialog")?.click();
                }}
                className="bg-purple-600 hover:bg-purple-900"
              >
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-full px-4 py-3 flex flex-col rounded bg-white dark:bg-gray-800 drop-shadow-lg">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-xl">Km Atual</p>
            <FiDollarSign className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl mt-6">
            {filteredList[0]?.currentDistance ?? 0}
          </p>
        </div>
      </div>

      <div className="w-full max-w-[800px] px-2 flex flex-col gap-4 mb-4">
        <Ad />
      </div>

      <div className="w-full max-w-[800px] px-2 flex flex-row justify-between items-center gap-4 mb-4">
        <h2 className="font-bold dark:text-white text-gray-800 text-xl">
          Suas corridas
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
      </div>

      {
        filteredList.length === 0 ? (
          <EmptyMessage />
        ) : (
          <>
            <div className="w-full max-w-[800px] flex flex-col gap-3 px-2 py-4">
              {filteredList.map((item, index) => (
                <RunItem item={item} index={index} key={index} />
              ))}
            </div>

            <div className="w-full max-w-[800px] flex flex-row px-2 justify-between items-center gap-4 mb-8">
              <h2 className="font-semibold dark:text-white text-gray-800 text-xl">
                Total
              </h2>
              <h2 className="font-semibold dark:text-white text-gray-800 text-xl">
                {formatCurrency(listTotal)}
              </h2>
            </div>
          </>
        )
      }
      <Footer />

      <Dialog>
        <DialogTrigger className="fixed bottom-4 transition-all duration-400 ease-in-out right-6 w-12 h-12 flex items-center justify-center rounded-full drop-shadow-lg bg-purple-600 hover:bg-purple-900">
          <FiPlus className="w-6 h-6 text-white" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Abastecimento</DialogTitle>
            <DialogDescription>
              Adicione informações sobre o abastecimento
            </DialogDescription>
          </DialogHeader>
          <FormAddRunItem />
        </DialogContent>
      </Dialog>
    </div >
  );
}

export default Runs;
