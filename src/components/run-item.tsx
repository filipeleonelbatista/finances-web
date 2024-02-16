
import { useRuns } from "@/hooks/useRuns";
import { IoTrashOutline } from "react-icons/io5";
import { PiGasPump } from "react-icons/pi";

function RunItem({ item, index }) {

  const { deleteTransaction } = useRuns();

  return (
    <div
      key={index}
      className="relative px-4 py-3 flex flex-row gap-4 rounded items-center bg-white dark:bg-gray-800 drop-shadow-lg"
    >
      <div className="flex flex-row gap-2 absolute top-2 right-4">
        <button
          className="cursor-pointer"
          onClick={() => deleteTransaction(item)}
        >
          <IoTrashOutline className="w-4 h-4 text-gray-600 dark:text-gray-100 transition-all duration-400 ease-in-out hover:text-red-600 dark:hover:text-redd-300" />
        </button>
      </div>

      <PiGasPump className="w-8 h-8 text-green-600" />

      <div className="w-full flex flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{item.location}</h3>
          <p>
            Km no Abast.: {item.currentDistance}
          </p>

          <p>
            {new Date(item.date).toLocaleDateString("pt-BR")}
          </p>
          <p>
            {item.unityAmount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })} - {(item.amount / item.unityAmount).toFixed(2)} Litros
          </p>
        </div>
        <p className="font-semibold">
          {item.amount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </p>
      </div>
    </div>
  );
}

export default RunItem;
