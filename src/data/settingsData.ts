import { supabase } from '../lib/supabase';

export type SiteSettings = {
  restaurantName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  address: string;
  phone: string;
  workingHours: string;
  taxNumber: string;
  deliveryFee: number;
};

const defaultSettings: SiteSettings = {
  restaurantName: 'مطعمنا',
  heroTitle: 'طعام لذيذ، يصل إلى باب منزلك',
  heroSubtitle: 'استمتع بأشهى المأكولات من مطبخنا إلى منزلك. سريع، سهل، ودائماً لذيذ.',
  aboutText: 'نحن نفخر بتقديم طعام استثنائي وخدمة متميزة لعملائنا.',
  address: '123 شارع المطعم، المدينة الغذائية',
  phone: '+966 50 123 4567',
  workingHours: 'السبت-الخميس: 11 ص - 10 م',
  taxNumber: '123456789',
  deliveryFee: 0,
};

// Get settings from localStorage
export const getSettings = (): SiteSettings => {
  const savedSettings = localStorage.getItem('siteSettings');
  return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
};

// Save settings to localStorage
export const saveSettings = (settings: SiteSettings): void => {
  localStorage.setItem('siteSettings', JSON.stringify(settings));
};