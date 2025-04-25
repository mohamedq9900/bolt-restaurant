export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  options?: {
    name: string;
    choices: { name: string; price?: number }[];
  }[];
}

export interface MenuCategory {
  id: string;
  name: string;
  image?: string;
}

export interface MenuOption {
  name: string;
  choices: MenuOptionChoice[];
}

export interface MenuOptionChoice {
  name: string;
  price?: number;
}