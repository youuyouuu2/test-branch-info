export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  cms_number: string;
  memo: string;
  created_at: string;
}

export interface CardDevice {
  id: number;
  device_type: string;
  purpose: string;
  cat_id: string;
}

export interface LabelOption {
  id: string;
  label: string;
}

export type OwnerDirect = "0" | "1" | "2";

export interface Shop {
  id: number;
  owner_id: string;
  category_id: string;
  branch_id: string;
  master_number: string;
  branch_number: string;
  name: string;
  eng_name: string;
  address_1: string;
  state: string;
  owner_direct: OwnerDirect;
  use_kko_msg: boolean;
  discription: string;
  slack_channel_code: string;
  discord_channel_code: string;
  created_at: string;
  updated_at: string;
  card_devices: CardDevice[];
  open_date?: string;
  close_date?: string;
  pause_start?: string;
  pause_end?: string;
  postcode?: string;
  address_2?: string;
  lat?: string;
  lng?: string;
  map_url?: string;
  shop_key?: string;
  card_purposes?: LabelOption[];
  card_device_types?: LabelOption[];
  [key: string]: string | number | boolean | CardDevice[] | LabelOption[] | undefined;
}

export interface OwnerFormData {
  name: string;
  phone: string;
  email: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  cms_number: string;
  memo: string;
}

export interface ShopFormData {
  name: string;
  category_id: string;
  address_1: string;
}

export interface NewContractResult {
  ownerType: string;
  ownerId: string;
  ownerForm: OwnerFormData;
  shopForm: ShopFormData;
}

export interface EquipmentConfig {
  brand: string;
  washers: { size: string; count: number }[];
  dryers: { id: string; label: string; count: number }[];
  vending_type: string;
}

export interface ContractData {
  contract_status: string;
  open_confirmed_date: string;
  consulting_yn: string;
  price_promotion: string;
  sales_type: string;
  sales_manager: string;
  recommender: string;
  special_note: string;
  equipment_contract_version: string;
  equipment_sign_date: string;
  consignment_contract_version: string;
  consignment_sign_date: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  contract_amount: string;
  intermediate1_amount: string;
  intermediate2_amount: string;
  balance_amount: string;
  consulting_amount: string;
  equipment_config: EquipmentConfig;
}

export interface BusinessData {
  franchise_type: string;
  commission_rate: string;
  contract_date: string;
  open_date: string;
  business_open_date: string;
  business_number: string;
  representative: string;
  phone: string;
  email: string;
  bank_name: string;
  account_number: string;
  cms_number: string;
  withdrawal_type: string;
  notice_channel: string;
  operation_status: string;
}

export interface LeaseRenewal {
  round: string;
  start: string;
  end: string;
  memo: string;
}

export interface LeaseData {
  contract_date: string;
  start_date: string;
  end_date: string;
  deposit: string;
  monthly_rent: string;
  premium: string;
  management_fee: string;
  area_sqm: string;
  area_pyeong: string;
  renewal_count: string;
  renewals: LeaseRenewal[];
  open_date?: string;
  duration_months?: string;
  memo?: string;
  updated_at?: string;
}

export interface ConsignmentData {
  equipment_ver_1: string;
  equipment_date_1: string;
  equipment_ver_2: string;
  equipment_date_2: string;
  consignment_ver_1: string;
  consignment_date_1: string;
  consignment_ver_2: string;
  consignment_date_2: string;
  expire_date_initial: string;
  next_expire_date: string;
  renewal_sent_date: string;
  fire_insurance_yn: string;
  email: string;
  phone: string;
}

export interface InsuranceData {
  structure: string;
  purpose: string;
  area_sqm: string;
  area_pyeong: string;
  completed_ym: string;
  liability_join_date: string;
  group_insurance_yn: string;
  certificate_yn: string;
  lease_start: string;
  premium: string;
  coverage_amount: string;
}

export interface CmsPayment {
  date: string;
  type: string;
  amount: string;
  note: string;
}

export interface CmsData {
  registered: string;
  consent_method: string;
  cms_key: string;
  bank_name: string;
  account_holder: string;
  account_number: string;
  withdrawal_start_year: string;
  withdrawal_start_month: string;
  withdrawal_day: string;
  withdrawal_amount: string;
  payments: CmsPayment[];
}

export interface ShopAlert {
  id: number;
  level: 'danger' | 'warning';
  title: string;
  desc: string;
  tab: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (opts: {
        oncomplete: (data: { zonecode: string; roadAddress: string; jibunAddress: string }) => void;
      }) => { open: () => void };
    };
  }
}
