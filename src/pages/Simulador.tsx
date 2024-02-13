import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "../components/footer";
import Header from "../components/header";
import SimulatorForm from "@/components/simulator-form";

function Simulador() {

  const tabs = [
    {
      id: "tesouroPrefixado",
      title: "Tesouro Prefixado",
      description: "13,08% a.a",
      value: 13.08 / 100
    },
    {
      id: "tesouroSelic",
      title: "Tesouro Selic",
      description: "13,25% a.a",
      value: 13.25 / 100
    },
    {
      id: "tesouroIPCA+",
      title: "Tesouro IPCA+",
      description: "IPCA + 5,93% (Inflação 7,07% a.a.)",
      value: (6.24 + 5.93) / 100
    },
    {
      id: "CDBeLC",
      title: "CDB e LC",
      description: "127% do CDI",
      value: 11.15 / 100
    },
    {
      id: "LCIeLCA",
      title: "LCI e LCA",
      description: "98% do CDI",
      value: 8.8 / 100
    },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 items-center">
      <Header title="Sumule seus investimento" isShort />
      <div className="w-full max-w-[800px] px-2 gap-4 my-2">
        <div className="flex flex-col gap-2 my-4">
          <p>
            Veja quanto seu dinheiro pode render ao simular investimentos de tesouro direto, CDB e LC, LCI e LCA em relação a poupança.
          </p>
        </div>


        <div className="w-full my-4">
          <Tabs defaultValue={tabs[0].id} className="w-full">
            <TabsList>
              {
                tabs.map((item, index) => <TabsTrigger key={index} value={item.id}>{item.title}</TabsTrigger>)
              }
            </TabsList>
            {
              tabs.map((item, index) => (
                <TabsContent key={index} value={item.id}>
                  <SimulatorForm parameters={item} />
                </TabsContent>
              ))
            }
          </Tabs>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Simulador;
