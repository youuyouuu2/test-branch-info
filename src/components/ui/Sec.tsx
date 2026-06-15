import type { ReactNode } from 'react';

export interface SecProps { title: string; children: ReactNode; }

export function Sec({ title, children }: SecProps) {
  return (
    <div style={{ marginBottom:28 }}>
      <p style={{ fontSize:15, fontWeight:700, color:"#111", margin:"0 0 12px" }}>{title}</p>
      {children}
    </div>
  );
}
