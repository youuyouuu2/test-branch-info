export interface ChkGOption { value: string; label: string; }

export interface ChkGProps {
  options: ChkGOption[];
  value: string;
  onChange: (value: string) => void;
}

export function ChkG({ options, value, onChange }: ChkGProps) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {options.map(function(o) {
        var active = value === o.value;
        return (
          <button key={o.value} onClick={function() { onChange(o.value); }}
            style={{ fontSize:13, padding:"7px 14px", borderRadius:8, cursor:"pointer", border:"1.5px solid " + (active ? "#111" : "#d1d5db"), background: active ? "#111" : "#fff", color: active ? "#fff" : "#374151", fontWeight: active ? 600 : 400 }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
