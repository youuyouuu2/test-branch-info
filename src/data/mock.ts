import type { ContractData, BusinessData, LeaseData, ConsignmentData, InsuranceData, CmsData, Owner, Shop } from '../types';

export const INIT_OWNERS: Owner[] = [
  { id:"P001", name:"홍길동", phone:"010-1234-5678", email:"hong@example.com", bank_name:"국민은행", account_number:"123456-78-901234", account_holder:"홍길동", cms_number:"CMS-001", memo:"", created_at:"2024-06-01" },
  { id:"P002", name:"김영희", phone:"010-9999-0000", email:"kim@example.com", bank_name:"신한은행", account_number:"987654-32-000001", account_holder:"김영희", cms_number:"CMS-002", memo:"VIP", created_at:"2024-08-15" },
  { id:"P003", name:"서윤아", phone:"010-3333-1111", email:"seo1@example.com", bank_name:"우리은행", account_number:"111111-11-111111", account_holder:"서윤아", cms_number:"CMS-003", memo:"멀티 점주 A", created_at:"2024-09-01" },
  { id:"P004", name:"서윤아", phone:"010-3333-2222", email:"seo2@example.com", bank_name:"하나은행", account_number:"222222-22-222222", account_holder:"서윤아", cms_number:"CMS-004", memo:"동명이인 B", created_at:"2025-01-05" },
];

export const INIT_SHOPS: Shop[] = [
  { id:1, owner_id:"P001", category_id:"1", branch_id:"1", master_number:"0003", branch_number:"03", name:"구디점",  eng_name:"Guro branch",    address_1:"서울 구로구 디지털로32가길 60", state:"1", owner_direct:"0", use_kko_msg:true,  discription:"", slack_channel_code:"", discord_channel_code:"", created_at:"2024-07-20", updated_at:"2026-05-12", card_devices:[] },
  { id:2, owner_id:"P001", category_id:"2", branch_id:"5", master_number:"1005", branch_number:"05", name:"마포점",  eng_name:"Mapo branch",    address_1:"서울 마포구 월드컵북로 50",    state:"1", owner_direct:"0", use_kko_msg:true,  discription:"", slack_channel_code:"", discord_channel_code:"", created_at:"2024-09-01", updated_at:"2026-03-15", card_devices:[] },
  { id:3, owner_id:"P002", category_id:"1", branch_id:"2", master_number:"0004", branch_number:"04", name:"강남점",  eng_name:"Gangnam branch", address_1:"서울 강남구 테헤란로 123",    state:"1", owner_direct:"0", use_kko_msg:true,  discription:"", slack_channel_code:"", discord_channel_code:"", created_at:"2024-08-01", updated_at:"2026-04-01", card_devices:[] },
  { id:4, owner_id:"P003", category_id:"2", branch_id:"2", master_number:"1046", branch_number:"46", name:"홍대점",  eng_name:"Hongdae branch", address_1:"서울 마포구 홍익로 20",      state:"1", owner_direct:"0", use_kko_msg:true,  discription:"", slack_channel_code:"", discord_channel_code:"", created_at:"2025-01-10", updated_at:"2026-01-10", card_devices:[] },
  { id:5, owner_id:"P003", category_id:"2", branch_id:"8", master_number:"1080", branch_number:"80", name:"신촌점",  eng_name:"Sinchon branch", address_1:"서울 서대문구 신촌로 10",    state:"1", owner_direct:"0", use_kko_msg:false, discription:"", slack_channel_code:"", discord_channel_code:"", created_at:"2025-03-01", updated_at:"2026-02-01", card_devices:[] },
  { id:6, owner_id:"P004", category_id:"2", branch_id:"9", master_number:"1090", branch_number:"90", name:"건대점",  eng_name:"Kondae branch",  address_1:"서울 광진구 아차산로 50",    state:"0", owner_direct:"0", use_kko_msg:true,  discription:"", slack_channel_code:"", discord_channel_code:"", created_at:"2025-06-01", updated_at:"2026-06-01", card_devices:[] },
];

export const STATE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  "0": { bg:"#f3f4f6", color:"#6b7280", label:"Yet" },
  "1": { bg:"#dcfce7", color:"#15803d", label:"Open" },
  "2": { bg:"#fee2e2", color:"#b91c1c", label:"Close" },
  "3": { bg:"#fef3c7", color:"#92400e", label:"Pause" },
};

export const SHOP_TABS = [
  {id:"basic",label:"기본정보"},{id:"contract",label:"계약"},{id:"business",label:"사업자"},
  {id:"lease",label:"임대차"},{id:"consignment",label:"위탁계약 갱신"},{id:"insurance",label:"보험"},{id:"cms",label:"CMS / 입금"}
];

export const EMPTY_CONTRACT: ContractData = { contract_status:"계약완료", open_confirmed_date:"", consulting_yn:"no", price_promotion:"", sales_type:"", sales_manager:"", recommender:"", special_note:"", equipment_contract_version:"", equipment_sign_date:"", consignment_contract_version:"", consignment_sign_date:"", owner_name:"", owner_phone:"", owner_email:"", contract_amount:"", intermediate1_amount:"", intermediate2_amount:"", balance_amount:"", consulting_amount:"", equipment_config:{ brand:"", washers:[{size:"20kg",count:0},{size:"30kg",count:0},{size:"40kg",count:0}], dryers:[{id:"2단_25kg",label:"2단 25kg",count:0},{id:"1단_30kg",label:"1단 30kg",count:0},{id:"1단_40kg",label:"1단 40kg",count:0}], vending_type:"" } };
export const EMPTY_BUSINESS: BusinessData = { franchise_type:"가맹", commission_rate:"", contract_date:"", open_date:"", business_open_date:"", business_number:"", representative:"", phone:"", email:"", bank_name:"", account_number:"", cms_number:"", withdrawal_type:"정기출금", notice_channel:"ON", operation_status:"운영중" };
export const EMPTY_LEASE: LeaseData = { contract_date:"", start_date:"", end_date:"", deposit:"", monthly_rent:"", premium:"0", management_fee:"", area_sqm:"", area_pyeong:"", renewal_count:"", renewals:[] };
export const EMPTY_CONSIGNMENT: ConsignmentData = { equipment_ver_1:"", equipment_date_1:"", equipment_ver_2:"", equipment_date_2:"", consignment_ver_1:"", consignment_date_1:"", consignment_ver_2:"", consignment_date_2:"", expire_date_initial:"", next_expire_date:"", renewal_sent_date:"", fire_insurance_yn:"no", email:"", phone:"" };
export const EMPTY_INSURANCE: InsuranceData = { structure:"", purpose:"", area_sqm:"", area_pyeong:"", completed_ym:"", liability_join_date:"", group_insurance_yn:"no", certificate_yn:"no", lease_start:"", premium:"", coverage_amount:"" };
export const EMPTY_CMS: CmsData = { registered:"no", consent_method:"", cms_key:"", bank_name:"", account_holder:"", account_number:"", withdrawal_start_year:"", withdrawal_start_month:"", withdrawal_day:"", withdrawal_amount:"", payments:[] };
