// Currency conversion rate (1 USD = 1300 IQD approximately)
export const USD_TO_IQD_RATE = 1300;

export const convertToIQD = (usdPrice: number): number => {
  return Math.round(usdPrice * USD_TO_IQD_RATE);
};

export const formatIQD = (amount: number): string => {
  // Use en-US locale to ensure English numerals
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount);
};