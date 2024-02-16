import Ad from "./ad";

function Footer() {
  return (
    <>
      <div className="w-full max-w-[800px] px-2 flex flex-col gap-4 mb-4">
        <Ad />
      </div>
      <footer className="bottom-0 p-4 flex flex-col items-center space-y-1">
        <p className="text-muted-foreground text-xs">Ver.: 1.2.8</p>
        <a
          href="https://play.google.com/store/apps/details?id=com.finances"
          className="text-purple-600 font-semibold"
        >
          Finanças - Controle seus gastos (Baixe o app Android)
        </a>
        <p>
          Desenvolvido com ❤️ por{" "}
          <a
            className="text-purple-600 font-semibold"
            href="https://filipeleonelbatista.vercel.app"
          >
            Filipe Batista
          </a>
        </p>
      </footer>
    </>
  );
}

export default Footer;
