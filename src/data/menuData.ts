// Types for menu data
export type MenuItem = {
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
};

export type Category = {
  id: string;
  name: string;
  image?: string;
};

// Menu categories with proper UUIDs
export const categories: Category[] = [
  { id: "550e8400-e29b-41d4-a716-446655440000", name: "الأطباق الرئيسية" },
  { id: "550e8400-e29b-41d4-a716-446655440001", name: "المقبلات" },
  { id: "550e8400-e29b-41d4-a716-446655440002", name: "السندويشات" },
  { id: "550e8400-e29b-41d4-a716-446655440003", name: "السلطات" },
  { id: "550e8400-e29b-41d4-a716-446655440004", name: "المشروبات" },
  { id: "550e8400-e29b-41d4-a716-446655440005", name: "الحلويات" }
];

// Menu items with proper category UUIDs
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "مشاوي مشكلة",
    description: "تشكيلة من اللحوم المشوية مع الخضار والأرز",
    price: 25.99,
    image: "https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440000",
    featured: true,
    options: [
      {
        name: "الحجم",
        choices: [
          { name: "شخص واحد" },
          { name: "شخصين", price: 20 },
          { name: "عائلي", price: 45 }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "حمص",
    description: "حمص مع زيت الزيتون والصنوبر",
    price: 5.99,
    image: "https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440001"
  },
  {
    id: "3",
    name: "شاورما دجاج",
    description: "شاورما دجاج مع صلصة الثوم والمخللات",
    price: 8.99,
    image: "https://images.pexels.com/photos/6542774/pexels-photo-6542774.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440002",
    featured: true,
    options: [
      {
        name: "الخبز",
        choices: [
          { name: "صاج" },
          { name: "صمون" }
        ]
      },
      {
        name: "إضافات",
        choices: [
          { name: "بطاطس", price: 1 },
          { name: "جبنة", price: 0.5 }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "سلطة سيزر",
    description: "خس روماني مع صلصة السيزر وقطع الدجاج المشوي",
    price: 7.99,
    image: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440003"
  },
  {
    id: "5",
    name: "عصير برتقال طازج",
    description: "عصير برتقال طبيعي 100%",
    price: 3.99,
    image: "https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440004"
  },
  {
    id: "6",
    name: "كنافة",
    description: "كنافة بالجبن مع القطر",
    price: 6.99,
    image: "https://images.pexels.com/photos/12664777/pexels-photo-12664777.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440005",
    featured: true
  },
  {
    id: "7",
    name: "متبل باذنجان",
    description: "متبل باذنجان مشوي مع طحينة وزيت زيتون",
    price: 4.99,
    image: "https://images.pexels.com/photos/7226367/pexels-photo-7226367.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440001"
  },
  {
    id: "8",
    name: "برجر لحم",
    description: "برجر لحم مع جبنة وخضار",
    price: 12.99,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    category: "550e8400-e29b-41d4-a716-446655440002",
    options: [
      {
        name: "درجة النضج",
        choices: [
          { name: "متوسط" },
          { name: "متوسط ناضج" },
          { name: "ناضج" }
        ]
      },
      {
        name: "إضافات",
        choices: [
          { name: "بيض مقلي", price: 1 },
          { name: "جبنة إضافية", price: 0.5 },
          { name: "بصل مكرمل", price: 0.5 }
        ]
      }
    ]
  }
];

// Function to get menu items by category
export const getItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
  return menuItems.filter(item => item.category === categoryId);
};

// Function to get featured menu items
export const getFeaturedItems = async (): Promise<MenuItem[]> => {
  return menuItems.filter(item => item.featured);
};

// Function to get a single menu item by id
export const getItemById = async (id: string): Promise<MenuItem | undefined> => {
  return menuItems.find(item => item.id === id);
};