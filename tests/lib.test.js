import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { destacar, filtrarNotas, normalizar } from "../src/lib/busca.js";
import { compararTextos } from "../src/lib/comparar.js";
import { atividadePorDia, contagemPorPasta, mediaConfianca, percentual, resumoNotas, sequenciaDeDias } from "../src/lib/estatisticas.js";
import { dadosReducer, purgarExpiradas } from "../src/lib/dadosReducer.js";
import { montarSemente } from "../src/lib/semente.js";
import { hashSenha } from "../src/lib/senha.js";
import { validarEmail, validarSenha } from "../src/lib/validacao.js";
import { nomeDeArquivo } from "../src/lib/exportar.js";
import { diasAteLembrete, diasEntre } from "../src/lib/datas.js";

const lerApi = (nome) => JSON.parse(readFileSync(new URL(`../public/api/${nome}.json`, import.meta.url), "utf8"));
const AGORA = new Date("2026-11-01T15:00:00");
const semente = () => montarSemente({ pastas: lerApi("pastas"), notas: lerApi("notas") }, { agora: AGORA });

test("busca ignora acento e caixa", () => {
  assert.equal(normalizar("Função ÁGIL"), "funcao agil");
  const { notas } = semente();
  const achadas = filtrarNotas(notas.filter((n) => !n.excluidaEm), { consulta: "FUNCAO parametros" });
  assert.deepEqual(achadas.map((n) => n.id), ["n_funcoes"]);
});

test("destacar preserva o texto original e marca os termos", () => {
  const partes = destacar("Função com parâmetros", "funcao parametros");
  assert.equal(partes.map((p) => p.texto).join(""), "Função com parâmetros");
  assert.deepEqual(partes.filter((p) => p.marca).map((p) => p.texto), ["Função", "parâmetros"]);
  assert.deepEqual(destacar("abc", ""), [{ texto: "abc", marca: false }]);
});

test("filtros por pasta, visibilidade e favoritas", () => {
  const ativas = semente().notas.filter((n) => !n.excluidaEm);
  assert.ok(filtrarNotas(ativas, { pastaId: "p_web" }).every((n) => n.pastaId === "p_web"));
  assert.ok(filtrarNotas(ativas, { visibilidade: "publicas" }).every((n) => !n.privada));
  assert.ok(filtrarNotas(ativas, { favoritas: true }).every((n) => n.favorita));
  assert.deepEqual(filtrarNotas(ativas, { pastaId: "sem-pasta" }).map((n) => n.id), ["n_pitch"]);
  assert.equal(filtrarNotas(ativas, { ordem: "recentes" })[0].id, "n_hooks");
});

test("semente monta datas relativas, lembretes e lixeira", () => {
  const s = semente();
  assert.equal(s.pastas.length, 5);
  assert.equal(s.notas.length, 12);
  assert.equal(s.notas.find((n) => n.id === "n_entrega").lembrete, "2026-11-03");
  assert.ok(s.notas.find((n) => n.id === "n_wireframe").excluidaEm);
  assert.equal(montarSemente({ pastas: lerApi("pastas"), notas: lerApi("notas") }, { incluirNotas: false }).notas.length, 0);
  assert.equal(diasAteLembrete("2026-11-03", AGORA), 2);
});

test("estatísticas usam Math para arredondar", () => {
  assert.equal(percentual(1, 3), 33);
  assert.equal(percentual(1, 0), 0);
  assert.equal(mediaConfianca([{ confianca: 90 }, { confianca: 95 }, { confianca: null }]), 93);
  const s = semente();
  const r = resumoNotas(s.notas);
  assert.equal(r.ativas, 11);
  assert.equal(r.lixeira, 1);
  assert.equal(r.privadas + r.publicas, r.ativas);
  const porPasta = contagemPorPasta(s.notas.filter((n) => !n.excluidaEm), s.pastas);
  assert.equal(porPasta.reduce((soma, p) => soma + p.total, 0), 11);
});

test("atividade por dia e sequência", () => {
  const hist = semente().historico;
  const dias = atividadePorDia(hist, 7, AGORA);
  assert.equal(dias.length, 7);
  assert.equal(dias[6].hoje, true);
  assert.ok(dias[6].total >= 1);
  assert.ok(sequenciaDeDias(hist, AGORA) >= 1);
});

test("comparar textos calcula linhas em comum e similaridade", () => {
  const r = compararTextos("a\nb\nc", "B\nc\nd");
  assert.equal(r.comuns, 2);
  assert.equal(r.similaridade, 50);
  assert.equal(r.a[0].comum, false);
  assert.equal(r.a[1].comum, true);
});

test("reducer: criar, editar, excluir, restaurar e excluir definitivo", () => {
  let e = dadosReducer(null, { tipo: "CARREGAR", estado: semente(), agora: AGORA.toISOString() });
  const em = AGORA.toISOString();
  e = dadosReducer(e, { tipo: "CRIAR_NOTA", em, nota: { id: "x1", titulo: "Nova", texto: "t", pastaId: null, criadoEm: em, atualizadoEm: em, privada: true, favorita: false, confianca: 90, origem: "camera", lembrete: null, excluidaEm: null } });
  assert.equal(e.historico[0].acao, "criou");
  e = dadosReducer(e, { tipo: "EDITAR_NOTA", id: "x1", patch: { titulo: "Nova 2" }, em });
  assert.equal(e.notas.find((n) => n.id === "x1").titulo, "Nova 2");
  e = dadosReducer(e, { tipo: "EXCLUIR_NOTA", id: "x1", em });
  assert.ok(e.notas.find((n) => n.id === "x1").excluidaEm);
  e = dadosReducer(e, { tipo: "RESTAURAR_NOTA", id: "x1", em });
  assert.equal(e.notas.find((n) => n.id === "x1").excluidaEm, null);
  e = dadosReducer(e, { tipo: "EXCLUIR_NOTA", id: "x1", em });
  e = dadosReducer(e, { tipo: "EXCLUIR_DEFINITIVO", id: "x1", em });
  assert.equal(e.notas.some((n) => n.id === "x1"), false);
  const antes = e.notas.filter((n) => n.excluidaEm).length;
  e = dadosReducer(e, { tipo: "ESVAZIAR_LIXEIRA", em });
  assert.equal(antes, 1);
  assert.equal(e.notas.filter((n) => n.excluidaEm).length, 0);
});

test("reducer: pastas e reordenação manual", () => {
  let e = dadosReducer(null, { tipo: "CARREGAR", estado: semente(), agora: AGORA.toISOString() });
  e = dadosReducer(e, { tipo: "REORDENAR_PASTA", id: "p_front", direcao: -1 });
  const ordenadas = [...e.pastas].sort((a, b) => a.ordem - b.ordem).map((p) => p.id);
  assert.deepEqual(ordenadas.slice(0, 2), ["p_front", "p_web"]);
  e = dadosReducer(e, { tipo: "REORDENAR_NOTA", id: "n_breakpoints", direcao: -1 });
  const grid = e.notas.find((n) => n.id === "n_grid");
  const bp = e.notas.find((n) => n.id === "n_breakpoints");
  assert.ok(bp.ordem < grid.ordem);
  e = dadosReducer(e, { tipo: "REMOVER_PASTA", id: "p_front" });
  assert.equal(e.notas.find((n) => n.id === "n_grid").pastaId, null);
  assert.equal(e.pastas.some((p) => p.id === "p_front"), false);
});

test("lixeira apaga itens com mais de 30 dias", () => {
  const velhas = [
    { id: "a", excluidaEm: "2026-09-01T10:00:00.000Z" },
    { id: "b", excluidaEm: "2026-10-25T10:00:00.000Z" },
    { id: "c", excluidaEm: null },
  ];
  assert.deepEqual(purgarExpiradas(velhas, AGORA).map((n) => n.id), ["b", "c"]);
});

test("login: usuários de teste conferem com o hash", async () => {
  const usuarios = lerApi("usuarios");
  const demo = usuarios.find((u) => u.email === "demo@resenhaon.app");
  assert.equal(demo.senhaHash, await hashSenha("Resenha@2026"));
  assert.notEqual(demo.senhaHash, await hashSenha("errada123"));
});

test("validações e utilitários", () => {
  assert.notEqual(validarEmail("abc"), "");
  assert.equal(validarEmail("a@b.com"), "");
  assert.notEqual(validarSenha("curta1"), "");
  assert.notEqual(validarSenha("somenteletras"), "");
  assert.equal(validarSenha("Resenha2026"), "");
  assert.equal(nomeDeArquivo("Função: Hooks & Estado!"), "funcao-hooks-estado");
  assert.equal(diasEntre("2026-10-30T23:00:00", new Date("2026-11-01T01:00:00")), 2);
});
