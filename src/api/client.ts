import type { Owner, Shop, OwnerFormData } from '../types';
import { INIT_OWNERS, INIT_SHOPS } from '../data/mock';

const USE_MOCK = true;
const API_BASE = '/api';

let mockOwners: Owner[] = [...INIT_OWNERS];
let mockShops: Shop[] = [...INIT_SHOPS];

export async function getOwners(): Promise<Owner[]> {
  if (USE_MOCK) return [...mockOwners];
  const res = await fetch(`${API_BASE}/owners`);
  if (!res.ok) throw new Error('Failed to fetch owners');
  return res.json();
}

export async function getShops(): Promise<Shop[]> {
  if (USE_MOCK) return [...mockShops];
  const res = await fetch(`${API_BASE}/shops`);
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
  const res = await fetch(`${API_BASE}/owners`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create owner');
  return res.json();
}

export async function createShop(data: Partial<Shop>): Promise<Shop> {
  if (USE_MOCK) {
    const shop = { ...data, id: Date.now() } as Shop;
    mockShops = mockShops.concat([shop]);
    return shop;
  }
  const res = await fetch(`${API_BASE}/shops`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
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
  const res = await fetch(`${API_BASE}/owners/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
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
  const res = await fetch(`${API_BASE}/shops/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update shop');
  return res.json();
}
