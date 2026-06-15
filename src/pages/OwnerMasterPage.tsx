import { useState } from 'react';
import type { Owner, OwnerFormData, NewContractResult, Shop } from '../types';
import { useApp } from '../context/AppCtx';
import { StateBadge } from '../components/ui/StateBadge';
import { OwnerFormModal } from '../modals/OwnerModal';
import { NewContractModal } from '../modals/NewContractModal';

export interface OwnerMasterPageProps {
  initOwnerId?: string | null;
}

export function OwnerMasterPage({ initOwnerId }: OwnerMasterPageProps) {
  const app = useApp();
  const [selId, setSelId] = useState(initOwnerId || "P001");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editOwner, setEditOwner] = useState<Owner | null>(null);
  const [showContract, setShowContract] = useState(false);

  var filtered = app.owners.filter(function(o) {
    return o.name.includes(search) || o.phone.includes(search) || o.id.includes(search);
  });
  var sel = app.owners.find(function(o) { return o.id === selId; });
  var selShops = app.shops.filter(function(s) { return s.owner_id === selId; });

  function saveOwner(form: OwnerFormData) {
    if (editOwner) {
      app.setOwners(function(p) { return p.map(function(o) { return o.id === editOwner.id ? Object.assign({}, o, form) : o; }); });
      app.showToast("수정됐어요.");
    } else {
      var nextNum = String(app.owners.length + 1).padStart(3, "0");
      var newO: Owner = Object.assign({}, form, { id: "P" + nextNum, created_at: new Date().toISOString().slice(0, 10) });
      app.setOwners(function(p) { return p.concat([newO]); });
      setSelId(newO.id);
      app.showToast(newO.name + " (" + newO.id + ") 등록됐어요.");
    }
    setEditOwner(null);
    setShowModal(false);
  }

  function handleContract(result: NewContractResult) {
    var finalId = result.ownerId;
    if (result.ownerType === "new") {
      var nextNum = String(app.owners.length + 1).padStart(3, "0");
      var newO: Owner = Object.assign({}, result.ownerForm, { id: "P" + nextNum, created_at: new Date().toISOString().slice(0, 10) });
      app.setOwners(function(p) { return p.concat([newO]); });
      finalId = newO.id;
      setSelId(newO.id);
    }
    var catShops = app.shops.filter(function(s) { return s.category_id === result.shopForm.category_id; });
    var ns: Shop = { id: Date.now(), owner_id: finalId, category_id: result.shopForm.category_id, branch_id: String(catShops.length + 1), master_number: String(1000 + app.shops.length + 1), branch_number: "", name: result.shopForm.name, eng_name: "", address_1: result.shopForm.address_1 || "", state: "0", owner_direct: "0", use_kko_msg: true, discription: "", slack_channel_code: "", discord_channel_code: "", created_at: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString().slice(0, 10), card_devices: [] };
    app.setShops(function(p) { return p.concat([ns]); });
    if (result.ownerType === "existing") setSelId(finalId);
    app.showToast("'" + result.shopForm.name + "' 생성됐어요.");
  }

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", height:"100%" }}>
      {showModal && <OwnerFormModal initial={editOwner} onSave={saveOwner} onClose={function() { setShowModal(false); setEditOwner(null); }} />}
      {showContract && <NewContractModal owners={app.owners} onClose={function() { setShowContract(false); }} onComplete={handleContract} />}

      <div style={{ width:250, background:"#fff", borderRight:"1.5px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"12px" }}>
          <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="이름 / 연락처 / ID 검색"
            style={{ width:"100%", fontSize:13, padding:"8px 10px", boxSizing:"border-box", background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:8, color:"#111", outline:"none" }} />
        </div>
        <p style={{ fontSize:11, fontWeight:600, color:"#9ca3af", padding:"2px 14px 6px", margin:0 }}>전체 {filtered.length}명</p>
        <div style={{ flex:1, overflowY:"auto", padding:"0 12px 12px" }}>
          {filtered.map(function(o) {
            var cnt = app.shops.filter(function(s) { return s.owner_id === o.id; }).length;
            var isSel = selId === o.id;
            return (
              <div key={o.id} onClick={function() { setSelId(o.id); }}
                style={{ padding:"10px 12px", borderRadius:8, cursor:"pointer", background: isSel ? "#f3f4f6" : "transparent", border: "1.5px solid " + (isSel ? "#d1d5db" : "transparent"), marginBottom:4 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight: isSel ? 700 : 500, color:"#111", margin:"0 0 1px" }}>{o.name}</p>
                    <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>{o.id} · {o.phone}</p>
                  </div>
                  <span style={{ fontSize:11, padding:"1px 7px", borderRadius:8, background:"#f3f4f6", color:"#6b7280", flexShrink:0 }}>{cnt}개</span>
                </div>
                {o.memo && <p style={{ fontSize:11, color:"#92400e", margin:"3px 0 0", background:"#fffbeb", padding:"2px 6px", borderRadius:4, display:"inline-block" }}>{o.memo}</p>}
              </div>
            );
          })}
        </div>
        <div style={{ padding:"12px", borderTop:"1.5px solid #e5e7eb", display:"flex", flexDirection:"column", gap:8 }}>
          <button onClick={function() { setEditOwner(null); setShowModal(true); }}
            style={{ fontSize:13, padding:"8px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", color:"#374151", cursor:"pointer" }}>+ 점주 등록</button>
          <button onClick={function() { setShowContract(true); }}
            style={{ fontSize:13, padding:"8px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer", fontWeight:600 }}>신규 계약 시작</button>
        </div>
      </div>

      {sel && (
        <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:"#111", margin:0 }}>{sel.name}</h2>
                <span style={{ fontSize:12, padding:"3px 10px", borderRadius:8, background:"#f3f4f6", color:"#374151", fontWeight:600 }}>{sel.id}</span>
              </div>
              <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>등록일 {sel.created_at}</p>
            </div>
            <button onClick={function() { if (sel) { setEditOwner(sel); setShowModal(true); } }}
              style={{ fontSize:13, padding:"8px 16px", border:"1.5px solid #d1d5db", borderRadius:8, background:"#fff", color:"#374151", cursor:"pointer" }}>정보 수정</button>
          </div>

          {sel.memo && (
            <div style={{ padding:"10px 14px", background:"#fffbeb", border:"1.5px solid #fde68a", borderRadius:8, marginBottom:16 }}>
              <p style={{ fontSize:13, color:"#92400e", margin:0 }}>{sel.memo}</p>
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"16px 20px" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#111", margin:"0 0 10px" }}>연락처</p>
              {[["연락처", sel.phone], ["이메일", sel.email]].map(function(item) {
                return (
                  <div key={item[0]} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"#6b7280", width:60, flexShrink:0 }}>{item[0]}</span>
                    <span style={{ fontSize:13, color: item[1] ? "#111" : "#9ca3af" }}>{item[1] || "—"}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"16px 20px" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#111", margin:"0 0 10px" }}>계좌 / CMS</p>
              {[["은행", sel.bank_name], ["예금주", sel.account_holder], ["계좌번호", sel.account_number], ["CMS", sel.cms_number]].map(function(item) {
                return (
                  <div key={item[0]} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"#6b7280", width:60, flexShrink:0 }}>{item[0]}</span>
                    <span style={{ fontSize:13, color: item[1] ? "#111" : "#9ca3af" }}>{item[1] || "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#111", margin:0 }}>소속 매장 <span style={{ fontWeight:400, color:"#9ca3af" }}>({selShops.length}개)</span></p>
              <button onClick={function() { setShowContract(true); }}
                style={{ fontSize:12, padding:"5px 12px", border:"1.5px solid #d1d5db", borderRadius:7, background:"#fff", color:"#374151", cursor:"pointer" }}>+ 매장 추가</button>
            </div>
            {selShops.length === 0
              ? <p style={{ fontSize:13, color:"#9ca3af", textAlign:"center", padding:"20px 0" }}>소속 매장이 없습니다.</p>
              : selShops.map(function(s) {
                return (
                  <div key={s.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:8, marginBottom:8 }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:"#111", margin:"0 0 2px" }}>{s.name}</p>
                      <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>#{s.master_number} · {s.category_id === "1" ? "직영" : "가맹"} · {s.address_1}</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <StateBadge state={s.state} />
                      <button onClick={function() { app.navigate("shops", s.id); }}
                        style={{ fontSize:12, padding:"4px 10px", border:"1.5px solid #d1d5db", borderRadius:6, background:"#fff", color:"#374151", cursor:"pointer" }}>매장 정보 →</button>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
}
