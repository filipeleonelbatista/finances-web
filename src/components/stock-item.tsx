import { useStock } from "@/hooks/useStock";
import { CiCircleMinus, CiCirclePlus, CiMoneyBill } from "react-icons/ci";
import { IoBagHandleOutline, IoTrashOutline } from "react-icons/io5";
import { LuPen } from "react-icons/lu";
import FormEditStockItem from "./form-edit-stock-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";


function StockItem({ item, index }) {
  const { deleteTransaction, updateStock } = useStock();

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
    <div
      key={index}
      className="relative px-4 py-3 flex flex-row gap-4 rounded items-center bg-white dark:bg-gray-800 drop-shadow-lg"
    >
      <div className="flex flex-row gap-2 absolute top-2 right-4">
        <p
          data-instock={item.quantityDesired <= item.quantity}
          className="px-4 py-0.5 data-[instock=false]:border-red-600 data-[instock=true]:border-green-600 data-[instock=false]:text-red-600 data-[instock=true]:text-green-600 font-semibold border-[1px] rounded-full text-xs"
        >
          {item.quantityDesired <= item.quantity ? "Em estoque" : "Em falta"}
        </p>
        <button
          className="cursor-pointer"
          onClick={() => deleteTransaction(item)}
        >
          <IoTrashOutline className="w-4 h-4 text-gray-600 dark:text-gray-100 transition-all duration-400 ease-in-out hover:text-red-600 dark:hover:text-redd-300" />
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
              <DialogTitle>Editar produto</DialogTitle>
              <DialogDescription>
                Edite itens para suas compras do mercado.
              </DialogDescription>
            </DialogHeader>
            <FormEditStockItem selectedTransaction={item} />
          </DialogContent>
        </Dialog>
      </div>
      <IoBagHandleOutline className="w-8 h-8 text-gray-800 dark:text-white" />
      <div className="w-full flex flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-thin">{item.description}</h3>
          <p className="text-sm font-semibold">
            {item.category}
          </p>
          <div className="flex gap-1 items-center">
            <CiMoneyBill className="text-2xl" />
            <p>{formatCurrency(item.amount)}</p>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <button onClick={() => item.quantity > 0 && updateStock(item, false, true)}>
              <CiCircleMinus className="w-8 h-8 text-green-600" />
            </button>
            <p>{item.quantity}</p>
            <button onClick={() => updateStock(item, true, false)}>
              <CiCirclePlus className="w-8 h-8 text-red-600" />
            </button>
          </div>
        </div>
        <p className="font-semibold">
          {formatCurrency(item.amount * item.quantity)}
        </p>
      </div>
    </div>
  );
}

export default StockItem;
