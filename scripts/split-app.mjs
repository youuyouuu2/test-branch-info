import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(__dirname, '../../integrated_app.tsx');
const src = fs.readFileSync(srcPath, 'utf8');
const lines = src.split('\n');

function extract(startLine, endLine) {
  return lines.slice(startLine - 1, endLine).join('\n');
}

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('wrote', rel);
}

// types.ts
write('src/types.ts', `export interface Owner {
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
  owner_direct: string;
  use_kko_msg: boolean;
  discription: string;
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
`);

// mock.ts
write('src/data/mock.ts', `import type { Owner, Shop, ContractData, BusinessData, LeaseData, ConsignmentData, InsuranceData, CmsData } from '../types';

${extract(6, 27)}

${extract(13, 20).replace('const INIT_SHOPS', 'export const INIT_SHOPS')}

export const STATE_BADGE: Record<string, { bg: string; color: string; label: string }> = ${extract(22, 27).replace('const STATE_BADGE = ', '')};

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
`.replace('const INIT_OWNERS', 'export const INIT_OWNERS'));

// AppCtx
write('src/context/AppCtx.ts', `import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Owner, Shop } from '../types';

export interface AppCtxValue {
  owners: Owner[];
  setOwners: Dispatch<SetStateAction<Owner[]>>;
  shops: Shop[];
  setShops: Dispatch<SetStateAction<Shop[]>>;
  navigate: (to: string, id: number | string | null) => void;
  showToast: (msg: string) => void;
}

export const AppCtx = createContext<AppCtxValue | null>(null);

export function useApp(): AppCtxValue {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppCtx.Provider');
  return ctx;
}
`);

// UI components
const uiFiles = [
  ['Inp.tsx', 30, 40, `import type { ChangeEventHandler } from 'react';

export interface InpProps {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
}
`, 'export function Inp'],
  ['Field.tsx', 42, 50, `import type { ReactNode } from 'react';

export interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
  half?: boolean;
}
`, 'export function Field'],
  ['G2.tsx', 52, 54, `import type { ReactNode } from 'react';

export interface G2Props { children: ReactNode; }
`, 'export function G2'],
  ['Sec.tsx', 56, 63, `import type { ReactNode } from 'react';

export interface SecProps { title: string; children: ReactNode; }
`, 'export function Sec'],
  ['ChkG.tsx', 65, 79, `export interface ChkGOption { value: string; label: string; }

export interface ChkGProps {
  options: ChkGOption[];
  value: string;
  onChange: (value: string) => void;
}
`, 'export function ChkG'],
  ['Tog.tsx', 81, 95, `export interface TogProps {
  value: boolean;
  onChange: (value: boolean) => void;
}
`, 'export function Tog'],
  ['StateBadge.tsx', 97, 100, `import { STATE_BADGE } from '../../data/mock';

export interface StateBadgeProps { state: string; }
`, 'export function StateBadge'],
];

for (const [name, start, end, header, fnReplace] of uiFiles) {
  let body = extract(start, end);
  body = body.replace(/^function (\w+)/, fnReplace);
  if (name === 'StateBadge.tsx') {
    body = body.replace('var b = STATE_BADGE[state]', 'var b = STATE_BADGE[state as keyof typeof STATE_BADGE]');
  }
  write(`src/components/ui/${name}`, header + '\n' + body + '\n');
}

// modals
let newContract = extract(103, 281);
newContract = newContract.replace(/^function NewContractModal/, 'export function NewContractModal');
write('src/modals/NewContractModal.tsx', `import { useState } from 'react';
import type { Owner, OwnerFormData, ShopFormData, NewContractResult } from '../types';
import { Inp } from '../components/ui/Inp';
import { Field } from '../components/ui/Field';

export interface NewContractModalProps {
  owners: Owner[];
  onClose: () => void;
  onComplete: (result: NewContractResult) => void;
}

` + newContract + '\n');

let ownerModal = extract(284, 326);
ownerModal = ownerModal.replace(/^function OwnerFormModal/, 'export function OwnerFormModal');
write('src/modals/OwnerModal.tsx', `import { useState } from 'react';
import type { Owner, OwnerFormData } from '../types';
import { Inp } from '../components/ui/Inp';
import { Field } from '../components/ui/Field';

export interface OwnerFormModalProps {
  initial: Owner | null;
  onSave: (form: OwnerFormData) => void;
  onClose: () => void;
}

` + ownerModal + '\n');

// ContractTab with AmountTable + EquipmentBuilder
let amountTable = extract(502, 545);
amountTable = amountTable.replace(/^function AmountTable/, 'function AmountTable');
let equipmentBuilder = extract(548, 615);
let contractTab = extract(618, 675);
contractTab = contractTab.replace(/^function ContractTab/, 'export function ContractTab');

write('src/pages/tabs/ContractTab.tsx', `import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
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

${amountTable}

${equipmentBuilder}

${contractTab}
`);

const tabFiles = [
  ['BusinessTab.tsx', 677, 732, 'BusinessData'],
  ['LeaseTab.tsx', 734, 837, 'LeaseData'],
  ['ConsignmentTab.tsx', 839, 877, 'ConsignmentData'],
  ['InsuranceTab.tsx', 879, 914, 'InsuranceData'],
  ['CMSTab.tsx', 916, 979, 'CmsData'],
];

for (const [name, start, end, typeName] of tabFiles) {
  let body = extract(start, end);
  body = body.replace(/^function (\w+)/, 'export function $1');
  write(`src/pages/tabs/${name}`, `import type { Dispatch, SetStateAction } from 'react';
import type { ${typeName} } from '../../types';
import { Inp } from '../../components/ui/Inp';
import { Field } from '../../components/ui/Field';
import { G2 } from '../../components/ui/G2';
import { Sec } from '../../components/ui/Sec';
import { ChkG } from '../../components/ui/ChkG';

export interface ${name.replace('.tsx', '')}Props {
  data: ${typeName};
  setData: Dispatch<SetStateAction<${typeName}>>;
}

` + body + '\n');
}

// OwnerMasterPage
let ownerPage = extract(329, 486);
ownerPage = ownerPage.replace(/^function OwnerMasterPage/, 'export function OwnerMasterPage');
write('src/pages/OwnerMasterPage.tsx', `import { useState } from 'react';
import type { Owner, OwnerFormData, NewContractResult } from '../types';
import { useApp } from '../context/AppCtx';
import { StateBadge } from '../components/ui/StateBadge';
import { OwnerFormModal } from '../modals/OwnerModal';
import { NewContractModal } from '../modals/NewContractModal';

` + ownerPage + '\n');

// ShopInfoPage
let shopPage = extract(981, 1420);
shopPage = shopPage.replace(/^function ShopInfoPage/, 'export function ShopInfoPage');
write('src/pages/ShopInfoPage.tsx', `import { useState } from 'react';
import type { Shop, ShopAlert, ContractData, BusinessData, LeaseData, ConsignmentData, InsuranceData, CmsData } from '../types';
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

` + shopPage + '\n');

// api/client.ts
write('src/api/client.ts', `import type { Owner, Shop, OwnerFormData } from '../types';
import { INIT_OWNERS, INIT_SHOPS } from '../data/mock';

const USE_MOCK = true;
const API_BASE = '/api';

let mockOwners = [...INIT_OWNERS];
let mockShops = [...INIT_SHOPS];

export async function getOwners(): Promise<Owner[]> {
  if (USE_MOCK) return [...mockOwners];
  const res = await fetch(\`\${API_BASE}/owners\`);
  if (!res.ok) throw new Error('Failed to fetch owners');
  return res.json();
}

export async function getShops(): Promise<Shop[]> {
  if (USE_MOCK) return [...mockShops];
  const res = await fetch(\`\${API_BASE}/shops\`);
  if (!res.ok) throw new Error('Failed to fetch shops');
  return res.json();
}

export async function createOwner(data: OwnerFormData): Promise<Owner> {
  if (USE_MOCK) {
    const nextNum = String(mockOwners.length + 1).padStart(3, '0');
    const owner: Owner = { ...data, id: 'P' + nextNum, created_at: new Date().toISOString().slice(0, 10) };
    mockOwners = mockOwners.concat([owner]);
    return owner;
  }
  const res = await fetch(\`\${API_BASE}/owners\`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create owner');
  return res.json();
}

export async function createShop(data: Partial<Shop>): Promise<Shop> {
  if (USE_MOCK) {
    const shop = { ...data, id: Date.now() } as Shop;
    mockShops = mockShops.concat([shop]);
    return shop;
  }
  const res = await fetch(\`\${API_BASE}/shops\`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create shop');
  return res.json();
}

export async function updateOwner(id: string, data: Partial<OwnerFormData>): Promise<Owner> {
  if (USE_MOCK) {
    mockOwners = mockOwners.map((o) => (o.id === id ? { ...o, ...data } : o));
    const updated = mockOwners.find((o) => o.id === id);
    if (!updated) throw new Error('Owner not found');
    return updated;
  }
  const res = await fetch(\`\${API_BASE}/owners/\${id}\`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update owner');
  return res.json();
}

export async function updateShop(id: number, data: Partial<Shop>): Promise<Shop> {
  if (USE_MOCK) {
    mockShops = mockShops.map((s) => (s.id === id ? { ...s, ...data } : s));
    const updated = mockShops.find((s) => s.id === id);
    if (!updated) throw new Error('Shop not found');
    return updated;
  }
  const res = await fetch(\`\${API_BASE}/shops/\${id}\`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update shop');
  return res.json();
}
`);

// App.tsx
write('src/App.tsx', `import { useState } from 'react';
import type { Owner, Shop } from './types';
import { INIT_OWNERS, INIT_SHOPS } from './data/mock';
import { AppCtx } from './context/AppCtx';
import { OwnerMasterPage } from './pages/OwnerMasterPage';
import { ShopInfoPage } from './pages/ShopInfoPage';

export default function App() {
  const [page, setPage] = useState("shops");
  const [targetOwnerId, setTargetOwnerId] = useState<string | null>(null);
  const [targetShopId, setTargetShopId] = useState<number | null>(null);
  const [owners, setOwners] = useState<Owner[]>(INIT_OWNERS);
  const [shops, setShops] = useState<Shop[]>(INIT_SHOPS);
  const [toast, setToast] = useState("");

  function showToast(msg: string) { setToast(msg); setTimeout(function() { setToast(""); }, 2500); }

  function navigate(to: string, id: number | string | null) {
    if (to === "owners") { setTargetOwnerId(id as string); setPage("owners"); }
    else { setTargetShopId(id as number); setPage("shops"); }
  }

  var ctxValue = { owners: owners, setOwners: setOwners, shops: shops, setShops: setShops, navigate: navigate, showToast: showToast };

  return (
    <AppCtx.Provider value={ctxValue}>
      <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:"#f3f4f6", height:"100vh", display:"flex", flexDirection:"column" }}>
        {toast && (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#111", color:"#fff", fontSize:13, padding:"10px 20px", borderRadius:10, zIndex:999, fontWeight:500, whiteSpace:"nowrap" }}>
            {toast}
          </div>
        )}
        <div style={{ background:"#fff", borderBottom:"1.5px solid #e5e7eb", padding:"0 20px", display:"flex", alignItems:"center", gap:0, flexShrink:0, height:52 }}>
          <p style={{ fontSize:14, fontWeight:700, color:"#111", margin:"0 24px 0 0", whiteSpace:"nowrap" }}>🏠 런드리익스프레스</p>
          {[{id:"shops",label:"매장 정보 관리"},{id:"owners",label:"점주 마스터"}].map(function(n) {
            return (
              <button key={n.id} onClick={function() { setPage(n.id); }}
                style={{ fontSize:13, padding:"0 16px", height:"100%", border:"none", borderBottom:"2.5px solid " + (page === n.id ? "#111" : "transparent"), background:"transparent", color: page === n.id ? "#111" : "#6b7280", cursor:"pointer", fontWeight: page === n.id ? 700 : 400, whiteSpace:"nowrap" }}>
                {n.label}
              </button>
            );
          })}
        </div>
        <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
          {page === "owners" && <OwnerMasterPage key={targetOwnerId ?? undefined} />}
          {page === "shops" && <ShopInfoPage key={targetShopId ?? undefined} initShopId={targetShopId} />}
        </div>
      </div>
    </AppCtx.Provider>
  );
}
`);

console.log('Done.');
