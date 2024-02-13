import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { GoQuestion } from "react-icons/go";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useMemo, useState } from "react";

interface SimuladorProps {
  parameters: {
    id: string;
    title: string;
    description: string;
    value: number;
  }
}

function SimulatorForm({ parameters }: SimuladorProps) {

  const [initialInvestiment, setInitialInvestiment] = useState("5.250,00")
  const [montlyInvestiment, setMontlyInvestiment] = useState("300,00")
  const [timeInMonths, setTimeInMonths] = useState(5)

  const marks = [
    "1",
    "2",
    "3",
    "6",
    "12",
    "24",
    "60",
    "360"
  ];

  const period = useMemo(() => {

    let time = 0;
    let description = '';

    let selectedTime = parseInt(marks[timeInMonths])

    if (selectedTime >= 12) {
      time = Math.round(selectedTime / 12)
      if (Math.round(selectedTime / 12) > 1) {
        description = "Anos"
      } else {

        description = "Ano"
      }
    } else {
      time = selectedTime
      if (selectedTime > 1) {
        description = "Meses"
      } else {
        description = "Mês"
      }
    }


    return { time, description }
  }, [timeInMonths])



  const estimateRevenue = useMemo(() => {

    const months = parseInt(marks[timeInMonths])
    const initialValue = parseFloat(initialInvestiment.replace(/\./g, "").replace(",", "."))
    const montlyValue = parseFloat(montlyInvestiment.replace(/\./g, "").replace(",", "."))
    const percentageGain = parameters.value

    const totalInvest = (months * montlyValue) + initialValue

    let revenuePoupanca = initialValue

    for (let i = 0; i < months; i++) {
      revenuePoupanca += montlyValue;
      revenuePoupanca *= (1 + 0.005);
    }

    revenuePoupanca = revenuePoupanca - totalInvest < 0 ? 0.0 : revenuePoupanca - totalInvest

    let selectedTaxGainValue = initialValue

    for (var i = 0; i < months; i++) {
      selectedTaxGainValue += montlyValue;
      selectedTaxGainValue *= (1 + percentageGain / 12);
    }

    selectedTaxGainValue = selectedTaxGainValue - totalInvest;

    return {
      totalGains: totalInvest + selectedTaxGainValue,
      totalInvest,
      revenuePoupanca,
      selectedTaxGainValue
    }
  }, [initialInvestiment, montlyInvestiment, timeInMonths, parameters.value])

  function moeda(e) {
    let value = e;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
  }

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="w-full flex flex-col">
        <div className="flex flex-col gap-4 my-4">
          <Label>Qual valor você gostaria de investir?</Label>
          <div className="flex flex-row items-center gap-2">
            <p className="font-bold">R$</p>
            <Input
              id="initialInvestiment"
              onChange={(event) =>
                setInitialInvestiment(moeda(event.target.value))
              }
              value={initialInvestiment}
            />
            <Button
              className="border-purple-600 text-purple-600 bg-transparent dark:bg-transparent hover:border-purple-900 hover:text-purple-900"
              variant="outline"
            >
              <FaMinus />
            </Button>
            <Button
              className="border-purple-600 text-purple-600 bg-transparent dark:bg-transparent hover:border-purple-900 hover:text-purple-900"
              variant="outline"
            >
              <FaPlus />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 my-4">
          <Label>Qual valor você gostaria de depositar por mês?</Label>
          <div className="flex flex-row items-center gap-2">
            <p className="font-bold">R$</p>
            <Input
              id="montlyInvestiment"
              onChange={(event) =>
                setMontlyInvestiment(moeda(event.target.value))
              }
              value={montlyInvestiment} />
            <Button
              className="border-purple-600 text-purple-600 bg-transparent dark:bg-transparent hover:border-purple-900 hover:text-purple-900"
              variant="outline"
            >
              <FaMinus />
            </Button>
            <Button
              className="border-purple-600 text-purple-600 bg-transparent dark:bg-transparent hover:border-purple-900 hover:text-purple-900"
              variant="outline"
            >
              <FaPlus />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 my-4">
          <Label>Por quanto tempo deixaria seu dinheiro investido?</Label>
          <p className="text-xl font-semibold mb-4">{marks[timeInMonths]} {parseInt(marks[timeInMonths]) > 1 ? "Meses" : "Mês"}</p>
          <Slider
            onValueChange={(value) => setTimeInMonths(value[0])}
            min={0}
            max={7}
            step={1}
            value={[timeInMonths]}
          />
        </div>
      </div>
      <div className="w-full flex flex-col">
        <p className="text-lg font-semibold mb-4">Em {period.time} {period.description} você teria</p>
        <div className="flex flex-row gap-2">
          <p className="text-3xl font-semibold mb-2">{formatCurrency(estimateRevenue.totalGains)}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <GoQuestion />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[320px] flex flex-col gap-2">
                  <p>
                    Valores utilizados no simulador de investimentos
                    (referentes à data de última atualização - esses
                    valores podem alterar de acordo com o mercado):
                  </p>
                  <ul className="ml-2">
                    <li>- Data da última atualização: 30/06/2022</li>
                    <li>- Porcentagem de rentabilidade da Poupança: 0,50% a.m.</li>
                    <li>- Porcentagem de rentabilidade do {parameters.title}: {parameters.description}</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="w-full h-1 rounded bg-purple-600"></div>
        <div className="flex flex-col my-4 p-2">
          <p className="text-md font-semibold">Valor líquido com os impostos descontados</p>
          <p className="text-md font-semibold">Total investido: {formatCurrency(estimateRevenue.totalInvest)}</p>
          <p className="text-md font-semibold">Na poupança, seu dinheiro renderia: {formatCurrency(estimateRevenue.revenuePoupanca)}</p>
          <p className="text-md font-semibold">No {parameters.title}, seu dinheiro renderia: {formatCurrency(estimateRevenue.selectedTaxGainValue)}</p>
        </div>

      </div>
    </div >
  )
}

export default SimulatorForm