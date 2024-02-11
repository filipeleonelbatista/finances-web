import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import {
  FiPlus
} from "react-icons/fi";
import Ad from "./components/ad";
import EmptyMessage from "./components/empty-message";
import Footer from "./components/footer";
import FormAddStockItem from "./components/form-add-stock-item";
import Header from "./components/header";
import StockItem from "./components/stock-item";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { useStock } from "./hooks/useStock";

function Stock() {
  const [showFilter, setShowFilter] = useState(false);

  const { filteredList, StockList, search, setSearch, selectedCategory, setSelectedCategory, listTotal } = useStock()

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
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 items-center">
      <Header title="Estoque" isShort />
      <div className="w-full max-w-[800px] px-2 gap-4 my-2">

      </div>
      <div className="w-full max-w-[800px] px-2 flex flex-col gap-4 mb-4">
        <Ad />
      </div>

      <div className="w-full max-w-[800px] px-2 flex flex-row justify-between items-center gap-4 mb-4">
        <h2 className="font-bold dark:text-white text-gray-800 text-xl">
          Seu estoque
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
        <div className="w-full flex flex-col gap-1">
          <p className="text-md font-bold dark:text-white text-gray-800 mb-2">
            Categorias
          </p>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos os itens">Todos os itens</SelectItem>
              <SelectItem value="Carnes">Carnes</SelectItem>
              <SelectItem value="Fruteira">Fruteira</SelectItem>
              <SelectItem value="Higiêne">Higiêne</SelectItem>
              <SelectItem value="Limpeza">Limpeza</SelectItem>
              <SelectItem value="Mercearia">Mercearia</SelectItem>
              <SelectItem value="Outros" >Outros</SelectItem>
            </SelectContent >
          </Select >
        </div >
      </div >

      {
        StockList.length > 0 ? (
          <div className="w-full max-w-[800px] flex flex-col gap-3 px-2 py-4">
            <Label>Pesquisar por nome</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Pesquise os itens..."
              />
            </div>
          </div>
        ) : null
      }

      {
        filteredList.length === 0 ? (
          <EmptyMessage />
        ) : (
          <>
            <div className="w-full max-w-[800px] flex flex-col gap-3 px-2 py-4">
              {filteredList.map((item, index) => (
                <StockItem item={item} index={index} key={index} />
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
            <DialogTitle>Adicionar produto ao estoque</DialogTitle>
            <DialogDescription>
              Adicione itens para suas compras de mercado
            </DialogDescription>
          </DialogHeader>
          <FormAddStockItem />
        </DialogContent>
      </Dialog>
    </div >
  );
}

export default Stock;
