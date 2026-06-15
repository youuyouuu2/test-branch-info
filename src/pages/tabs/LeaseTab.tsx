import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { LeaseData, LeaseRenewal } from '../../types';
import { Inp } from '../../components/ui/Inp';
import { Field } from '../../components/ui/Field';
import { G2 } from '../../components/ui/G2';
import { Sec } from '../../components/ui/Sec';
export interface LeaseTabProps {
  data: LeaseData;
  setData: Dispatch<SetStateAction<LeaseData>>;
}

export function LeaseTab({ data, setData }: LeaseTabProps) {
  function s(k: keyof LeaseData) { return function(e: ChangeEvent<HTMLInputElement>) { setData(function(p){return Object.assign({},p,{[k]:e.target.value});}); }; }
  var renewals = data.renewals||[];

  // 요약 계산
  var today = new Date();
  var startMs = data.start_date ? new Date(data.start_date).getTime() : null;
  var endMs = data.end_date ? new Date(data.end_date).getTime() : null;
  var durationMonths = (startMs && endMs) ? Math.round((endMs - startMs) / (1000*60*60*24*30.5)) : null;
  var daysLeft = endMs ? Math.round((endMs - today.getTime()) / (1000*60*60*24)) : null;
  var lastUpdated = data.updated_at || "";

  // 최종 만료일: 갱신 이력 중 가장 늦은 종료일 or 기본 종료일
  var latestEnd = data.end_date || "";
  renewals.forEach(function(r){ if(r.end && r.end > latestEnd) latestEnd = r.end; });

  function updateRenewal(i: number, f: keyof LeaseRenewal, v: string) {
    var arr = renewals.map(function(r,j){return j===i?Object.assign({},r,{[f]:v}):r;});
    setData(function(p){return Object.assign({},p,{renewals:arr});});
  }
  function addRenewal() {
    setData(function(p){return Object.assign({},p,{renewals:renewals.concat([{round:(renewals.length+1)+"차",start:"",end:"",memo:""}])});});
  }

  var summaryCards = [
    { label:"임대 기간", value: durationMonths !== null ? durationMonths + "개월" : "—", sub: (data.start_date||"—") + " ~ " + (data.end_date||"—") },
    { label:"오픈일", value: data.open_date||"—", sub:"매장 오픈 기준" },
    { label:"다음 만료일", value: latestEnd||"—", sub: daysLeft !== null ? (daysLeft >= 0 ? "D-"+daysLeft : "D+"+Math.abs(daysLeft)+" 만료") : "—", warn: daysLeft !== null && daysLeft < 90 },
  ];

  return (
    <div>
      {/* 요약 카드 */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {summaryCards.map(function(c){
          return (
            <div key={c.label} style={{padding:"14px 16px",background: c.warn?"#fef2f2":"#f9fafb",border:"1.5px solid "+(c.warn?"#fca5a5":"#e5e7eb"),borderRadius:10}}>
              <p style={{fontSize:11,fontWeight:600,color:c.warn?"#b91c1c":"#6b7280",margin:"0 0 4px"}}>{c.label}</p>
              <p style={{fontSize:16,fontWeight:700,color:c.warn?"#ef4444":"#111",margin:"0 0 2px"}}>{c.value}</p>
              <p style={{fontSize:11,color:c.warn?"#f87171":"#9ca3af",margin:0}}>{c.sub}</p>
            </div>
          );
        })}
      </div>

      <Sec title="임대차 기본">
        <G2>
          <Field label="부동산 계약일" half><Inp value={data.contract_date||""} onChange={s("contract_date")} placeholder="YYYY-MM-DD"/></Field>
          <Field label="임대차 시작일" half><Inp value={data.start_date||""} onChange={s("start_date")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <G2>
          <Field label="임대차 종료일" half><Inp value={data.end_date||""} onChange={s("end_date")} placeholder="YYYY-MM-DD"/></Field>
          <Field label="사용기간 (개월)" half><Inp value={data.duration_months||""} onChange={s("duration_months")} placeholder="자동계산 또는 직접입력"/></Field>
        </G2>
        <G2>
          <Field label="오픈일" half><Inp value={data.open_date||""} onChange={s("open_date")} placeholder="YYYY-MM-DD"/></Field>
          <Field label="갱신 가능 횟수" half><Inp value={data.renewal_count||""} onChange={s("renewal_count")} placeholder="예: 2"/></Field>
        </G2>
        <G2>
          <Field label="보증금 (원)" half><Inp value={data.deposit||""} onChange={s("deposit")}/></Field>
          <Field label="월 임차료 (원)" half><Inp value={data.monthly_rent||""} onChange={s("monthly_rent")}/></Field>
        </G2>
        <G2>
          <Field label="권리금 (원)" half><Inp value={data.premium||""} onChange={s("premium")}/></Field>
          <Field label="관리비 (원)" half><Inp value={data.management_fee||""} onChange={s("management_fee")}/></Field>
        </G2>
        <G2>
          <Field label="임대 면적 (㎡)" half><Inp value={data.area_sqm||""} onChange={s("area_sqm")}/></Field>
          <Field label="임대 면적 (평)" half><Inp value={data.area_pyeong||""} onChange={s("area_pyeong")}/></Field>
        </G2>
        <Field label="비고"><Inp value={data.memo||""} onChange={s("memo")} placeholder="특이사항 등"/></Field>
        {lastUpdated && <p style={{fontSize:11,color:"#9ca3af",margin:"4px 0 0",textAlign:"right"}}>데이터 최종 업데이트: {lastUpdated}</p>}
      </Sec>

      <Sec title="갱신 이력">
        <div style={{border:"1.5px solid #e5e7eb",borderRadius:10,overflow:"hidden",marginBottom:10}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f9fafb"}}>
                {["차수","시작일","종료일","메모"].map(function(h){return <th key={h} style={{padding:"9px 12px",textAlign:"left",color:"#6b7280",fontWeight:600,borderBottom:"1.5px solid #e5e7eb"}}>{h}</th>;})}
              </tr>
            </thead>
            <tbody>
              {renewals.length===0&&<tr><td colSpan={4} style={{padding:"16px",textAlign:"center",color:"#9ca3af",fontSize:13}}>갱신 이력 없음</td></tr>}
              {renewals.map(function(r,i){return(
                <tr key={i} style={{borderBottom:"1px solid #f3f4f6"}}>
                  <td style={{padding:"8px 12px",color:"#9ca3af",fontSize:12}}>{r.round}</td>
                  {(["start","end","memo"] as const).map(function(f){return(
                    <td key={f} style={{padding:"4px 8px"}}>
                      <input value={r[f]||""} onChange={function(e){updateRenewal(i,f,e.target.value);}}
                        style={{width:"100%",fontSize:13,padding:"6px 8px",background:"transparent",border:"1.5px solid #e5e7eb",borderRadius:6,color:"#111",outline:"none",boxSizing:"border-box"}}
                        placeholder={f==="memo"?"메모":"YYYY-MM-DD"}/>
                    </td>
                  );})}
                </tr>
              );})}
            </tbody>
          </table>
        </div>
        <button onClick={addRenewal} style={{fontSize:13,padding:"8px 16px",border:"1.5px dashed #d1d5db",borderRadius:8,background:"#fff",color:"#6b7280",cursor:"pointer"}}>+ 갱신 이력 추가</button>
      </Sec>
    </div>
  );
}
