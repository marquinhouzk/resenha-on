// Dados fixos do projeto. Edite aqui nomes, RMs e links: a landing e o rodapé leem deste arquivo.
export const PROJETO = {
  nome: "Resenha ON",
  slogan: "O Modo Estudo da câmera JOVI",
  email: "contato@resenhaon.app",
  // Cole aqui o link do repositório e do deploy para eles aparecerem no site (vazio = oculto).
  repositorio: "",
  deploy: "",
};

export const EQUIPE = [
  {
    nome: "Michel Tatsuya Hanada",
    iniciais: "MH",
    rm: "571987",
    funcao: "Front-End e UX",
    descricao: "Desenha as telas do Modo Estudo e cuida do layout responsivo.",
    cor: "bg-jovi text-white",
  },
  {
    nome: "Felipe Ilek Felice",
    iniciais: "FF",
    rm: "571322",
    funcao: "Back-End e Python",
    descricao: "Responsável pela lógica de dados, persistência e integração com a API.",
    cor: "bg-rosa text-white",
  },
  {
    nome: "Marcos Vinícius Serafim Tudisco Mendes",
    iniciais: "MM",
    rm: "569366",
    funcao: "Storytelling e Pesquisa com Usuários",
    descricao: "Conduz a pesquisa com estudantes e escreve a narrativa da campanha.",
    cor: "bg-marca text-tinta",
  },
];

export const LINKS_MENU = [
  { href: "#solucao", rotulo: "A Solução" },
  { href: "#publico", rotulo: "Público-Alvo" },
  { href: "#galeria", rotulo: "Galeria" },
  { href: "#equipe", rotulo: "Nossa Equipe" },
  { href: "#contato", rotulo: "Contato" },
];

export const RECURSOS_WEB = [
  {
    titulo: "Central de conteúdo",
    texto: "Tudo o que você capturou em um lugar só, com busca em todo o texto e as notas mais recentes no topo.",
    destaque: true,
  },
  {
    titulo: "Pastas do seu jeito",
    texto: "Crie pastas por disciplina e reorganize pastas e notas na ordem que fizer sentido para você.",
    destaque: true,
  },
  { titulo: "Histórico e estatísticas", texto: "Veja o que foi criado, editado e removido, e quanto você usou por disciplina e por período." },
  { titulo: "Lembretes e privacidade", texto: "Receba avisos de provas e entregas e escolha o que fica privado ou público." },
  { titulo: "Exportar, comparar e recuperar", texto: "Baixe em .txt ou .json, compare duas notas lado a lado e recupere o que foi para a lixeira." },
];
