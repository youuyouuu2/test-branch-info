import { useState } from 'react';
import type { Owner, Shop, NewContractResult } from './types';
import { INIT_OWNERS, INIT_SHOPS } from './data/mock';
import { AppCtx, useApp } from './context/AppCtx';
import { OwnerMasterPage } from './pages/OwnerMasterPage';
import { ShopInfoPage } from './pages/ShopInfoPage';
import { NewContractModal } from './modals/NewContractModal';

function HomeDashboard(props: {
  setPage: (p: string) => void;
  setShowContract: (v: boolean) => void;
  navigate: (to: string, id: number | string | null) => void;
}) {
  const app = useApp();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  var franchiseCount = app.shops.filter(function(s) { return s.category_id === "2"; }).length;
  var directCount = app.shops.filter(function(s) { return s.category_id === "1"; }).length;
  var openCount = app.shops.filter(function(s) { return s.state === "1"; }).length;
  var yetShops = app.shops.filter(function(s) { return s.state === "0"; });
  var yetPreview = yetShops.slice(0, 2).map(function(s) { return s.name; }).join(", ");
  var yetSub = yetShops.length > 2 ? yetPreview + " 외 " + (yetShops.length - 2) + "개" : yetPreview;

  var alerts = [
    { id: 1, level: "danger", title: "구디점", desc: "임대차 만료 · 2026-05-14", badge: "D-32", shopId: 1 },
    { id: 2, level: "warning", title: "마포점", desc: "위탁계약 갱신 · 2028-06-19", badge: "갱신필요", shopId: 2 },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 6px" }}>전체 매장</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>{app.shops.length}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>가맹 {franchiseCount} · 직영 {directCount}</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 6px" }}>운영 중</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#15803d", margin: 0 }}>{openCount}</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 6px" }}>오픈 예정</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>{yetShops.length}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{yetSub || "—"}</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 6px" }}>갱신 필요</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#d97706", margin: "0 0 4px" }}>{alerts.length}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>임대차 · 위탁계약</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>오픈 예정 매장</p>
            <button onClick={function() { props.setPage("shops"); }}
              style={{ fontSize: 12, padding: 0, border: "none", background: "none", color: "#6b7280", cursor: "pointer", fontWeight: 500 }}>
              매장 정보 관리 →
            </button>
          </div>
          {yetShops.length === 0
            ? <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>오픈 예정 매장이 없습니다.</p>
            : yetShops.map(function(s) {
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: "0 0 2px" }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>#{s.master_number} · {s.address_1}</p>
                  </div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: "#f3f4f6", color: "#6b7280", fontWeight: 600 }}>Yet</span>
                </div>
              );
            })
          }
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>계약 갱신 필요</p>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>상세 보기 →</span>
          </div>
          {alerts.map(function(a) {
            var badgeStyle = a.level === "danger"
              ? { background: "#fef2f2", color: "#b91c1c" }
              : { background: "#fef3c7", color: "#92400e" };
            return (
              <div key={a.id} onClick={function() { props.navigate("shops", a.shopId); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: "0 0 2px" }}>{a.title}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{a.desc}</p>
                </div>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, fontWeight: 600, background: badgeStyle.background, color: badgeStyle.color }}>{a.badge}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { n: 1, title: "매장 정보 관리", desc: "매장 계약·임대·사업자 정보", dark: false, onClick: function() { props.setPage("shops"); } },
          { n: 2, title: "점주 마스터", desc: "점주 계정 및 소속 매장 관리", dark: false, onClick: function() { props.setPage("owners"); } },
          { n: 3, title: "신규 계약 · 매장 생성", desc: "점주 등록 후 매장 페이지 개설", dark: false, onClick: function() { props.setShowContract(true); } },
        ].map(function(c) {
          var hovered = hoveredCard === c.n;
          return (
            <button key={c.n} onClick={c.onClick}
              onMouseEnter={function() { setHoveredCard(c.n); }}
              onMouseLeave={function() { setHoveredCard(null); }}
              style={{
                textAlign: "left", cursor: "pointer",
                background: c.dark ? "#111" : "#fff",
                border: "1.5px solid " + (c.dark ? "#111" : (hovered ? "#111" : "#e5e7eb")),
                borderRadius: 12, padding: "18px 20px",
              }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: c.dark ? "#fff" : "#111", margin: "0 0 6px" }}>{c.title}</p>
              <p style={{ fontSize: 12, color: c.dark ? "#9ca3af" : "#6b7280", margin: "0 0 16px" }}>{c.desc}</p>
              <p style={{ fontSize: 14, color: c.dark ? "#6b7280" : "#d1d5db", margin: 0 }}>→</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [targetOwnerId, setTargetOwnerId] = useState<string | null>(null);
  const [targetShopId, setTargetShopId] = useState<number | null>(null);
  const [owners, setOwners] = useState<Owner[]>(INIT_OWNERS);
  const [shops, setShops] = useState<Shop[]>(INIT_SHOPS);
  const [toast, setToast] = useState("");
  const [showContract, setShowContract] = useState(false);

  function showToast(msg: string) { setToast(msg); setTimeout(function() { setToast(""); }, 2500); }

  function navigate(to: string, id: number | string | null) {
    if (to === "owners") { setTargetOwnerId(id as string); setPage("owners"); }
    else if (to === "home") { setPage("home"); }
    else { setTargetShopId(id as number); setPage("shops"); }
  }

  function handleContract(result: NewContractResult) {
    var finalId = result.ownerId;
    if (result.ownerType === "new") {
      var nextNum = String(owners.length + 1).padStart(3, "0");
      var newO: Owner = Object.assign({}, result.ownerForm, { id: "P" + nextNum, created_at: new Date().toISOString().slice(0, 10) });
      setOwners(function(p) { return p.concat([newO]); });
      finalId = newO.id;
    }
    var catShops = shops.filter(function(s) { return s.category_id === result.shopForm.category_id; });
    var ns: Shop = {
      id: Date.now(), owner_id: finalId, category_id: result.shopForm.category_id,
      branch_id: String(catShops.length + 1), master_number: String(1000 + shops.length + 1),
      branch_number: "", name: result.shopForm.name, eng_name: "",
      address_1: result.shopForm.address_1 || "", state: "0", owner_direct: "0",
      use_kko_msg: true, discription: "", slack_channel_code: "", discord_channel_code: "",
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10), card_devices: [],
    };
    setShops(function(p) { return p.concat([ns]); });
    setShowContract(false);
    setTargetShopId(ns.id);
    setPage("shops");
    showToast("'" + result.shopForm.name + "' 생성됐어요.");
  }

  var ctxValue = { owners: owners, setOwners: setOwners, shops: shops, setShops: setShops, navigate: navigate, showToast: showToast };

  return (
    <AppCtx.Provider value={ctxValue}>
      {showContract && (
        <NewContractModal
          owners={owners}
          onClose={function() { setShowContract(false); }}
          onComplete={handleContract}
        />
      )}
      <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:"#f3f4f6", height:"100vh", display:"flex", flexDirection:"column" }}>
        {toast && (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#111", color:"#fff", fontSize:13, padding:"10px 20px", borderRadius:10, zIndex:999, fontWeight:500, whiteSpace:"nowrap" }}>
            {toast}
          </div>
        )}
        <div style={{ background:"#fff", borderBottom:"1.5px solid #e5e7eb", padding:"0 20px", display:"flex", alignItems:"center", gap:0, flexShrink:0, height:52 }}>
          <p style={{ fontSize:14, fontWeight:700, color:"#111", margin:"0 24px 0 0", whiteSpace:"nowrap" }}>🏠 런드리익스프레스</p>
          {[{id:"home",label:"홈"},{id:"shops",label:"매장 정보 관리"},{id:"owners",label:"점주 마스터"}].map(function(n) {
            return (
              <button key={n.id} onClick={function() { setPage(n.id); }}
                style={{ fontSize:13, padding:"0 16px", height:"100%", border:"none", borderBottom:"2.5px solid " + (page === n.id ? "#111" : "transparent"), background:"transparent", color: page === n.id ? "#111" : "#6b7280", cursor:"pointer", fontWeight: page === n.id ? 700 : 400, whiteSpace:"nowrap" }}>
                {n.label}
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          <button onClick={function() { setShowContract(true); }}
            style={{ fontSize:13, padding:"8px 16px", border:"none", borderRadius:8, background:"#111", color:"#fff", cursor:"pointer", fontWeight:600 }}>
            + 신규 계약 · 매장 생성
          </button>
        </div>
        <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
          {page === "home" && <HomeDashboard setPage={setPage} setShowContract={setShowContract} navigate={navigate} />}
          {page === "owners" && <OwnerMasterPage key={targetOwnerId ?? undefined} initOwnerId={targetOwnerId} />}
          {page === "shops" && <ShopInfoPage key={targetShopId ?? undefined} initShopId={targetShopId} />}
        </div>
      </div>
    </AppCtx.Provider>
  );
}
