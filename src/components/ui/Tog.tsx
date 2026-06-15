export interface TogProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function Tog({ value, onChange }: TogProps) {
  return (
    <div style={{ display:"flex", gap:8 }}>
      {["ON","OFF"].map(function(v) {
        var active = value === (v === "ON");
        return (
          <button key={v} onClick={function() { onChange(v === "ON"); }}
            style={{ fontSize:13, padding:"7px 18px", borderRadius:8, cursor:"pointer", border:"1.5px solid " + (active ? "#111" : "#d1d5db"), background: active ? "#111" : "#fff", color: active ? "#fff" : "#374151", fontWeight: active ? 600 : 400 }}>
            {v}
          </button>
        );
      })}
    </div>
  );
}
