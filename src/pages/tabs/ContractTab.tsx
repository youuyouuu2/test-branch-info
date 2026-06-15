import { useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { ContractData, EquipmentConfig } from '../../types';
import { EMPTY_CONTRACT } from '../../data/mock';
import { Inp } from '../../components/ui/Inp';
import { Field } from '../../components/ui/Field';
import { G2 } from '../../components/ui/G2';
import { Sec } from '../../components/ui/Sec';
import { ChkG } from '../../components/ui/ChkG';

export interface ContractTabProps {
  data: ContractData;
  setData: Dispatch<SetStateAction<ContractData>>;
}

type AmountFieldKey = 'contract_amount' | 'intermediate1_amount' | 'intermediate2_amount' | 'balance_amount' | 'consulting_amount';

function AmountTable({ data, setData }: ContractTabProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Record<AmountFieldKey, string>>>({});
  var fields = [
    {label:"계약금", key:"contract_amount"},
    {label:"중도 1차", key:"intermediate1_amount"},
    {label:"중도 2차", key:"intermediate2_amount"},
    {label:"잔금", key:"balance_amount"},
    {label:"컨설팅 금액", key:"consulting_amount"},
  ];
  var src = editing ? draft : data;
  var total = fields.reduce(function(s,f) { return s + (Number(String((src as Record<string, string>)[f.key]||"").replace(/,/g,""))||0); }, 0);
  function startEdit() { setDraft(Object.assign({},data)); setEditing(true); }
  function save() { setData(function(p) { return Object.assign({},p,draft); }); setEditing(false); }
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        {!editing
          ? <button onClick={startEdit} style={{fontSize:12,padding:"5px 12px",border:"1.5px solid #d1d5db",borderRadius:6,background:"#fff",color:"#374151",cursor:"pointer"}}>수정</button>
          : <><button onClick={save} style={{fontSize:12,padding:"5px 12px",border:"none",borderRadius:6,background:"#111",color:"#fff",cursor:"pointer",fontWeight:600}}>저장</button><button onClick={function(){setEditing(false);}} style={{fontSize:12,padding:"5px 12px",border:"1.5px solid #d1d5db",borderRadius:6,background:"#fff",color:"#6b7280",cursor:"pointer"}}>취소</button></>
        }
      </div>
      <div style={{border:"1.5px solid #e5e7eb",borderRadius:10,overflow:"hidden",width:"60%"}}>
        {fields.map(function(f) {
          return (
            <div key={f.key} style={{display:"flex",alignItems:"center",borderBottom:"1px solid #f3f4f6"}}>
              <div style={{width:110,padding:"10px 14px",fontSize:13,fontWeight:600,color:"#374151",background:"#f9fafb",borderRight:"1.5px solid #e5e7eb",flexShrink:0}}>{f.label}</div>
              {editing
                ? <input value={draft[f.key as AmountFieldKey]||""} onChange={function(e){var k=f.key as AmountFieldKey;setDraft(function(p){return Object.assign({},p,{[k]:e.target.value});});}} placeholder="0" style={{flex:1,fontSize:14,padding:"10px 12px",background:"#fff",border:"none",color:"#111",outline:"none",textAlign:"right",minWidth:0}}/>
                : <div style={{flex:1,fontSize:14,padding:"10px 12px",color:"#111",textAlign:"right"}}>{(src as Record<string, string>)[f.key]?Number(String((src as Record<string, string>)[f.key]).replace(/,/g,"")).toLocaleString():<span style={{color:"#d1d5db"}}>0</span>}</div>
              }
              <span style={{fontSize:13,color:"#9ca3af",padding:"0 12px",flexShrink:0}}>원</span>
            </div>
          );
        })}
        <div style={{display:"flex",alignItems:"center",background:"#f0fdf4",borderTop:"1.5px solid #bbf7d0"}}>
          <div style={{width:110,padding:"10px 14px",fontSize:13,fontWeight:700,color:"#15803d",background:"#dcfce7",borderRight:"1.5px solid #bbf7d0",flexShrink:0}}>최종 금액</div>
          <div style={{flex:1,fontSize:14,fontWeight:700,padding:"10px 12px",color:"#15803d",textAlign:"right"}}>{total.toLocaleString()}</div>
          <span style={{fontSize:13,color:"#15803d",padding:"0 12px",flexShrink:0}}>원</span>
        </div>
      </div>
    </div>
  );
}

interface EquipmentBuilderProps {
  value: EquipmentConfig;
  onChange: (value: EquipmentConfig) => void;
}

function EquipmentBuilder({ value, onChange }: EquipmentBuilderProps) {
  var brand = value.brand||"";
  var washers = value.washers||[{size:"20kg",count:0},{size:"30kg",count:0},{size:"40kg",count:0}];
  var dryers = value.dryers||[{id:"2단_25kg",label:"2단 25kg",count:0},{id:"1단_30kg",label:"1단 30kg",count:0},{id:"1단_40kg",label:"1단 40kg",count:0}];
  var vendingType = value.vending_type||"";

  function setBrand(b: string) { onChange(Object.assign({},value,{brand:b})); }
  function setWasher(size: string, cnt: number) {
    var w = washers.map(function(x){return x.size===size?Object.assign({},x,{count:cnt}):x;});
    onChange(Object.assign({},value,{washers:w}));
  }
  function setDryer(id: string, cnt: number) {
    var d = dryers.map(function(x){return x.id===id?Object.assign({},x,{count:cnt}):x;});
    onChange(Object.assign({},value,{dryers:d}));
  }
  function setVending(v: string) { onChange(Object.assign({},value,{vending_type:v})); }

  var summaryParts = [];
  if (brand) summaryParts.push("["+brand+"]");
  washers.filter(function(w){return w.count>0;}).forEach(function(w){summaryParts.push("세탁 "+w.size+" "+w.count+"대");});
  dryers.filter(function(d){return d.count>0;}).forEach(function(d){summaryParts.push("건조 "+d.label+" "+d.count+"대");});
  if (vendingType) summaryParts.push("자판기 "+vendingType);
  var summary = summaryParts.join(" · ");

  function Counter(props: { label: string; count: number; onMinus: () => void; onPlus: () => void }) {
    return (
      <div style={{background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:8,padding:"10px 12px"}}>
        <p style={{fontSize:12,fontWeight:600,color:"#374151",margin:"0 0 8px"}}>{props.label}</p>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={props.onMinus} style={{width:28,height:28,border:"1.5px solid #d1d5db",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>−</button>
          <span style={{fontSize:16,fontWeight:700,color:"#111",minWidth:20,textAlign:"center"}}>{props.count}</span>
          <button onClick={props.onPlus} style={{width:28,height:28,border:"1.5px solid #d1d5db",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>+</button>
          <span style={{fontSize:11,color:"#9ca3af"}}>대</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{border:"1.5px solid #e5e7eb",borderRadius:10,overflow:"hidden"}}>
      <div style={{padding:"12px 14px",borderBottom:"1px solid #f3f4f6",background:"#f9fafb"}}>
        <p style={{fontSize:12,fontWeight:600,color:"#374151",margin:"0 0 8px"}}>브랜드</p>
        <div style={{display:"flex",gap:8}}>
          {["우방","다뉴브","기타"].map(function(b){var a=brand===b;return <button key={b} onClick={function(){setBrand(b);}} style={{fontSize:13,padding:"6px 14px",borderRadius:8,cursor:"pointer",border:"1.5px solid "+(a?"#111":"#d1d5db"),background:a?"#111":"#fff",color:a?"#fff":"#374151",fontWeight:a?600:400}}>{b}</button>;})}
        </div>
      </div>
      <div style={{padding:"12px 14px",borderBottom:"1px solid #f3f4f6"}}>
        <p style={{fontSize:12,fontWeight:600,color:"#374151",margin:"0 0 10px"}}>세탁기</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {washers.map(function(w){return <Counter key={w.size} label={w.size} count={w.count} onMinus={function(){setWasher(w.size,Math.max(0,w.count-1));}} onPlus={function(){setWasher(w.size,Math.min(5,w.count+1));}}/>;})}
        </div>
      </div>
      <div style={{padding:"12px 14px",borderBottom:"1px solid #f3f4f6"}}>
        <p style={{fontSize:12,fontWeight:600,color:"#374151",margin:"0 0 10px"}}>건조기</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {dryers.map(function(d){return <Counter key={d.id} label={d.label} count={d.count} onMinus={function(){setDryer(d.id,Math.max(0,d.count-1));}} onPlus={function(){setDryer(d.id,Math.min(5,d.count+1));}}/>;})}
        </div>
      </div>
      <div style={{padding:"12px 14px",borderBottom:summary?"1px solid #f3f4f6":"none"}}>
        <p style={{fontSize:12,fontWeight:600,color:"#374151",margin:"0 0 8px"}}>자판기</p>
        <div style={{display:"flex",gap:8}}>
          {["없음","일반","멀티"].map(function(v){var a=(v==="없음"?vendingType==="":vendingType===v);return <button key={v} onClick={function(){setVending(v==="없음"?"":v);}} style={{fontSize:13,padding:"6px 14px",borderRadius:8,cursor:"pointer",border:"1.5px solid "+(a?"#111":"#d1d5db"),background:a?"#111":"#fff",color:a?"#fff":"#374151",fontWeight:a?600:400}}>{v}</button>;})}
        </div>
      </div>
      {summary && <div style={{padding:"10px 14px",background:"#f0fdf4"}}><p style={{fontSize:12,fontWeight:600,color:"#15803d",margin:0}}>구성: {summary}</p></div>}
    </div>
  );
}

export function ContractTab({ data, setData }: ContractTabProps) {
  function s(k: keyof ContractData) { return function(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) { setData(function(p){return Object.assign({},p,{[k]:e.target.value});}); }; }
  return (
    <div>
      <Sec title="점주 정보">
        <G2>
          <Field label="점주명" half><Inp value={data.owner_name||""} onChange={s("owner_name")} placeholder="홍길동"/></Field>
          <Field label="점주 연락처" half><Inp value={data.owner_phone||""} onChange={s("owner_phone")} placeholder="010-0000-0000"/></Field>
        </G2>
        <Field label="이메일 주소"><Inp value={data.owner_email||""} onChange={s("owner_email")} placeholder="example@email.com"/></Field>
      </Sec>
      <Sec title="계약 현황">
        <G2>
          <Field label="계약 상태" half>
            <select value={data.contract_status} onChange={s("contract_status")} style={{width:"100%",fontSize:14,padding:"9px 12px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}>
              {["계약완료","계약중","대기","해지"].map(function(v){return <option key={v} value={v}>{v}</option>;})}
            </select>
          </Field>
          <Field label="오픈확정일" half><Inp value={data.open_confirmed_date} onChange={s("open_confirmed_date")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <G2>
          <Field label="가격 프로모션" half><Inp value={data.price_promotion||""} onChange={s("price_promotion")} placeholder="예: 오픈특가"/></Field>
          <Field label="세일즈 구분" half>
            <select value={data.sales_type||""} onChange={s("sales_type")} style={{width:"100%",fontSize:14,padding:"9px 12px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}>
              {["","신규","추천","재계약","직접문의"].map(function(v){return <option key={v} value={v}>{v||"선택"}</option>;})}
            </select>
          </Field>
        </G2>
        <Field label="컨설팅 여부">
          <ChkG options={[{value:"yes",label:"있음"},{value:"no",label:"없음"}]} value={data.consulting_yn||"no"} onChange={function(v){setData(function(p){return Object.assign({},p,{consulting_yn:v});});}}/>
        </Field>
      </Sec>
      <Sec title="계약 기기 구성">
        <EquipmentBuilder value={data.equipment_config||EMPTY_CONTRACT.equipment_config} onChange={function(v){setData(function(p){return Object.assign({},p,{equipment_config:v});});}}/>
      </Sec>
      <Sec title="계약서 서명">
        <G2>
          <Field label="장비계약서 버전" half><Inp value={data.equipment_contract_version} onChange={s("equipment_contract_version")}/></Field>
          <Field label="장비계약서 서명일" half><Inp value={data.equipment_sign_date} onChange={s("equipment_sign_date")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <G2>
          <Field label="위탁계약서 버전" half><Inp value={data.consignment_contract_version} onChange={s("consignment_contract_version")}/></Field>
          <Field label="위탁계약서 서명일" half><Inp value={data.consignment_sign_date} onChange={s("consignment_sign_date")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
      </Sec>
      <Sec title="계약 금액 (VAT 별도)">
        <AmountTable data={data} setData={setData}/>
      </Sec>
      <Sec title="담당">
        <G2>
          <Field label="주담당자" half><Inp value={data.sales_manager} onChange={s("sales_manager")}/></Field>
          <Field label="추천인" half><Inp value={data.recommender} onChange={s("recommender")}/></Field>
        </G2>
        <Field label="특이사항"><Inp value={data.special_note} onChange={s("special_note")}/></Field>
      </Sec>
    </div>
  );
}
