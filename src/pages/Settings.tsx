import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import Papa from "papaparse";
import { FaRegFileLines } from "react-icons/fa6";
import Footer from "../components/footer";
import Header from "../components/header";

import { useToast } from "@/components/ui/use-toast";
import { usePayments } from "@/hooks/usePayments";
import { IoTrashOutline } from "react-icons/io5";
import { useSettings } from "@/hooks/useSettings";
import { useStock } from "@/hooks/useStock";

function Settings() {
  const { toast } = useToast()

  const {
    importTransactions,
    transactionsList,
    deleteAllTransaction
  } = usePayments();

  const {
    deleteAllTransaction: deleteAllStocks,
    importTransactions: importStocks,
    StockList
  } = useStock();

  const {
    handleSwitchViewTotalHistoryCard,
    isEnableTotalHistoryCard,
    handleSwitchViewTitheCard,
    isEnableTitheCard,
    willUsePrefixToRemoveTihteSum,
    handleWillRemovePrefixToRemove,
    handleSetPrefixTithe,
    prefixTithe
  } = useSettings();

  const handleCsvExport = () => {
    const headers = Object.keys(transactionsList[0]);
    const csvContent = [
      headers.join(','),
      ...transactionsList.map(obj => `${obj.id},${obj._status ?? ""},${obj._created ?? ""},${obj.description},${obj.amount},${obj.category},${new Date(obj.date).getTime()},${obj.paymentDate === "" ? obj.paymentDate : new Date(obj.paymentDate).getTime()},${obj.paymentStatus ? "1" : "0"},${obj.isEnabled ? "1" : "0"},${obj.isFavorited ? "1" : "0"}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    toast({
      description: "Exportação feita com sucesso!",
      variant: "success"
    })

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financas-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handleArquivoChange = async (event) => {
    const arquivoSelecionado = event.target.files[0];

    if (arquivoSelecionado && arquivoSelecionado.name.endsWith(".csv")) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const csvContent = e.target.result;

        try {
          Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const records = result.data;

              const requiredCampos = [
                "id",
                "_status",
                "_changed",
                "description",
                "amount",
                "category",
                "date",
                "paymentDate",
                "paymentStatus",
                "isEnabled",
                "isFavorited",
              ];

              const isValidCSV = records.every((record) =>
                requiredCampos.every((campo) => campo in record)
              );

              if (isValidCSV) {
                importTransactions(records);
              } else {
                toast({
                  description: "O arquivo CSV está mal formatado. Verifique se todos os campos necessários estão presentes.",
                  variant: "destructive"
                })
              }
            },
          });
        } catch (error) {
          toast({
            description: "Erro ao analisar o arquivo CSV!",
            variant: "destructive"
          })
          console.error("Erro ao analisar o arquivo CSV:", error);
        }
      };

      reader.readAsText(arquivoSelecionado);

      toast({
        description: "Arquivo importado com sucesso!",
        variant: "destructive"
      })
    } else {
      toast({
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      })
    }
  };

  const handleCsvExportStock = () => {
    const headers = Object.keys(StockList[0]);
    const csvContent = [
      headers.join(','),
      ...StockList.map(obj => `${obj.id},${obj._status ?? ""},${obj._created ?? ""},${obj.description},${obj.category},${obj.amount},${obj.quantity},${obj.quantityDesired},`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    toast({
      description: "Exportação feita com sucesso!",
      variant: "success"
    })

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `estoque-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handleArquivoChangeStock = async (event) => {
    const arquivoSelecionado = event.target.files[0];

    if (arquivoSelecionado && arquivoSelecionado.name.endsWith(".csv")) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const csvContent = e.target.result;

        try {
          Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const records = result.data;

              const requiredCampos = [
                "id",
                "_status",
                "_changed",
                "description",
                "amount",
                "category",
                "quantity",
                "quantityDesired",
              ];

              const isValidCSV = records.every((record) =>
                requiredCampos.every((campo) => campo in record)
              );

              if (isValidCSV) {
                importStocks(records);
              } else {
                toast({
                  description: "O arquivo CSV está mal formatado. Verifique se todos os campos necessários estão presentes.",
                  variant: "destructive"
                })
              }
            },
          });
        } catch (error) {
          toast({
            description: "Erro ao analisar o arquivo CSV!",
            variant: "destructive"
          })
          console.error("Erro ao analisar o arquivo CSV:", error);
        }
      };

      reader.readAsText(arquivoSelecionado);

      toast({
        description: "Arquivo importado com sucesso!",
        variant: "destructive"
      })
    } else {
      toast({
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      })
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 items-center">
      <Header title="Configuracoe" isShort />
      <div className="w-full max-w-[800px] px-2 gap-4 my-2">

        <div className="w-full flex flex-col gap-2 md:gap-4">
          <p className="text-2xl font-bold mb-4">Finanças</p>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnableTotalHistoryCard}
              onCheckedChange={handleSwitchViewTotalHistoryCard}
              id="isEnableTotalHistoryCard"
            />
            <Label htmlFor="isEnableTotalHistoryCard">Habilitar card de Saldo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnableTitheCard}
              onCheckedChange={handleSwitchViewTitheCard}
              id="isEnableTitheCard"
            />
            <Label htmlFor="isEnableTitheCard">Habilitar card de Dízimo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={willUsePrefixToRemoveTihteSum}
              onCheckedChange={handleWillRemovePrefixToRemove}
              id="handleWillRemovePrefixToRemove"
            />
            <Label htmlFor="handleWillRemovePrefixToRemove">Remover itens com o prefixo da soma do dízimo</Label>
          </div>

          <div>
            <Label htmlFor="prefixTithe">Prefixo</Label>
            <Input
              id="prefixTithe"
              onChange={(event => handleSetPrefixTithe(event.target.value))}
              value={prefixTithe}
              disabled={!willUsePrefixToRemoveTihteSum}
            />
            <p>Se o titulo da transação tiver este prefixo não será contado na soma do dízimo</p>
          </div>

          <Button onClick={handleCsvExport} className="bg-purple-600 hover:bg-purple-900">
            <FaRegFileLines className="mr-2" />
            Exportar finanças
          </Button>
          <div className="w-full flex flex-col">
            <Button onClick={() => document.getElementById("csv")?.click()} className="bg-purple-600 hover:bg-purple-900">
              <FaRegFileLines className="mr-2" />
              Importar finanças
            </Button>
            <p>Use um arquivo <b>.CSV</b> gerado pelo sistema para importar os dados de um amigo ou familiar</p>
            <div className="sr-only">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csv">csv</Label>
                <Input
                  hidden
                  id="csv"
                  type="file"
                  accept=".csv"
                  value=""
                  onChange={(event) => handleArquivoChange(event)}
                />
              </div>
            </div>
          </div>
          <Button onClick={deleteAllTransaction} className="bg-red-600 hover:bg-red-900">
            <IoTrashOutline className="mr-2" />
            Apagar finanças
          </Button>

        </div>

        <div className="w-full bg-gray-500 dark:bg-gray-400 h-[1px] my-2 md:my-4"></div>


        <div className="w-full flex flex-col gap-2 md:gap-4">
          <p className="text-2xl font-bold mb-4">Estoque</p>

          <Button onClick={handleCsvExportStock} className="bg-purple-600 hover:bg-purple-900">
            <FaRegFileLines className="mr-2" />
            Exportar lista de estoque
          </Button>
          
          <div className="w-full flex flex-col">
            <Button onClick={() => document.getElementById("csvStock")?.click()} className="bg-purple-600 hover:bg-purple-900">
              <FaRegFileLines className="mr-2" />
              Importar lista de estoque
            </Button>
            <p>Use um arquivo <b>.CSV</b> gerado pelo sistema para importar os dados de um amigo ou familiar</p>
            <div className="sr-only">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csvStock">csv</Label>
                <Input
                  hidden
                  id="csvStock"
                  type="file"
                  accept=".csv"
                  value=""
                  onChange={(event) => handleArquivoChangeStock(event)}
                />
              </div>
            </div>
          </div>
          <Button onClick={deleteAllStocks} className="bg-red-600 hover:bg-red-900">
            <IoTrashOutline className="mr-2" />
            Apagar lista de estoque
          </Button>

        </div>

        <div className="w-full bg-gray-500 dark:bg-gray-400 h-[1px] my-2 md:my-4"></div>

      </div>
      <Footer />
    </div>
  );
}

export default Settings;
