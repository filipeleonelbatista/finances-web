import { usePayments } from "@/hooks/usePayments";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useMemo, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { TbRobotFace } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Typewriter from "./typewriter";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function AiTips() {
  const navigate = useNavigate();
  const { filteredList, Total, Expenses, Incomings } = usePayments();
  const [position, setPosition] = useState(Math.floor(Math.random() * 4));
  const [isShow, setIsShow] = useState(true);

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  };

  const tips = useMemo(() => {
    const tipsArray = []

    if (filteredList.length > 0) {
      // Passo 1: Calcular a soma dos gastos para cada categoria
      const categoryTotals = {};
      filteredList.forEach(transaction => {
        const { category, amount, isEnabled } = transaction;
        if (isEnabled) {
          if (categoryTotals[category]) {
            categoryTotals[category] += amount;
          } else {
            categoryTotals[category] = amount;
          }
        }
      });

      // Passo 2: Encontrar a categoria com o maior somatório
      let maxCategory = null;
      let maxAmount = -Infinity;
      for (const category in categoryTotals) {
        if (categoryTotals[category] > maxAmount) {
          maxAmount = categoryTotals[category];
          maxCategory = category;
        }
      }

      // Passo 3: Retornar o somatório dessa categoria
      const sumOfMaxCategory = categoryTotals[maxCategory];

      tipsArray.push({
        title: "Categoria com maior gasto no período",
        description: `A categoria ${maxCategory} teve um custo total de ${formatCurrency(sumOfMaxCategory ?? "0.00")}. Revise seus gastos nessa categoria e economize dinheiro!`
      })
    }

    if (filteredList.length > 0) {
      // Passo 1: Calcular a data de início e fim da semana atual
      const startOfWeek = dayjs().startOf('week');
      const endOfWeek = dayjs().endOf('week');

      // Passo 2: Iterar sobre as transações e somar as contas da semana atual
      let totalAmount = 0;
      let numberOfTransactions = 0;

      filteredList.forEach(transaction => {
        const { date, amount, isEnabled } = transaction;
        const transactionDate = dayjs(date);

        // Passo 3: Verificar se a transação está dentro da semana atual e se isEnabled é true
        if (transactionDate.isSameOrAfter(startOfWeek) && transactionDate.isSameOrBefore(endOfWeek) && isEnabled) {
          // Somar o valor da transação
          totalAmount += amount;
          // Incrementar o contador de transações
          numberOfTransactions++;
        }
      });

      tipsArray.push({
        title: `Você possui ${numberOfTransactions} contas para esta semana.`,
        description: `O valor total das contas da semana atual é ${formatCurrency(totalAmount)}!\nVerifique a possibilidade de renegociação ou adiantamento para poder reduzir o valor das contas e reter mais dinheiro nesse período.`
      })
    }

    if (Total > 0) {
      tipsArray.push({
        title: `Ganhos x Gastos.`,
        description: `Analisei aqui e vi que você recebeu ${formatCurrency(Incomings)} e gastou ${formatCurrency(Expenses)} no período. ${Total > 0 ? `Parabéns! Você economizou ${formatCurrency(Total)}!` : `Verifique a possibilidade de renegociação ou adiantamento para cumprir com seus compromissos financeiros e não faltar ${formatCurrency(Total)}.`}`
      })
    }

    if (filteredList.length > 0) {
      const filteredArray = filteredList
      filteredArray.sort((a, b) => b.amount - a.amount);

      const sortedAndEnabledArray = filteredArray.filter(item => item.isEnabled);

      const topThreeExpenses = sortedAndEnabledArray.slice(0, 3);

      const stringExpenses = topThreeExpenses.map(tx => `${tx.description} no valor de ${formatCurrency(tx.amount)} com vencimento dia ${new Date(tx.date).toLocaleDateString("pt-BR")}`)

      tipsArray.push({
        title: `Maiores gastos do mês.`,
        description: `Verifiquei aqui suas finanças e vi estes gastos que precisam de sua atenção neste mês.\n${stringExpenses.join("; ")}; \nVerifique a possibilidade de renegociação ou adiantamento para poder cumprir com suas obrigações financeiras e reter mais dinheiro nesse período.`
      })
    }

    return tipsArray ?? [];

  }, [filteredList, Total, Expenses, Incomings])

  if (tips.length === 0) return null;

  return (
    <div data-isshow={isShow} className="relative transition-all duration-400 ease-in-out w-full overflow-hidden h-0 p-[0px] data-[isshow=true]:h-fit rounded data-[isshow=true]:p-4 bg-purple-300 dark:bg-purple-700 data-[isshow=true]:border data-[isshow=true]:border-purple-600 data-[isshow=true]:dark:border-purple-200 space-y-2">
      <button className="absolute top-4 right-4" onClick={() => setIsShow(false)}>
        <IoCloseCircleOutline className="w-8 h-8" />
      </button>
      <div className="flex gap-2 items-center" style={{ margin: "0px !important" }}>
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <TbRobotFace className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold">
          <Typewriter text="Tutu tem uma mensagem para você..." />
        </p>
      </div>

      <p className="text-sm font-semibold">
        <Typewriter text={tips[position].title} />
      </p>
      <p className="text-sm italic">
        <Typewriter text={tips[position].description} indicator={true} />
      </p>
      {position == 2 && (
        <div className="w-full flex flex-row gap-6">
          <p className="text-sm italic">
            <Typewriter text={"Aproveite e simule investimentos para ter o dinheiro trabalhando para você"} indicator={true} />
          </p>
          <Button onClick={() => navigate("investiments")}>Simular investimentos</Button>
        </div>
      )}
      <p className="text-[10px] pt-4 italic">
        Assistente financeiro digital TUTU (beta)
      </p>
    </div>
  );
}

export default AiTips;
