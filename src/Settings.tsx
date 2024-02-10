import Footer from "./components/footer";
import Header from "./components/header";

function Settings() {

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 items-center">
      <Header title="Configuracoe" />
      <div className="w-full max-w-[800px] px-2 grid sm:grid-rows-3 sm:grid-cols-none md:grid-rows-none md:grid-cols-3 gap-4 mt-[-64px] mb-2">

      </div>
      <Footer />
    </div>
  );
}

export default Settings;
