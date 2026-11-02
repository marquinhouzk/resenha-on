# Resenha ON | Modo Estudo da câmera JOVI

Projeto do **FIAP Challenge 2026** em parceria com a **JOVI Smartphone** (Sprint 4: Front-End Design + Web Development, entrega conjunta).

A **Resenha ON** é um modo de câmera pensado para estudantes full-time: o aluno aponta para o quadro, o slide ou a apostila, a câmera corrige a perspectiva, reconhece o texto e guarda tudo na pasta da disciplina certa. Esta entrega evolui a landing page da Sprint 3 (HTML + CSS Grid) para uma aplicação React completa, com a landing page pública e uma **área do aluno** (o caderno web) protegida por login.

## Links

- Deploy na Vercel: **COLE_AQUI_O_LINK_DA_VERCEL**
- Repositório Git: **COLE_AQUI_O_LINK_DO_GITHUB**

## Tecnologias utilizadas

| Tecnologia | Uso |
| --- | --- |
| React 18 | Componentes funcionais, props, hooks nativos e hooks customizados |
| React Router 6 | Rotas públicas e privadas, rotas aninhadas, parâmetros e query string |
| Tailwind CSS 4 (`@tailwindcss/vite`) | Estilização e responsividade (mobile first) |
| Vite 6 | Servidor de desenvolvimento e build |
| CSS Grid | Layout das seções (grid container e grid items via utilitários `grid`, `grid-cols-*`, `col-span-*`) |
| HTML semântico | `header`, `nav`, `main`, `section`, `article`, `figure`, `aside`, `footer`, `dl`, `ol` |
| `fetch` + API mockada | Dados servidos em `public/api/*.json` |
| `localStorage` | Sessão, dados do aluno e mensagens de contato |
| Web Crypto (SHA-256) | Hash das senhas |
| Git + Vercel | Versionamento e deploy |

## Como instalar as dependências

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior (já inclui o `npm`).

```bash
npm install
```

## Como executar o projeto

```bash
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

Outros comandos:

```bash
npm run build     # gera a versão de produção em /dist
npm run preview   # serve a versão de produção localmente
npm test          # roda os testes da lógica (busca, estatísticas, reducer, validações)
```

### Servidores / Back-end

**Não há back-end para executar.** A API é mockada: os recursos ficam em `public/api/` (`usuarios.json`, `pastas.json`, `notas.json`, `amostras.json`) e são entregues como arquivos estáticos tanto no `npm run dev` quanto na Vercel. O app os consome com `fetch` (ver `src/services/api.js`), com estados de carregamento, erro e "tentar de novo". As alterações do aluno (criar, editar, excluir...) ficam no `localStorage`.

## Usuários e senhas para teste

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Aluno com dados de exemplo | `demo@resenhaon.app` | `Resenha@2026` |
| Professor (também com dados de exemplo) | `professor@fiap.com.br` | `Fiap@2026` |

Também é possível **criar uma conta** em `/cadastro` (a conta fica salva no navegador e começa com pastas e sem notas). Na tela de login há o botão "Preencher com a conta de teste".

> As senhas dos usuários de teste ficam no JSON apenas como hash SHA-256. Por ser uma API mockada sem servidor, a autenticação é uma simulação para fins acadêmicos.

## Como testar (roteiro rápido para o professor)

1. Abra a landing page (`/`) e use o visor da hero: toque no botão branco para "capturar" e troque a fonte de teste.
2. Redimensione a janela para ver desktop, tablet e mobile.
3. Tente abrir `/app` sem login: você é redirecionado para `/login` (rota privada) e volta ao destino depois de entrar.
4. Entre com `demo@resenhaon.app` / `Resenha@2026`.
5. **Notas**: busque uma palavra (ex.: `grid`), filtre, ordene e marque 2 notas em "Comparar".
6. **Capturar**: escolha uma fonte, capture e salve na pasta.
7. **Pastas**: crie, renomeie, reordene pastas e notas.
8. Exclua uma nota, abra a **Lixeira** e restaure. Veja o **Histórico**, o sino de **avisos** e os **Ajustes**.

## Requisitos da disciplina × onde está no projeto

| Requisito | Onde |
| --- | --- |
| Componentização e props | `src/components/**`, ex.: `NotaCard`, `Campo`, `Botao`, `Modal` |
| Estrutura pai para filho | `App` → `AreaDoAluno` → `AppLayout` → páginas → componentes |
| Rotas públicas | `/`, `/login`, `/cadastro` (`src/App.jsx`, `routes/RotaPublica.jsx`) |
| Rotas privadas | `/app/*` (`routes/RotaPrivada.jsx`) |
| Hooks nativos | `useState`, `useEffect`, `useMemo`, `useCallback`, `useReducer`, `useRef`, `useId`, `useContext` |
| Hooks customizados | `src/hooks/`: `useAuth`, `useDados`, `useFormulario`, `useDebounce`, `useLocalStorage`, `useCaptura`, `useAmostras`, `useNotificacoes`, `useToast`, `useTitulo`, `useTeclaEsc` |
| Lógica separada da parte visual | `src/lib/` (funções puras, testadas) e `src/context/` |
| localStorage | `src/services/armazenamento.js` |
| Operações com `Math` | `useCaptura` (`Math.random`, `Math.round`), `lib/estatisticas.js` (percentuais, médias, `Math.max`), `lib/id.js` |
| Consumo de API | `src/services/api.js` (usuários, pastas, notas e amostras) |
| Tailwind CSS | Todo o projeto; tokens em `src/index.css` |
| Responsividade | Desktop, tablet e mobile em todas as telas (menu recolhido, navegação inferior no celular) |
| CSS Grid | Seções da landing e da área do aluno |
| HTML semântico e acessibilidade | Landmarks, `aria-*`, `<dialog>` nativo, foco visível, `prefers-reduced-motion` |
| Deploy Git + Vercel | `vercel.json` (inclui rewrite para o React Router) |

### Funcionalidades da área do aluno (alinhadas ao Challenge)

- **Central de conteúdo**: todas as notas, busca em todo o texto (com destaque do termo), filtros, ordenação e notas recentes sinalizadas.
- **Organização livre**: pastas criadas pelo aluno, com reordenação manual de pastas e de notas.
- **Histórico e estatísticas**: registro de criações, edições, remoções e exportações; uso por disciplina e por período; atividade da semana.
- **Notificações e privacidade**: lembretes por nota, avisos no sino, privacidade por nota e padrão.
- **Ações sobre o conteúdo**: exportar (.txt e .json), copiar, comparar duas notas lado a lado e lixeira com restauração (30 dias).

## O que mudou da Sprint 3 para a Sprint 4

| Item | Sprint 3 | Sprint 4 |
| --- | --- | --- |
| Tecnologia | HTML + CSS | React + Tailwind CSS + React Router |
| Páginas | Uma landing page | Landing, login, cadastro e 10 telas privadas |
| Dados | Textos fixos | API mockada com `fetch` + `localStorage` |
| Interação | Formulário simples | Demo de captura, busca, comparação, pastas, lixeira, histórico |
| Deploy | Arquivos estáticos | Git + Vercel |

## Estrutura de pastas

```text
├── public/api/          API mockada (JSON)
├── src/
│   ├── components/      ui/, landing/, app/, telas/
│   ├── context/         AuthContext, DadosContext, ToastContext
│   ├── data/            textos e equipe
│   ├── hooks/           hooks customizados
│   ├── lib/             regras de negócio puras (testadas)
│   ├── pages/           Landing, Login, Cadastro e pages/app/*
│   ├── routes/          RotaPrivada, RotaPublica
│   └── services/        api.js, armazenamento.js
├── tests/lib.test.js
├── vercel.json
└── INTEGRANTES.TXT
```

## Deploy (Git + Vercel)

```bash
git init
git add .
git commit -m "feat: Resenha ON Sprint 4"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

Na Vercel: **Add New > Project**, importe o repositório e confirme (preset Vite detectado; build `npm run build`, saída `dist`). O `vercel.json` já cuida das rotas do React Router.

## Uso de IA no projeto

A equipe usou o **Claude (Anthropic)** como assistente de programação para reescrever o projeto a partir do enunciado: estruturar a arquitetura (rotas, contextos, hooks), gerar a primeira versão dos componentes, da lógica em `src/lib`, dos testes automatizados e deste README. O conteúdo da solução (Resenha ON, público-alvo, funcionalidades) vem da proposta da Sprint 3. A equipe revisou, executou e testou o código, e ajustou textos e dados. Ferramentas de IA não são usadas em tempo de execução: toda a "leitura de texto" da captura é uma simulação com amostras vindas da API mockada.

## Integrantes

| Nome | RM |
| --- | --- |
| Michel Tatsuya Hanada | 571987 |
| Felipe Ilek Felice | 571322 |
| Marcos Vinícius Serafim Tudisco Mendes | 569366 |
