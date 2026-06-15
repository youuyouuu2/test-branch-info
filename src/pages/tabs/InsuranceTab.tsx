import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { InsuranceData } from '../../types';
import { Inp } from '../../components/ui/Inp';
import { Field } from '../../components/ui/Field';
import { G2 } from '../../components/ui/G2';
import { Sec } from '../../components/ui/Sec';
import { ChkG } from '../../components/ui/ChkG';

export interface InsuranceTabProps {
  data: InsuranceData;
  setData: Dispatch<SetStateAction<InsuranceData>>;
}

export function InsuranceTab({ data, setData }: InsuranceTabProps) {
  function s(k: keyof InsuranceData) { return function(e: ChangeEvent<HTMLInputElement>) { setData(function(p){return Object.assign({},p,{[k]:e.target.value});}); }; }
  return (
    <div>
      <Sec title="건물 정보">
        <G2>
          <Field label="구조" half><Inp value={data.structure||""} onChange={s("structure")} placeholder="예: 철근콘크리트"/></Field>
          <Field label="용도" half><Inp value={data.purpose||""} onChange={s("purpose")} placeholder="예: 근린생활시설"/></Field>
        </G2>
        <G2>
          <Field label="면적 (㎡)" half><Inp value={data.area_sqm||""} onChange={s("area_sqm")}/></Field>
          <Field label="면적 (평)" half><Inp value={data.area_pyeong||""} onChange={s("area_pyeong")}/></Field>
        </G2>
        <G2>
          <Field label="준공연월" half><Inp value={data.completed_ym||""} onChange={s("completed_ym")} placeholder="예: 2019-03"/></Field>
          <Field label="임대차 시작일" half><Inp value={data.lease_start||""} onChange={s("lease_start")} placeholder="YYYY-MM-DD"/></Field>
        </G2>
      </Sec>
      <Sec title="보험 가입">
        <Field label="영업배상 가입일"><Inp value={data.liability_join_date||""} onChange={s("liability_join_date")} placeholder="YYYY-MM-DD"/></Field>
        <G2>
          <Field label="단체보험 가입여부" half>
            <ChkG options={[{value:"yes",label:"가입"},{value:"no",label:"미가입"}]} value={data.group_insurance_yn||"no"} onChange={function(v){setData(function(p){return Object.assign({},p,{group_insurance_yn:v});});}}/>
          </Field>
          <Field label="가입증명서 발행여부" half>
            <ChkG options={[{value:"yes",label:"발행"},{value:"no",label:"미발행"}]} value={data.certificate_yn||"no"} onChange={function(v){setData(function(p){return Object.assign({},p,{certificate_yn:v});});}}/>
          </Field>
        </G2>
        <G2>
          <Field label="납입 보험료 (원)" half><Inp value={data.premium||""} onChange={s("premium")}/></Field>
          <Field label="가입 금액 (원)" half><Inp value={data.coverage_amount||""} onChange={s("coverage_amount")}/></Field>
        </G2>
      </Sec>
    </div>
  );
}
