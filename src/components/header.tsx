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
import { RxHamburgerMenu } from "react-icons/rx";
import { FiHome } from "react-icons/fi";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import { LuLineChart } from "react-icons/lu";

function Header() {
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
                <DropdownMenuItem>
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
    </div>
  );
}
export default Header;
