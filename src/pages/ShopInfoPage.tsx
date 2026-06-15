import { useState, type ChangeEvent } from 'react';
import type { Shop, ShopAlert, ContractData, BusinessData, LeaseData, ConsignmentData, InsuranceData, CmsData } from '../types';
import { CardDevicesSection } from '../components/CardDevicesSection';
import { useApp } from '../context/AppCtx';
import { SHOP_TABS, EMPTY_CONTRACT, EMPTY_BUSINESS, EMPTY_LEASE, EMPTY_CONSIGNMENT, EMPTY_INSURANCE, EMPTY_CMS } from '../data/mock';
import { Inp } from '../components/ui/Inp';
import { Field } from '../components/ui/Field';
import { G2 } from '../components/ui/G2';
import { Sec } from '../components/ui/Sec';
import { ChkG } from '../components/ui/ChkG';
import { Tog } from '../components/ui/Tog';
import { StateBadge } from '../components/ui/StateBadge';
import { ContractTab } from './tabs/ContractTab';
import { BusinessTab } from './tabs/BusinessTab';
import { LeaseTab } from './tabs/LeaseTab';
import { ConsignmentTab } from './tabs/ConsignmentTab';
import { InsuranceTab } from './tabs/InsuranceTab';
import { CMSTab } from './tabs/CMSTab';

export interface ShopInfoPageProps {
  initShopId?: number | null;
}

export function ShopInfoPage({ initShopId }: ShopInfoPageProps) {
  const app = useApp();
  const [selId, setSelId] = useState<number>(initShopId || (app.shops[0] && app.shops[0].id));
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("shop");
  const [expOwners, setExpOwners] = useState<Record<string, boolean>>({ P001:true, P002:false, P003:false, P004:false });
  const [activeTab, setActiveTab] = useState("basic");
  const [saved, setSaved] = useState(false);
  const [contractData, setContractData] = useState<ContractData>(Object.assign({}, EMPTY_CONTRACT));
  const [businessData, setBusinessData] = useState<BusinessData>(Object.assign({}, EMPTY_BUSINESS));
  const [leaseData, setLeaseData] = useState<LeaseData>(Object.assign({}, EMPTY_LEASE));
  const [consignmentData, setConsignmentData] = useState<ConsignmentData>(Object.assign({}, EMPTY_CONSIGNMENT));
  const [insuranceData, setInsuranceData] = useState<InsuranceData>(Object.assign({}, EMPTY_INSURANCE));
  const [cmsData, setCmsData] = useState<CmsData>(Object.assign({}, EMPTY_CMS));
  const [alerts, setAlerts] = useState<ShopAlert[]>([
    {id:1,level:"danger",title:"임대차 만료 임박",desc:"2026-05-14 (D-32)",tab:"lease"},
    {id:2,level:"warning",title:"위탁계약 갱신 필요",desc:"2028-06-19",tab:"consignment"},
  ]);

  var filtered = app.shops.filter(function(s) { return s.name.includes(search) || s.master_number.includes(search); });
  var active = filtered.filter(function(s) { return s.state !== "2"; });
  var direct = active.filter(function(s) { return s.category_id === "1"; });
  var franchise = active.filter(function(s) { return s.category_id === "2"; });
  var closed = filtered.filter(function(s) { return s.state === "2"; });
  var sel = app.shops.find(function(s) { return s.id === selId; });
  var selOwner = sel ? app.owners.find(function(o) { return o.id === sel!.owner_id; }) : null;

  function setSel(u: Shop) {
    app.setShops(function(p) { return p.map(function(s) { return s.id === selId ? u : s; }); });
  }
  function setField(k: keyof Shop) {
    return function(e: ChangeEvent<HTMLInputElement>) {
      if (!sel) return;
      setSel(Object.assign({}, sel, { [k]: e.target.value }));
    };
  }

  function ShopRow({ s, indent }: { s: Shop; indent?: boolean }) {
    var isSel = selId === s.id;
    return (
      <div onClick={function() { setSelId(s.id); setActiveTab("basic"); }}
        style={{ padding: "8px " + (indent ? "22px" : "14px") + " 8px " + (indent ? "26px" : "14px"), cursor:"pointer", background: isSel ? "#f3f4f6" : "transparent", borderLeft: "2.5px solid " + (isSel ? "#111" : "transparent"), display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:13, fontWeight: isSel ? 600 : 400, color:"#111", margin:0 }}>{s.name}</p>
          <p style={{ fontSize:11, color:"#9ca3af", margin:"1px 0 0" }}>#{s.master_number}</p>
        </div>
        <StateBadge state={s.state} />
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", height:"100%" }}>
      <div style={{ width:230, background:"#fff", borderRight:"1.5px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"12px 12px 6px" }}>
          <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="매장명 / 번호 검색"
            style={{ width:"100%", fontSize:13, padding:"8px 10px", boxSizing:"border-box", background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:8, color:"#111", outline:"none" }} />
        </div>
        <div style={{ display:"flex", margin:"4px 12px 8px", background:"#f3f4f6", borderRadius:8, padding:3 }}>
          {[{v:"shop",l:"매장별"},{v:"owner",l:"점주별"}].map(function(item) {
            var a = viewMode === item.v;
            return (
              <button key={item.v} onClick={function() { setViewMode(item.v); }}
                style={{ flex:1, fontSize:12, padding:"5px 0", border:"none", borderRadius:6, cursor:"pointer", background: a ? "#fff" : "transparent", color: a ? "#111" : "#6b7280", fontWeight: a ? 600 : 400, boxShadow: a ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                {item.l}
              </button>
            );
          })}
        </div>
        <div style={{ flex:1, overflowY:"auto", paddingBottom:12 }}>
          {viewMode === "shop" && (
            <div>
              {direct.length > 0 && (
                <div>
                  <p style={{ fontSize:11, fontWeight:600, color:"#9ca3af", padding:"6px 14px 4px", margin:0 }}>직영 ({direct.length})</p>
                  {direct.map(function(s) { return <ShopRow key={s.id} s={s} indent={false} />; })}
                </div>
              )}
              {franchise.length > 0 && (
                <div>
                  <p style={{ fontSize:11, fontWeight:600, color:"#9ca3af", padding:"10px 14px 4px", margin:0 }}>가맹 ({franchise.length})</p>
                  {franchise.map(function(s) { return <ShopRow key={s.id} s={s} indent={false} />; })}
                </div>
              )}
              {filtered.length === 0 && <p style={{ fontSize:13, color:"#9ca3af", textAlign:"center", padding:"20px 0" }}>결과 없음</p>}
              {closed.length > 0 && (
                <div style={{borderTop:"1px solid #f3f4f6", marginTop:8}}>
                  <p style={{ fontSize:11, fontWeight:600, color:"#9ca3af", padding:"10px 14px 4px", margin:0 }}>폐점 ({closed.length})</p>
                  {closed.map(function(s) { return <ShopRow key={s.id} s={s} indent={false} />; })}
                </div>
              )}
            </div>
          )}
          {viewMode === "owner" && app.owners.map(function(o) {
            var os = app.shops.filter(function(s) { return s.owner_id === o.id; });
            var exp = expOwners[o.id];
            return (
              <div key={o.id}>
                <button onClick={function() { setExpOwners(function(p) { return Object.assign({}, p, { [o.id]: !p[o.id] }); }); }}
                  style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 14px", background:"none", border:"none", borderBottom:"1px solid #f3f4f6", cursor:"pointer" }}>
                  <div style={{ textAlign:"left" }}>
                    <p style={{ fontSize:13, fontWeight:600, color:"#111", margin:0 }}>{o.name} <span style={{ fontSize:11, color:"#9ca3af", fontWeight:400 }}>{o.id}</span></p>
                    <p style={{ fontSize:11, color:"#9ca3af", margin:"1px 0 0" }}>{os.length}개 매장</p>
                  </div>
                  <span style={{ fontSize:10, color:"#9ca3af" }}>{exp ? "▲" : "▼"}</span>
                </button>
                {exp && os.map(function(s) { return <ShopRow key={s.id} s={s} indent={true} />; })}
              </div>
            );
          })}
        </div>
      </div>

      {sel && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ background:"#fff", borderBottom:"1.5px solid #e5e7eb", padding:"14px 20px 0", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:"#111", margin:0 }}>{sel.name}</p>
                <p style={{ fontSize:12, color:"#9ca3af", margin:"3px 0 0" }}>
                  {(function(){
                    var openDate = sel.open_date ? new Date(sel.open_date) : null;
                    var dateStr = "";
                    if (openDate && !isNaN(openDate.getTime())) {
                      var days = Math.floor((Date.now() - openDate.getTime()) / 86400000);
                      var yy = String(openDate.getFullYear()).slice(2);
                      var mm = String(openDate.getMonth()+1).padStart(2,"0");
                      var dd = String(openDate.getDate()).padStart(2,"0");
                      var years = Math.floor(days/365);
                      var rem = days % 365;
                      var label = years > 0 ? "운영 "+years+"년 "+rem+"일" : "운영 "+days+"일";
                      dateStr = yy+"."+mm+"."+dd+" 오픈 · "+label;
                    } else {
                      dateStr = "오픈일 미입력";
                    }
                    var pauseTag = null;
                    if (sel.state === "3") {
                      var ps = sel.pause_start ? sel.pause_start.slice(2).replace(/-/g,".") : "";
                      var pe = sel.pause_end ? sel.pause_end.slice(2).replace(/-/g,".") : "";
                      var pauseLabel = ps ? (pe ? ps+" ~ "+pe : ps+" ~") : "기간 미입력";
                      pauseTag = <span style={{marginLeft:8,fontSize:11,padding:"1px 7px",borderRadius:5,background:"#fef3c7",color:"#92400e",fontWeight:600}}>{"일시 영업정지 "+pauseLabel}</span>;
                    }
                    return <span>{dateStr}{pauseTag}</span>;
                  })()}
                </p>
              </div>
              <button onClick={function() { setSaved(true); setTimeout(function() { setSaved(false); }, 2000); app.showToast("저장됐어요."); }}
                style={{ fontSize:13, padding:"8px 20px", borderRadius:8, cursor:"pointer", fontWeight:600, border:"none", background: saved ? "#16a34a" : "#111", color:"#fff" }}>
                {saved ? "✓ 저장됨" : "저장하기"}
              </button>
            </div>
            <div style={{ display:"flex", overflowX:"auto" }}>
              {SHOP_TABS.map(function(t) {
                var ha = alerts.some(function(a) { return a.tab === t.id; });
                return (
                  <button key={t.id} onClick={function() { setActiveTab(t.id); }}
                    style={{ padding:"7px 14px", fontSize:13, cursor:"pointer", whiteSpace:"nowrap", background:"transparent", border:"none", borderBottom: activeTab === t.id ? "2.5px solid #111" : "2.5px solid transparent", color: activeTab === t.id ? "#111" : "#6b7280", fontWeight: activeTab === t.id ? 700 : 400, position:"relative" }}>
                    {t.label}
                    {ha && <span style={{ position:"absolute", top:6, right:8, width:6, height:6, borderRadius:"50%", background:"#ef4444" }} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
            {alerts.length > 0 && (
              <div style={{ marginBottom:16 }}>
                {alerts.map(function(a) {
                  var C = { danger:{bg:"#fef2f2",border:"#fca5a5",dot:"#ef4444",text:"#b91c1c"}, warning:{bg:"#fffbeb",border:"#fcd34d",dot:"#f59e0b",text:"#92400e"} };
                  var c = C[a.level];
                  return (
                    <div key={a.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:c.bg, border:"1.5px solid "+c.border, borderRadius:10, marginBottom:6 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:c.text }}>{a.title}</span>
                        <span style={{ fontSize:12, color:"#6b7280", marginLeft:8 }}>{a.desc}</span>
                      </div>
                      <button onClick={function() { setActiveTab(a.tab); }} style={{ fontSize:12, padding:"4px 10px", border:"1.5px solid "+c.border, borderRadius:6, background:"#fff", color:c.text, cursor:"pointer" }}>바로가기</button>
                      <button onClick={function() { var aid = a.id; setAlerts(function(p) { return p.filter(function(x) { return x.id !== aid; }); }); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:18, lineHeight:1, padding:0 }}>×</button>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"24px" }}>
              {activeTab === "basic" && (
                <div>
                  <Sec title="매장 기본">
                    {/* ① 현재 상태 + 날짜 한 줄 */}
                    <div style={{display:"flex",alignItems:"flex-end",gap:16,flexWrap:"wrap",marginBottom:14}}>
                      <div>
                        <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>현재 상태</label>
                        <ChkG options={[{value:"0",label:"Yet"},{value:"1",label:"Open"},{value:"2",label:"Close"},{value:"3",label:"Pause"}]} value={sel.state} onChange={function(v){setSel(Object.assign({},sel,{state:v}));}}/>
                      </div>
                      {sel.state!=="0"&&(
                        <>
                          <div>
                            <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>오픈일</label>
                            <input type="date" value={sel.open_date||""} onChange={setField("open_date")} style={{fontSize:13,padding:"7px 10px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}/>
                          </div>
                          {sel.state==="2"&&(
                            <div>
                              <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>폐점일</label>
                              <input type="date" value={sel.close_date||""} onChange={setField("close_date")} style={{fontSize:13,padding:"7px 10px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}/>
                            </div>
                          )}
                          {sel.state==="3"&&(
                            <>
                              <div>
                                <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>영업정지 시작일</label>
                                <input type="date" value={sel.pause_start||""} onChange={setField("pause_start")} style={{fontSize:13,padding:"7px 10px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}/>
                              </div>
                              <div>
                                <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>영업정지 종료일</label>
                                <input type="date" value={sel.pause_end||""} onChange={setField("pause_end")} style={{fontSize:13,padding:"7px 10px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}/>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {/* ③ 내부 관리 정보 */}
                    <div style={{marginBottom:14}}>
                      <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>Category ID</label>
                      <ChkG options={[{value:"1",label:"직영점"},{value:"2",label:"가맹점"}]} value={sel.category_id} onChange={function(v){setSel(Object.assign({},sel,{category_id:v}));}}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0 12px"}}>
                      {[
                        {label:"호점 번호",key:"branch_number",ph:"03"},
                        {label:"Branch ID",key:"branch_id",ph:""},
                        {label:"마스터 번호",key:"master_number",ph:""},
                        {label:"지점키",key:"shop_key",ph:"(1001) #구디점"},
                      ].map(function(f){return(
                        <div key={f.key} style={{marginBottom:14}}>
                          <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>{f.label}</label>
                          <Inp value={String(sel![f.key] ?? "")} onChange={setField(f.key as keyof Shop)} placeholder={f.ph}/>
                        </div>
                      );})}
                    </div>
                    <G2>
                      <Field label="매장명" half><Inp value={sel.name} onChange={setField("name")} /></Field>
                      <Field label="영문명" half><Inp value={sel.eng_name||""} onChange={setField("eng_name")} /></Field>
                    </G2>
                    <div style={{marginBottom:14}}>
                      <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>주소</label>
                      <div style={{display:"flex",gap:8,marginBottom:6}}>
                        <input value={sel.postcode||""} onChange={setField("postcode")} placeholder="우편번호"
                          style={{width:90,fontSize:14,padding:"9px 12px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",flexShrink:0}}/>
                        <button onClick={function(){
                          if(window.daum&&window.daum.Postcode){
                            new window.daum.Postcode({oncomplete:function(data){
                              setSel(Object.assign({},sel,{postcode:data.zonecode,address_1:data.roadAddress||data.jibunAddress}));
                            }}).open();
                          } else {
                            alert("실제 서버 환경에서 카카오 주소 API 로드 후 사용 가능합니다.");
                          }
                        }} style={{fontSize:13,padding:"9px 14px",border:"1.5px solid #d1d5db",borderRadius:8,background:"#f9fafb",color:"#374151",cursor:"pointer",flexShrink:0}}>
                          🔍 주소 검색
                        </button>
                        <Inp value={sel.address_1||""} onChange={setField("address_1")} placeholder="도로명 주소"/>
                      </div>
                      <div style={{marginBottom:6}}>
                        <Inp value={sel.address_2||""} onChange={setField("address_2")} placeholder="상세 주소 (동, 호수 등)"/>
                      </div>
                      <div>
                        <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>네이버 지도 URL</label>
                        <Inp value={sel.map_url||""} onChange={setField("map_url")} placeholder="https://naver.me/..."/>
                      </div>
                    </div>
                  </Sec>
                  <Sec title="연결된 점주">
                    {selOwner
                      ? (
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:8 }}>
                          <div>
                            <p style={{ fontSize:13, fontWeight:600, color:"#111", margin:"0 0 2px" }}>{selOwner.name} <span style={{ fontSize:11, color:"#9ca3af", fontWeight:400 }}>({selOwner.id})</span></p>
                            <p style={{ fontSize:12, color:"#6b7280", margin:0 }}>{selOwner.phone} · {selOwner.email}</p>
                          </div>
                          <button onClick={function() { if (selOwner) app.navigate("owners", selOwner.id); }}
                            style={{ fontSize:12, padding:"5px 12px", border:"1.5px solid #d1d5db", borderRadius:7, background:"#fff", color:"#374151", cursor:"pointer" }}>점주 마스터 →</button>
                        </div>
                      )
                      : <p style={{ fontSize:13, color:"#9ca3af" }}>연결된 점주 없음</p>
                    }
                  </Sec>
                  <Sec title="운영 설정">
                    <G2>
                      <Field label="운영형태" half>
                        <ChkG options={[{value:"0",label:"위탁"},{value:"1",label:"점주직접"},{value:"2",label:"본사직영"}]} value={sel.owner_direct} onChange={function(v) { setSel(Object.assign({}, sel, {owner_direct:v})); }} />
                      </Field>
                      <Field label="알림톡" half>
                        <Tog value={sel.use_kko_msg} onChange={function(v) { setSel(Object.assign({}, sel, {use_kko_msg:v})); }} />
                      </Field>
                    </G2>
                  </Sec>
                  <Sec title="카드 단말기">
                    <CardDevicesSection shop={sel} onUpdate={setSel} />
                  </Sec>
                  <Sec title="알림 채널">
                    <G2>
                      <Field label="슬랙 채널 코드" half>
                        <Inp value={sel.slack_channel_code || ""} onChange={setField("slack_channel_code")} placeholder="예: C08N0L58UBA" />
                      </Field>
                      <Field label="디스코드 채널 코드" half>
                        <Inp value={sel.discord_channel_code || ""} onChange={setField("discord_channel_code")} placeholder="예: 1486535292390342828" />
                      </Field>
                    </G2>
                  </Sec>
                </div>
              )}
              {activeTab === "contract" && <ContractTab data={contractData} setData={setContractData}/>}
              {activeTab === "business" && <BusinessTab data={businessData} setData={setBusinessData}/>}
              {activeTab === "lease" && <LeaseTab data={leaseData} setData={setLeaseData}/>}
              {activeTab === "consignment" && <ConsignmentTab data={consignmentData} setData={setConsignmentData}/>}
              {activeTab === "insurance" && <InsuranceTab data={insuranceData} setData={setInsuranceData}/>}
              {activeTab === "cms" && <CMSTab data={cmsData} setData={setCmsData}/>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
