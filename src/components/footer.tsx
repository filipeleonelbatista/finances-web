function Footer() {
  return (
    <footer className="bottom-0 p-4 flex flex-col items-center">
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
  );
}

export default Footer;
