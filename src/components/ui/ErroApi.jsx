import Botao from "./Botao.jsx";

export default function ErroApi({ mensagem, aoTentarDeNovo }) {
  return (
    <div role="alert" className="grid justify-items-start gap-3 rounded-2xl border border-rosa/40 bg-white p-6">
      <h3 className="text-lg font-bold text-rosa">Não deu para carregar</h3>
      <p className="text-grafite">{mensagem}</p>
      {aoTentarDeNovo && <Botao onClick={aoTentarDeNovo}>Tentar de novo</Botao>}
    </div>
  );
}
