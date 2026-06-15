import type { ChangeEventHandler } from 'react';

export interface InpProps {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
}

export function Inp({ value, onChange, placeholder, readOnly }: InpProps) {
  return (
    <input
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{ width:"100%", fontSize:14, padding:"9px 12px", boxSizing:"border-box", background:readOnly?"#f9fafb":"#fff", border:"1.5px solid #d1d5db", borderRadius:8, color:readOnly?"#9ca3af":"#111", outline:"none" }}
    />
  );
}
