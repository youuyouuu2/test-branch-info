import { useState, useEffect } from 'react';
import type { Owner, Shop, NewContractResult } from './types';
import { INIT_OWNERS, INIT_SHOPS } from './data/mock';
import { AppCtx } from './context/AppCtx';
import { OwnerMasterPage } from './pages/OwnerMasterPage';
import { ShopInfoPage } from './pages/ShopInfoPage';
import { NewContractModal } from './modals/NewContractModal';

export default function App() {
  const [page, setPage] = useState("shops");
  const [targetOwnerId, setTargetOwnerId] = useState<string | null>(null);
  const [targetShopId, setTargetShopId] = useState<number | null>(null);
  const [owners, setOwners] = useState<Owner[]>(INIT_OWNERS);
  const [shops, setShops] = useState<Shop[]>(INIT_SHOPS);
  const [toast, setToast] = useState("");
  const [showContract, setShowContract] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data === "openContract") setShowContract(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function showToast(msg: string) { setToast(msg); setTimeout(function() { setToast(""); }, 2500); }

  function navigate(to: string, id: number | string | null) {
    if (to === "owners") { setTargetOwnerId(id as string); setPage("owners"); }
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
        <div style={{ background:"#fff", borderBottom:"1.5px solid #e5e7eb", height:44, display:"flex", alignItems:"center", flexShrink:0 }}>
          {[{ id: "shops", label: "매장 정보 관리" }, { id: "owners", label: "점주 마스터" }].map(function(n) {
            var active = page === n.id;
            return (
              <button key={n.id} onClick={function() { setPage(n.id); }}
                style={{
                  fontSize: 13, padding: "0 20px", height: "100%", border: "none",
                  borderBottom: active ? "2.5px solid #111" : "2.5px solid transparent",
                  background: "transparent", color: active ? "#111" : "#6b7280",
                  cursor: "pointer", fontWeight: active ? 700 : 400, whiteSpace: "nowrap",
                }}>
                {n.label}
              </button>
            );
          })}
        </div>
        <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
          {page === "owners" && <OwnerMasterPage key={targetOwnerId ?? undefined} initOwnerId={targetOwnerId} />}
          {page === "shops" && <ShopInfoPage key={targetShopId ?? undefined} initShopId={targetShopId} />}
        </div>
      </div>
    </AppCtx.Provider>
  );
}
