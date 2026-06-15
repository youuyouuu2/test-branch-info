import type { ReactNode } from 'react';

export interface G2Props { children: ReactNode; }

export function G2({ children }: G2Props) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>{children}</div>;
}
