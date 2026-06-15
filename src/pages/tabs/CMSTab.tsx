import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { CmsData } from '../../types';
import { Inp } from '../../components/ui/Inp';
import { Field } from '../../components/ui/Field';
import { G2 } from '../../components/ui/G2';
import { Sec } from '../../components/ui/Sec';
import { ChkG } from '../../components/ui/ChkG';

export interface CMSTabProps {
  data: CmsData;
  setData: Dispatch<SetStateAction<CmsData>>;
}

export function CMSTab({ data, setData }: CMSTabProps) {
  function s(k: keyof CmsData) { return function(e: ChangeEvent<HTMLInputElement>) { setData(function(p){return Object.assign({},p,{[k]:e.target.value});}); }; }
  var payments = data.payments||[];
  function removePayment(i: number) {
    setData(function(p){return Object.assign({},p,{payments:payments.filter(function(_,j){return j!==i;})});});
  }
  function addPayment() {
    setData(function(p){return Object.assign({},p,{payments:payments.concat([{date:new Date().toISOString().slice(0,10),type:"",amount:"",note:""}])});});
  }
  return (
    <div>
      <Sec title="CMS 등록">
        <G2>
          <Field label="회원등록여부" half>
            <ChkG options={[{value:"yes",label:"등록"},{value:"no",label:"미등록"}]} value={data.registered||"no"} onChange={function(v){setData(function(p){return Object.assign({},p,{registered:v});});}}/>
          </Field>
          <Field label="동의방법" half><Inp value={data.consent_method||""} onChange={s("consent_method")} placeholder="예: 전자서명"/></Field>
        </G2>
        <G2>
          <Field label="CMS 관리번호" half><Inp value={data.cms_key||""} onChange={s("cms_key")}/></Field>
          <Field label="은행명" half><Inp value={data.bank_name||""} onChange={s("bank_name")}/></Field>
        </G2>
        <G2>
          <Field label="예금주명" half><Inp value={data.account_holder||""} onChange={s("account_holder")}/></Field>
          <Field label="계좌번호" half><Inp value={data.account_number||""} onChange={s("account_number")}/></Field>
        </G2>
        <G2>
          <Field label="출금시작 (년/월)" half>
            <div style={{display:"flex",gap:8}}>
              <Inp value={data.withdrawal_start_year||""} onChange={s("withdrawal_start_year")} placeholder="2024"/>
              <Inp value={data.withdrawal_start_month||""} onChange={s("withdrawal_start_month")} placeholder="08"/>
            </div>
          </Field>
          <Field label="정기출금일" half><Inp value={data.withdrawal_day||""} onChange={s("withdrawal_day")} placeholder="25"/></Field>
        </G2>
        <Field label="출금액 (원)"><Inp value={data.withdrawal_amount||""} onChange={s("withdrawal_amount")}/></Field>
      </Sec>
      <Sec title="입금 / 계산서 이력">
        <div style={{border:"1.5px solid #e5e7eb",borderRadius:10,overflow:"hidden",marginBottom:10}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#f9fafb"}}>
                {["날짜","구분","금액","비고",""].map(function(h,i){return <th key={i} style={{padding:"9px 12px",textAlign:i===2?"right":"left",color:"#6b7280",fontWeight:600,borderBottom:"1.5px solid #e5e7eb"}}>{h}</th>;})}
              </tr>
            </thead>
            <tbody>
              {payments.length===0&&<tr><td colSpan={5} style={{padding:"16px",textAlign:"center",color:"#9ca3af",fontSize:13}}>입금 이력 없음</td></tr>}
              {payments.map(function(p,i){return(
                <tr key={i} style={{borderBottom:"1px solid #f3f4f6"}}>
                  <td style={{padding:"8px 12px",color:"#6b7280"}}>{p.date}</td>
                  <td style={{padding:"8px 12px"}}><span style={{fontSize:12,padding:"2px 8px",borderRadius:6,background:"#eff6ff",color:"#1d4ed8",fontWeight:600}}>{p.type||"—"}</span></td>
                  <td style={{padding:"8px 12px",color:"#111",textAlign:"right",fontWeight:500}}>{p.amount?Number(String(p.amount).replace(/,/g,"")).toLocaleString()+"원":"—"}</td>
                  <td style={{padding:"8px 12px",color:"#9ca3af"}}>{p.note}</td>
                  <td style={{padding:"8px 8px",textAlign:"center"}}><button onClick={function(){removePayment(i);}} style={{fontSize:12,padding:"2px 8px",border:"1.5px solid #fca5a5",borderRadius:5,background:"#fff",color:"#ef4444",cursor:"pointer"}}>삭제</button></td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
        <button onClick={addPayment} style={{fontSize:13,padding:"8px 16px",border:"1.5px dashed #d1d5db",borderRadius:8,background:"#fff",color:"#6b7280",cursor:"pointer"}}>+ 입금 이력 추가</button>
      </Sec>
    </div>
  );
}
