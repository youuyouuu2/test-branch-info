import type { ReactNode } from 'react';

export interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
  half?: boolean;
}

export function Field({ label, hint, children, half }: FieldProps) {
  return (
    <div style={{ marginBottom:14, gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom: hint ? 2 : 5 }}>{label}</label>
      {hint && <p style={{ fontSize:11, color:"#9ca3af", margin:"0 0 5px" }}>{hint}</p>}
      {children}
    </div>
  );
}
