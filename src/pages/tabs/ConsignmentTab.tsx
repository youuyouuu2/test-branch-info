import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { ConsignmentData } from '../../types';
import { Inp } from '../../components/ui/Inp';
import { Field } from '../../components/ui/Field';
import { G2 } from '../../components/ui/G2';
import { Sec } from '../../components/ui/Sec';
import { ChkG } from '../../components/ui/ChkG';

export interface ConsignmentTabProps {
  data: ConsignmentData;
  setData: Dispatch<SetStateAction<ConsignmentData>>;
}

export function ConsignmentTab({ data, setData }: ConsignmentTabProps) {
  function s(k: keyof ConsignmentData) { return function(e: ChangeEvent<HTMLInputElement>) { setData(function(p){return Object.assign({},p,{[k]:e.target.value});}); }; }
  return (
    <div>
      <Sec title="장비계약서">
        <G2>
          <Field label="1차 버전" half><Inp value={data.equipment_ver_1||""} onChange={s("equipment_ver_1")}/></Field>
          <Field label="1차 체결일" half><Inp value={data.equipment_date_1||""} onChange={s("equipment_date_1")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <G2>
          <Field label="2차 버전" half><Inp value={data.equipment_ver_2||""} onChange={s("equipment_ver_2")}/></Field>
          <Field label="2차 체결일" half><Inp value={data.equipment_date_2||""} onChange={s("equipment_date_2")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
      </Sec>
      <Sec title="위탁계약서">
        <G2>
          <Field label="1차 버전" half><Inp value={data.consignment_ver_1||""} onChange={s("consignment_ver_1")}/></Field>
          <Field label="1차 체결일" half><Inp value={data.consignment_date_1||""} onChange={s("consignment_date_1")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <G2>
          <Field label="2차 버전" half><Inp value={data.consignment_ver_2||""} onChange={s("consignment_ver_2")}/></Field>
          <Field label="2차 체결일" half><Inp value={data.consignment_date_2||""} onChange={s("consignment_date_2")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <G2>
          <Field label="최초 계약만료일" half><Inp value={data.expire_date_initial||""} onChange={s("expire_date_initial")} placeholder="YYYY-MM-DD"/></Field>
          <Field label="다음 갱신만료일" half><Inp value={data.next_expire_date||""} onChange={s("next_expire_date")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
        <Field label="갱신계약서 발송일"><Inp value={data.renewal_sent_date||""} onChange={s("renewal_sent_date")} placeholder="미발송이면 공란"/></Field>
        <Field label="화재보험 가입여부">
          <ChkG options={[{value:"yes",label:"가입"},{value:"no",label:"미가입"}]} value={data.fire_insurance_yn||"no"} onChange={function(v){setData(function(p){return Object.assign({},p,{fire_insurance_yn:v});});}}/>
        </Field>
        <G2>
          <Field label="이메일" half><Inp value={data.email||""} onChange={s("email")}/></Field>
          <Field label="연락처" half><Inp value={data.phone||""} onChange={s("phone")}/></Field>
        </G2>
      </Sec>
    </div>
  );
}
