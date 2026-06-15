import { useState, type ChangeEvent } from 'react';
import type { Owner, OwnerFormData } from '../types';
import { Inp } from '../components/ui/Inp';
import { Field } from '../components/ui/Field';

export interface OwnerFormModalProps {
  initial: Owner | null;
  onSave: (form: OwnerFormData) => void;
  onClose: () => void;
}

export function OwnerFormModal({ initial, onSave, onClose }: OwnerFormModalProps) {
  const [f, setF] = useState<OwnerFormData>(initial || { name:"", phone:"", email:"", bank_name:"", account_number:"", account_holder:"", cms_number:"", memo:"" });
  function s(k: keyof OwnerFormData) { return function(e: ChangeEvent<HTMLInputElement>) { setF(function(p) { return Object.assign({}, p, { [k]: e.target.value }); }); }; }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"28px", width:480, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <p style={{ fontSize:17, fontWeight:700, color:"#111", margin:0 }}>{initial ? "점주 수정" : "점주 등록"}</p>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, color:"#9ca3af", cursor:"pointer" }}>×</button>
        </div>
        {initial && (
          <div style={{ padding:"6px 12px", background:"#f3f4f6", borderRadius:8, marginBottom:14, display:"inline-flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:12, color:"#6b7280" }}>점주 ID</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#111" }}>{initial.id}</span>
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <Field label="점주명 *" half><Inp value={f.name} onChange={s("name")} placeholder="홍길동" /></Field>
          <Field label="연락처 *" half><Inp value={f.phone} onChange={s("phone")} placeholder="010-0000-0000" /></Field>
          <Field label="이메일" half><Inp value={f.email} onChange={s("email")} /></Field>
          <Field label="은행명" half><Inp value={f.bank_name} onChange={s("bank_name")} /></Field>
          <Field label="예금주" half><Inp value={f.account_holder} onChange={s("account_holder")} /></Field>
          <Field label="계좌번호" half><Inp value={f.account_number} onChange={s("account_number")} /></Field>
          <Field label="CMS 번호" half><Inp value={f.cms_number} onChange={s("cms_number")} placeholder="CMS-" /></Field>
        </div>
        <div style={{ marginTop:4 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>메모 <span style={{ fontWeight:400, color:"#9ca3af" }}>(동명이인 구분 등)</span></label>
          <textarea value={f.memo} onChange={function(e) { setF(function(p) { return Object.assign({}, p, { memo: e.target.value }); }); }}
            placeholder="동명이인 구분, 특이사항..."
            style={{ width:"100%", fontSize:13, padding:"9px 12px", resize:"none", height:60, background:"#fff", border:"1.5px solid #d1d5db", borderRadius:8, color:"#111", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
        </div>
        <div style={{ display:"flex", gap:8, marginTop:20 }}>
          <button onClick={onClose} style={{ flex:1, fontSize:14, padding:"10px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", color:"#374151", cursor:"pointer" }}>취소</button>
          <button onClick={function() { if (!f.name || !f.phone) return; onSave(f); }}
            style={{ flex:1, fontSize:14, padding:"10px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer", fontWeight:600 }}>
            {initial ? "수정 저장" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
