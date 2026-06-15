import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Owner, OwnerFormData, ShopFormData, NewContractResult } from '../types';
import { Inp } from '../components/ui/Inp';
import { Field } from '../components/ui/Field';

export interface NewContractModalProps {
  owners: Owner[];
  onClose: () => void;
  onComplete: (result: NewContractResult) => void;
}

export function NewContractModal({ owners, onClose, onComplete }: NewContractModalProps) {
  const [step, setStep] = useState(1);
  const [ownerType, setOwnerType] = useState("");
  const [selOwnerId, setSelOwnerId] = useState("");
  const [oForm, setOForm] = useState<OwnerFormData>({ name:"", phone:"", email:"", bank_name:"", account_number:"", account_holder:"", cms_number:"", memo:"" });
  const [sForm, setSForm] = useState<ShopFormData>({ name:"", category_id:"2", address_1:"" });

  function setO(k: keyof OwnerFormData) { return function(e: ChangeEvent<HTMLInputElement>) { setOForm(function(p) { return Object.assign({}, p, { [k]: e.target.value }); }); }; }
  function setS(k: keyof ShopFormData) { return function(e: ChangeEvent<HTMLInputElement>) { setSForm(function(p) { return Object.assign({}, p, { [k]: e.target.value }); }); }; }

  var stepLabels = ["점주 구분", "점주 정보", "매장 생성"];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:"#fff", borderRadius:16, width:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding:"24px 28px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <p style={{ fontSize:17, fontWeight:700, color:"#111", margin:0 }}>신규 계약 시작</p>
            <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, color:"#9ca3af", cursor:"pointer" }}>×</button>
          </div>
          <div style={{ display:"flex", marginBottom:24 }}>
            {stepLabels.map(function(l, i) {
              var n = i + 1;
              var done = step > n;
              var active = step === n;
              return (
                <div key={n} style={{ flex:1, textAlign:"center" }}>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    {i > 0 && <div style={{ flex:1, height:2, background: done ? "#111" : "#e5e7eb" }} />}
                    <div style={{ width:26, height:26, borderRadius:"50%", background: (active || done) ? "#111" : "#e5e7eb", color: (active || done) ? "#fff" : "#9ca3af", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {done ? "✓" : n}
                    </div>
                    {i < 2 && <div style={{ flex:1, height:2, background: step > n + 1 ? "#111" : "#e5e7eb" }} />}
                  </div>
                  <p style={{ fontSize:11, color: active ? "#111" : "#9ca3af", margin:"4px 0 0", fontWeight: active ? 600 : 400 }}>{l}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding:"0 28px 28px" }}>
          {step === 1 && (
            <div>
              <p style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>계약할 점주가 기존 점주인지 신규인지 선택하세요.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                {[
                  { v:"existing", title:"기존 점주", desc:"이미 등록된 점주입니다.", icon:"👤" },
                  { v:"new", title:"신규 점주", desc:"처음 계약하는 새 점주입니다.", icon:"✨" }
                ].map(function(o) {
                  return (
                    <button key={o.v} onClick={function() { setOwnerType(o.v); }}
                      style={{ padding:"16px", border:"1.5px solid " + (ownerType === o.v ? "#111" : "#e5e7eb"), borderRadius:10, background: ownerType === o.v ? "#f9fafb" : "#fff", cursor:"pointer", textAlign:"left" }}>
                      <p style={{ fontSize:18, margin:"0 0 6px" }}>{o.icon}</p>
                      <p style={{ fontSize:14, fontWeight:700, color:"#111", margin:"0 0 3px" }}>{o.title}</p>
                      <p style={{ fontSize:12, color:"#6b7280", margin:0 }}>{o.desc}</p>
                    </button>
                  );
                })}
              </div>
              {ownerType === "existing" && (
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>점주 선택</label>
                  <select value={selOwnerId} onChange={function(e) { setSelOwnerId(e.target.value); }}
                    style={{ width:"100%", fontSize:14, padding:"9px 12px", border:"1.5px solid #d1d5db", borderRadius:8, color:"#111", outline:"none", background:"#fff" }}>
                    <option value="">점주를 선택하세요</option>
                    {owners.map(function(o) {
                      return <option key={o.id} value={o.id}>{o.name} ({o.phone}) — {o.id}</option>;
                    })}
                  </select>
                  {selOwnerId && (function() {
                    var o = owners.find(function(x) { return x.id === selOwnerId; });
                    if (!o) return null;
                    return (
                      <div style={{ marginTop:8, padding:"10px 14px", background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:8 }}>
                        <p style={{ fontSize:13, fontWeight:600, color:"#111", margin:"0 0 2px" }}>{o.name} <span style={{ fontSize:11, color:"#9ca3af", fontWeight:400 }}>({o.id})</span></p>
                        <p style={{ fontSize:12, color:"#6b7280", margin:0 }}>{o.phone} · {o.email}</p>
                      </div>
                    );
                  })()}
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}>
                <button
                  onClick={function() {
                    if (!ownerType) return;
                    if (ownerType === "existing" && !selOwnerId) return;
                    setStep(ownerType === "new" ? 2 : 3);
                  }}
                  style={{ fontSize:14, padding:"9px 24px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer", fontWeight:600 }}>
                  다음 →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>점주 ID는 자동 채번됩니다.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
                <Field label="점주명 *" half><Inp value={oForm.name} onChange={setO("name")} placeholder="홍길동" /></Field>
                <Field label="연락처 *" half><Inp value={oForm.phone} onChange={setO("phone")} placeholder="010-0000-0000" /></Field>
                <Field label="이메일" half><Inp value={oForm.email} onChange={setO("email")} /></Field>
                <Field label="은행명" half><Inp value={oForm.bank_name} onChange={setO("bank_name")} /></Field>
                <Field label="예금주" half><Inp value={oForm.account_holder} onChange={setO("account_holder")} /></Field>
                <Field label="계좌번호" half><Inp value={oForm.account_number} onChange={setO("account_number")} /></Field>
              </div>
              <div style={{ marginTop:6 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>메모</label>
                <textarea value={oForm.memo} onChange={function(e) { setOForm(function(p) { return Object.assign({}, p, { memo: e.target.value }); }); }}
                  placeholder="동명이인 구분, 특이사항..."
                  style={{ width:"100%", fontSize:13, padding:"9px 12px", resize:"none", height:60, background:"#fff", border:"1.5px solid #d1d5db", borderRadius:8, color:"#111", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
              </div>
              <div style={{ display:"flex", gap:8, marginTop:16 }}>
                <button onClick={function() { setStep(1); }} style={{ fontSize:14, padding:"9px 20px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", color:"#374151", cursor:"pointer" }}>← 이전</button>
                <button onClick={function() { if (!oForm.name || !oForm.phone) return; setStep(3); }}
                  style={{ flex:1, fontSize:14, padding:"9px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer", fontWeight:600 }}>다음 →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              {(function() {
                var o = ownerType === "new" ? oForm : owners.find(function(x) { return x.id === selOwnerId; });
                if (!o) return null;
                return (
                  <div style={{ padding:"10px 14px", background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:8, marginBottom:16 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:"#15803d", margin:"0 0 2px" }}>
                      점주: {o.name}
                      {ownerType === "existing" && <span style={{ fontWeight:400, color:"#16a34a" }}> ({selOwnerId})</span>}
                    </p>
                    <p style={{ fontSize:11, color:"#16a34a", margin:0 }}>{o.phone}</p>
                  </div>
                );
              })()}
              <p style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>매장 기본 정보를 입력합니다. 계약/임대차/사업자는 이후 매장 상세에서 입력합니다.</p>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>구분</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[{v:"1",l:"직영점"},{v:"2",l:"가맹점"}].map(function(o) {
                    var a = sForm.category_id === o.v;
                    return (
                      <button key={o.v} onClick={function() { setSForm(function(p) { return Object.assign({}, p, { category_id: o.v }); }); }}
                        style={{ fontSize:13, padding:"7px 14px", borderRadius:8, cursor:"pointer", border:"1.5px solid " + (a ? "#111" : "#d1d5db"), background: a ? "#111" : "#fff", color: a ? "#fff" : "#374151", fontWeight: a ? 600 : 400 }}>
                        {o.l}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>매장명 *</label>
                <Inp value={sForm.name} onChange={setS("name")} placeholder="예: 신촌점" />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>주소</label>
                <Inp value={sForm.address_1} onChange={setS("address_1")} placeholder="서울시..." />
              </div>
              <div style={{ display:"flex", gap:8, marginTop:16 }}>
                <button onClick={function() { setStep(ownerType === "new" ? 2 : 1); }}
                  style={{ fontSize:14, padding:"9px 20px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", color:"#374151", cursor:"pointer" }}>← 이전</button>
                <button
                  onClick={function() {
                    if (!sForm.name.trim()) return;
                    onComplete({ ownerType: ownerType, ownerId: selOwnerId, ownerForm: oForm, shopForm: sForm });
                    onClose();
                  }}
                  style={{ flex:1, fontSize:14, padding:"9px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer", fontWeight:600 }}>
                  매장 생성 완료
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
