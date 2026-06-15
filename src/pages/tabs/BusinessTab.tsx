import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { BusinessData } from '../../types';
import { Inp } from '../../components/ui/Inp';
import { Field } from '../../components/ui/Field';
import { G2 } from '../../components/ui/G2';
import { Sec } from '../../components/ui/Sec';
import { ChkG } from '../../components/ui/ChkG';

export interface BusinessTabProps {
  data: BusinessData;
  setData: Dispatch<SetStateAction<BusinessData>>;
}

export function BusinessTab({ data, setData }: BusinessTabProps) {
  function s(k: keyof BusinessData) { return function(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) { setData(function(p){return Object.assign({},p,{[k]:e.target.value});}); }; }
  return (
    <div>
      <Sec title="사업자 정보">
        <G2>
          <Field label="가맹구분" half>
            <select value={data.franchise_type||"가맹"} onChange={s("franchise_type")} style={{width:"100%",fontSize:14,padding:"9px 12px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}>
              {["직영","가맹"].map(function(v){return <option key={v} value={v}>{v}</option>;})}
            </select>
          </Field>
          <Field label="위탁수수료율 (%)" half><Inp value={data.commission_rate||""} onChange={s("commission_rate")} placeholder="예: 15"/></Field>
        </G2>
        <G2>
          <Field label="계약일" half><Inp value={data.contract_date||""} onChange={s("contract_date")} placeholder="YYYY-MM-DD"/></Field>
          <Field label="매장 오픈일" half><Inp value={data.open_date||""} onChange={s("open_date")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <G2>
          <Field label="사업자 개설일" half><Inp value={data.business_open_date||""} onChange={s("business_open_date")} placeholder="YYYY-MM-DD"/></Field>
          <Field label="사업자번호" half><Inp value={data.business_number||""} onChange={s("business_number")} placeholder="000-00-00000"/></Field>
        </G2>
        <G2>
          <Field label="대표자명" half><Inp value={data.representative||""} onChange={s("representative")}/></Field>
          <Field label="점주 연락처" half><Inp value={data.phone||""} onChange={s("phone")} placeholder="010-0000-0000"/></Field>
        </G2>
        <Field label="이메일 (명세서용)"><Inp value={data.email||""} onChange={s("email")}/></Field>
      </Sec>
      <Sec title="계좌 / CMS">
        <G2>
          <Field label="은행명" half><Inp value={data.bank_name||""} onChange={s("bank_name")}/></Field>
          <Field label="계좌번호" half><Inp value={data.account_number||""} onChange={s("account_number")}/></Field>
        </G2>
        <G2>
          <Field label="CMS 관리번호" half><Inp value={data.cms_number||""} onChange={s("cms_number")}/></Field>
          <Field label="출금형태" half>
            <select value={data.withdrawal_type||"정기출금"} onChange={s("withdrawal_type")} style={{width:"100%",fontSize:14,padding:"9px 12px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}>
              {["정기출금","수시출금"].map(function(v){return <option key={v} value={v}>{v}</option>;})}
            </select>
          </Field>
        </G2>
      </Sec>
      <Sec title="운영 상태">
        <G2>
          <Field label="알림톡 사용" half>
            <ChkG options={[{value:"ON",label:"ON"},{value:"OFF",label:"OFF"}]} value={data.notice_channel||"ON"} onChange={function(v){setData(function(p){return Object.assign({},p,{notice_channel:v});});}}/>
          </Field>
          <Field label="매장 운영 상태" half>
            <select value={data.operation_status||"운영중"} onChange={s("operation_status")} style={{width:"100%",fontSize:14,padding:"9px 12px",border:"1.5px solid #d1d5db",borderRadius:8,color:"#111",outline:"none",background:"#fff"}}>
              {["운영중","운영종료","준비중"].map(function(v){return <option key={v} value={v}>{v}</option>;})}
            </select>
          </Field>
        </G2>
      </Sec>
    </div>
  );
}
