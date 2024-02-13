import Footer from "../components/footer";
import Header from "../components/header";

function Settings() {

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 items-center">
      <Header title="Configuracoe" isShort />
      <div className="w-full max-w-[800px] px-2 gap-4 my-2">

      </div>
      <Footer />
    </div>
  );
}

export default Settings;
