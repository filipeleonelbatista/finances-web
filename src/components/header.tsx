import { FaCog } from 'react-icons/fa';
import { FiHome } from "react-icons/fi";
import { GiShoppingCart } from "react-icons/gi";
import { LuLineChart } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
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

interface HeaderProps {
  title: string;
  isShort?: boolean;
}

function Header({ title = "", isShort }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div data-isshort={isShort} className="w-full min-h-48 data-[isshort=true]:min-h-24 flex flex-col bg-purple-600 p-8 items-center">
      <header className="w-full px-2 flex flex-row justify-between max-w-[800px]">
        <h2 className="font-bold text-white text-2xl">
          {title}<span className="text-purple-900">$</span>
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
                <DropdownMenuItem onClick={() => navigate("/")}>
                  Finanças
                  <DropdownMenuShortcut>
                    <FiHome />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/reports")}>
                  Relatórios
                  <DropdownMenuShortcut>
                    <LuLineChart />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/stock")}>
                  Estoque
                  <DropdownMenuShortcut>
                    <GiShoppingCart />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/investiments")}>
                  Simule investimentos
                  <DropdownMenuShortcut>
                    <LuLineChart />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
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
