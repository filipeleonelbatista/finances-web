import emptyImage from "../assets/add_notes.png";

export default function EmptyMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-10">
      <img alt="No Data" src={emptyImage} style={{ width: 250, height: 250 }} />
      <p className="dark:text-white text-gray-800 text-xl text-center">
        Toque em '+' para itens para
        <br />
        adicionar itens à tabela!
      </p>
    </div>
  );
}
