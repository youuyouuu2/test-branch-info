import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Owner, Shop } from '../types';

export interface AppCtxValue {
  owners: Owner[];
  setOwners: Dispatch<SetStateAction<Owner[]>>;
  shops: Shop[];
  setShops: Dispatch<SetStateAction<Shop[]>>;
  navigate: (to: string, id: number | string | null) => void;
  showToast: (msg: string) => void;
}

export const AppCtx = createContext<AppCtxValue | null>(null);

export function useApp(): AppCtxValue {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppCtx.Provider');
  return ctx;
}
