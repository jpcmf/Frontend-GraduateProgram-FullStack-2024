export const CATEGORIES = [
  { id: 1, name: "Iniciante", value: "iniciante" },
  { id: 2, name: "Amador", value: "amador" },
  { id: 3, name: "Profissional", value: "profissional" },
  { id: 4, name: "Pro Master", value: "pro-master" },
  { id: 5, name: "Pro Legend", value: "pro-legend" },
  { id: 6, name: "Master", value: "master" },
  { id: 7, name: "Grand Master", value: "grand-master" },
  { id: 8, name: "Grand Legend", value: "grand-legend" },
  { id: 9, name: "Vintage", value: "vintage" },
  { id: 10, name: "Open", value: "open" },
  { id: 11, name: "Paraskatista", value: "paraskatista" }
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const getCategoryById = (id: CategoryId) => CATEGORIES.find(cat => cat.id === id);

export const getCategoryByValue = (value: CategoryValue) => CATEGORIES.find(cat => cat.value === value);
