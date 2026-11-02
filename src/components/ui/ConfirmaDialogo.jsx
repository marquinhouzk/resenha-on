import Botao from "./Botao.jsx";
import Modal from "./Modal.jsx";

export default function ConfirmaDialogo({ aberto, titulo, mensagem, rotuloConfirmar = "Confirmar", perigo = false, aoConfirmar, aoCancelar }) {
  return (
    <Modal
      aberto={aberto}
      aoFechar={aoCancelar}
      titulo={titulo}
      rodape={
        <>
          <Botao variante="secundario" onClick={aoCancelar}>
            Cancelar
          </Botao>
          <Botao variante={perigo ? "perigo" : "primario"} onClick={aoConfirmar}>
            {rotuloConfirmar}
          </Botao>
        </>
      }
    >
      <p>{mensagem}</p>
    </Modal>
  );
}
