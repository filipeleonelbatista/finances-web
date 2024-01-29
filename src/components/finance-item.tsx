import { usePayments } from "@/hooks/usePayments";
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiAtSign,
  FiCoffee,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiShoppingCart,
} from "react-icons/fi";
import { GiLipstick } from "react-icons/gi";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import {
  IoCarSportOutline,
  IoMedkitOutline,
  IoSchoolOutline,
  IoShirtOutline,
} from "react-icons/io5";
import { LuLineChart, LuPen } from "react-icons/lu";
import { RiAlarmWarningLine } from "react-icons/ri";
import { SiNetflix } from "react-icons/si";
import FormEditTransaction from "./form-edit-transactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function FinanceItem({ item, index }) {
  const categoryItemLib = {
    Outros: <FiDollarSign className="w-8 h-8 text-red-600" />,
    Moradia: <FiHome className="w-8 h-8 text-red-600" />,
    Vestuário: <IoShirtOutline className="w-8 h-8 text-red-600" />,
    Streaming: <SiNetflix className="w-8 h-8 text-red-600" />,
    Estudos: <IoSchoolOutline className="w-8 h-8 text-red-600" />,
    Beleza: <GiLipstick className="w-8 h-8 text-red-600" />,
    Emprestimos: <RiAlarmWarningLine className="w-8 h-8 text-red-600" />,
    Emergência: <RiAlarmWarningLine className="w-8 h-8 text-red-600" />,
    Mercado: <FiShoppingCart className="w-8 h-8 text-red-600" />,
    "TV/Internet/Telefone": <FiAtSign className="w-8 h-8 text-red-600" />,
    Transporte: <IoCarSportOutline className="w-8 h-8 text-red-600" />,
    Saúde: <IoMedkitOutline className="w-8 h-8 text-red-600" />,
    Cartão: <FiCreditCard className="w-8 h-8 text-red-600" />,
    "Bares e Restaurantes": <FiCoffee className="w-8 h-8 text-red-600" />,
    Ganhos: <FiDollarSign className="w-8 h-8 text-green-600" />,
    Investimentos: <LuLineChart className="w-8 h-8 text-green-600" />,
  };

  const { handleFavorite } = usePayments();

  return (
    <div
      key={index}
      className="relative px-4 py-3 flex flex-row gap-4 rounded items-center bg-white dark:bg-gray-800 drop-shadow-lg"
    >
      <div className="flex flex-row gap-2 absolute top-2 right-4">
        {item.isEnabled && (
          <p
            data-paymentstatus={item.paymentStatus}
            className="px-4 py-0.5 data-[paymentstatus=false]:border-red-600 data-[paymentstatus=true]:border-green-600 data-[paymentstatus=false]:text-red-600 data-[paymentstatus=true]:text-green-600 font-semibold border-[1px] rounded-full text-xs"
          >
            {item.paymentStatus ? "Pago" : "Não Pago"}
          </p>
        )}
        <button className="cursor-pointer" onClick={() => handleFavorite(item)}>
          {item.isFavorited ? (
            <IoIosStar className="w-4 h-4 text-yellow-600 dark:text-yellow-300 transition-all duration-400 ease-in-out hover:text-yellow-900" />
          ) : (
            <IoIosStarOutline className="w-4 h-4 text-gray-600 dark:text-gray-100 transition-all duration-400 ease-in-out hover:text-gray-900" />
          )}
        </button>
        <Dialog>
          <DialogTrigger
            className="cursor-pointer"
            onClick={() => console.log("oi")}
          >
            <LuPen className="w-4 h-4 text-gray-600 dark:text-gray-100 transition-all duration-400 ease-in-out hover:text-gray-900" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar transação</DialogTitle>
              <DialogDescription>
                Edite informações sobre a transação selecionada.
              </DialogDescription>
            </DialogHeader>
            <FormEditTransaction selectedTransaction={item} />
          </DialogContent>
        </Dialog>
      </div>
      {item.isEnabled ? (
        item.category ? (
          categoryItemLib[item.category]
        ) : (
          <FiArrowDownCircle className="w-8 h-8 text-red-600" />
        )
      ) : (
        <FiArrowUpCircle className="w-8 h-8 text-green-600" />
      )}
      <div className="w-full flex flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{item.description}</h3>
          <p>
            {item.isEnabled ? "Dt. Venc.: " : "Dt. Receb.: "}
            {new Date(item.date).toLocaleDateString("pt-BR")}
          </p>
          {item.paymentDate !== "" && item.isEnabled && (
            <p>
              Dt. Pgto.:{" "}
              {new Date(item.paymentDate).toLocaleDateString("pt-BR")}
            </p>
          )}
          <p>
            {"Cat.: "}
            {item.category}
          </p>
        </div>
        <p className="font-semibold">
          {item.isEnabled ? "-" : ""}
          {item.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </p>
      </div>
    </div>
  );
}

export default FinanceItem;
