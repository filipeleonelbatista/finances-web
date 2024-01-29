import { usePayments } from "@/hooks/usePayments";
import Papa from "papaparse";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { LuLineChart } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function Header() {
  const { importTransactions } = usePayments();

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
                alert(
                  "O arquivo CSV está mal formatado. Verifique se todos os campos necessários estão presentes."
                );
              }
            },
          });
        } catch (error) {
          console.error("Erro ao analisar o arquivo CSV:", error);
        }
      };

      reader.readAsText(arquivoSelecionado);
    } else {
      alert("Por favor, selecione um arquivo CSV.");
    }
  };

  return (
    <div className="w-full min-h-48 flex flex-col bg-purple-600 p-8 items-center">
      <header className="w-full px-2 flex flex-row justify-between max-w-[800px]">
        <h2 className="font-bold text-white text-2xl">
          Finança<span className="text-purple-900">$</span>
        </h2>

        <div className="flex flex-row gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="border-white text-white bg-purple-600 hover:bg-purple-600 hover:border-purple-300 hover:text-purple-300"
                variant="outline"
              >
                <RxHamburgerMenu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Finança$</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Finanças
                  <DropdownMenuShortcut>
                    <FiHome />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.getElementById("csv")?.click()}
                >
                  Importar dados
                  <DropdownMenuShortcut>
                    <BsFiletypeCsv />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Relatórios
                  <DropdownMenuShortcut>
                    <LuLineChart />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Configurações
                  <DropdownMenuShortcut>
                    <FaCog />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
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
  );
}
export default Header;
