interface Skater {
  initials?: string;
  name?: string;
  role?: string;
  city?: string;
  bg?: string;
}

export const stories = [
  { initials: "TH", name: "Tony H.", bg: "blue.500" },
  { initials: "DW", name: "Danny Way", bg: "#334155" },
  { initials: "RM", name: "Rodney M.", bg: "#047857" },
  { initials: "DF", name: "Diego F.", bg: "#c026d3" },
  { initials: "PR", name: "P-Rod", bg: "purple.600" }
];

export const modalities = ["Street", "Bowl", "Downhill", "Vert", "DIY Spot"];

export const skaters: Skater[] = [
  { initials: "TH", name: "Tony Hawk", role: "Grand Legend", city: "Carlsbad", bg: "blue.600" },
  { initials: "PR", name: "Paul Rodriguez", role: "Skater", city: "Tarzana", bg: "purple.600" },
  { initials: "DW", name: "Danny Way", role: "Pro Legend", city: "Portland", bg: "#334155" },
  { initials: "DF", name: "Diego Feder", role: "Skater", city: "Curitiba", bg: "#c026d3" },
  { initials: "RM", name: "Rodney Mullen", role: "Skater", city: "Gainesville", bg: "#047857" },
  { initials: "VM", name: "Vincent Milou", role: "Skater", city: "Tarnos", bg: "#e11d48" }
];

export const posts = [
  {
    id: 1,
    initials: "TH",
    bg: "blue.500",
    author: "Tony Hawk",
    role: "Grand Legend",
    legend: true,
    meta: "há 8 minutos • Carlsbad, CA",
    text: "Esse pico é monstro! Dropando na Wences Skate Plaza com a galera. Transição lisinha e coping no ponto pra travar aquele blunt! 🛹🔥",
    spot: "Wences Skate Plaza • Curitiba, PR",
    likes: 142,
    comments: 18
  },
  {
    id: 2,
    initials: "JS",
    bg: "cyan.700",
    author: "Joao Skate",
    role: "Skater",
    meta: "há cerca de 23 horas • Curitiba",
    text: "Hello World! Acabei de cadastrar o novo bowl do Jardim Ambiental! Piso liso, iluminação LED funcionando até às 22h e bordas lubrificadas na medida certa.",
    tags: ["#Street", "#Bowl", "#CuritibaSkate"],
    likes: 26,
    comments: 5
  },
  {
    id: 3,
    initials: "DF",
    bg: "#c026d3",
    author: "Diego Feder",
    role: "Skater",
    meta: "há 2 dias • Curitiba",
    text: "Sessão de aquecimento com o time no corrimão central. Final de semana promete render linhas cabulosas! Quem tiver por perto cola aí!",
    likes: 88,
    comments: 11
  }
];

export const communities = [
  { code: "WP", name: "Wences Skate Plaza", info: "428 membros • Curitiba", color: "orange" },
  { code: "JA", name: "Bowl Jardim Ambiental", info: "312 membros • Curitiba", color: "green" },
  { code: "MA", name: "Manobras Old School", info: "1.8k membros • Brasil", color: "cyan" }
];
