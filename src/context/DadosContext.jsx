import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import { dadosReducer } from "../lib/dadosReducer.js";
import { gerarId } from "../lib/id.js";
import { montarSemente, VERSAO_DADOS } from "../lib/semente.js";
import { api } from "../services/api.js";
import { CHAVES, gravar, ler } from "../services/armazenamento.js";

export const DadosContext = createContext(null);

const agoraISO = () => new Date().toISOString();

export function DadosProvider({ children }) {
  const { usuario } = useAuth();
  const [estado, dispatch] = useReducer(dadosReducer, null);
  const [status, setStatus] = useState("carregando");
  const [erro, setErro] = useState("");
  const chave = CHAVES.dados(usuario.id);

  // Primeiro acesso: busca a "semente" na API. Depois, tudo vem do localStorage.
  const carregar = useCallback(
    async (forcarApi = false) => {
      setStatus("carregando");
      setErro("");
      try {
        const salvo = forcarApi ? null : ler(chave, null);
        if (salvo && salvo.versao === VERSAO_DADOS) {
          dispatch({ tipo: "CARREGAR", estado: salvo, agora: agoraISO() });
        } else {
          const [pastas, notas] = await Promise.all([api.pastas(), usuario.semente ? api.notas() : Promise.resolve([])]);
          const inicial = montarSemente({ pastas, notas }, { incluirNotas: usuario.semente });
          dispatch({ tipo: "CARREGAR", estado: inicial, agora: agoraISO() });
        }
        setStatus("pronto");
      } catch (e) {
        setErro(e.message);
        setStatus("erro");
      }
    },
    [chave, usuario.semente],
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    if (estado && status === "pronto") gravar(chave, estado);
  }, [estado, status, chave]);

  const acoes = useMemo(
    () => ({
      criarNota: (dados) => {
        const em = agoraISO();
        const nota = {
          id: gerarId("n"),
          titulo: dados.titulo.trim(),
          texto: dados.texto.trim(),
          pastaId: dados.pastaId || null,
          criadoEm: em,
          atualizadoEm: em,
          privada: dados.privada ?? true,
          favorita: false,
          confianca: dados.confianca ?? null,
          origem: dados.origem ?? "manual",
          lembrete: dados.lembrete || null,
          excluidaEm: null,
        };
        dispatch({ tipo: "CRIAR_NOTA", nota, em });
        return nota.id;
      },
      editarNota: (id, patch) => dispatch({ tipo: "EDITAR_NOTA", id, patch, em: agoraISO() }),
      alternarFavorita: (id) => dispatch({ tipo: "ALTERNAR_FAVORITA", id }),
      alternarPrivada: (id) => dispatch({ tipo: "ALTERNAR_PRIVADA", id, em: agoraISO() }),
      moverNota: (id, pastaId) => dispatch({ tipo: "MOVER_NOTA", id, pastaId: pastaId || null, em: agoraISO() }),
      reordenarNota: (id, direcao) => dispatch({ tipo: "REORDENAR_NOTA", id, direcao }),
      excluirNota: (id) => dispatch({ tipo: "EXCLUIR_NOTA", id, em: agoraISO() }),
      restaurarNota: (id) => dispatch({ tipo: "RESTAURAR_NOTA", id, em: agoraISO() }),
      excluirDefinitivo: (id) => dispatch({ tipo: "EXCLUIR_DEFINITIVO", id, em: agoraISO() }),
      esvaziarLixeira: () => dispatch({ tipo: "ESVAZIAR_LIXEIRA", em: agoraISO() }),
      registrarExportacao: (id) => dispatch({ tipo: "REGISTRAR_EXPORTACAO", id, em: agoraISO() }),
      criarPasta: (nome, cor) => {
        const id = gerarId("p");
        dispatch({ tipo: "CRIAR_PASTA", pasta: { id, nome: nome.trim(), cor } });
        return id;
      },
      editarPasta: (id, patch) => dispatch({ tipo: "EDITAR_PASTA", id, patch }),
      removerPasta: (id) => dispatch({ tipo: "REMOVER_PASTA", id }),
      reordenarPasta: (id, direcao) => dispatch({ tipo: "REORDENAR_PASTA", id, direcao }),
      atualizarConfig: (patch) => dispatch({ tipo: "ATUALIZAR_CONFIG", patch }),
      tornarTodasPrivadas: () => dispatch({ tipo: "TORNAR_TODAS_PRIVADAS" }),
      limparHistorico: () => dispatch({ tipo: "LIMPAR_HISTORICO" }),
    }),
    [],
  );

  const valor = useMemo(() => {
    const notas = estado?.notas ?? [];
    const pastas = [...(estado?.pastas ?? [])].sort((a, b) => a.ordem - b.ordem);
    return {
      status,
      erro,
      recarregar: () => carregar(false),
      restaurarDemonstracao: () => carregar(true),
      notas,
      notasAtivas: notas.filter((n) => !n.excluidaEm),
      lixeira: notas.filter((n) => n.excluidaEm),
      pastas,
      historico: estado?.historico ?? [],
      config: estado?.config ?? { notificacoes: true, antecedenciaDias: 3, privadaPorPadrao: true },
      estadoBruto: estado,
      ...acoes,
    };
  }, [estado, status, erro, acoes, carregar]);

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>;
}
