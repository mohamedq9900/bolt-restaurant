import { useState } from 'react';

// Simplified version that doesn't actually connect to Supabase
export function useSupabaseSubscription<T>(
  tableName: string,
  callback: (payload: T) => void
) {
  const [channel] = useState(null);
  return channel;
}