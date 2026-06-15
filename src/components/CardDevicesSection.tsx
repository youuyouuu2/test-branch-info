import { useState } from 'react';
import type { Shop, CardDevice } from '../types';
import { Inp } from './ui/Inp';

export interface CardDevicesSectionProps {
  shop: Shop;
  onUpdate: (shop: Shop) => void;
}

export function CardDevicesSection({ shop, onUpdate }: CardDevicesSectionProps) {
  var devices = shop.card_devices || [];
  var purposes = shop.card_purposes || [{ id: "washer", label: "세탁기" }, { id: "dryer", label: "건조기" }, { id: "vending", label: "자판기" }, { id: "all", label: "통합" }];
  var deviceTypes = shop.card_device_types || [{ id: "1", label: "스마트로" }, { id: "2", label: "나이스" }, { id: "4", label: "KSNET" }, { id: "5", label: "KIS" }];
  const [showPopup, setShowPopup] = useState(false);
  const [showDevicePopup, setShowDevicePopup] = useState(false);
  const [newPurpose, setNewPurpose] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");

  function setSel(patch: Partial<Shop>) {
    onUpdate(Object.assign({}, shop, patch));
  }

  function updateDevice(i: number, k: keyof CardDevice, v: string) {
    setSel({ card_devices: devices.map(function (x, j) { return j === i ? Object.assign({}, x, { [k]: v }) : x; }) });
  }
  function removeDevice(i: number) {
    setSel({ card_devices: devices.filter(function (_, j) { return j !== i; }) });
  }
  function addDevice() {
    setSel({ card_devices: devices.concat([{ id: Date.now(), device_type: deviceTypes[0] && deviceTypes[0].id || "1", purpose: purposes[0] && purposes[0].id || "", cat_id: "" }]) });
  }
  function addPurpose() {
    if (!newPurpose.trim()) return;
    setSel({ card_purposes: purposes.concat([{ id: "custom_" + Date.now(), label: newPurpose.trim() }]) });
    setNewPurpose("");
  }
  function removePurpose(id: string) {
    setSel({ card_purposes: purposes.filter(function (p) { return p.id !== id; }) });
  }
  function updatePurposeLabel(id: string, val: string) {
    setSel({ card_purposes: purposes.map(function (p) { return p.id === id ? Object.assign({}, p, { label: val }) : p; }) });
  }
  function addDeviceType() {
    if (!newDeviceType.trim()) return;
    setSel({ card_device_types: deviceTypes.concat([{ id: "custom_" + Date.now(), label: newDeviceType.trim() }]) });
    setNewDeviceType("");
  }
  function removeDeviceType(id: string) {
    setSel({ card_device_types: deviceTypes.filter(function (t) { return t.id !== id; }) });
  }
  function updateDeviceTypeLabel(id: string, val: string) {
    setSel({ card_device_types: deviceTypes.map(function (t) { return t.id === id ? Object.assign({}, t, { label: val }) : t; }) });
  }

  return (
    <div>
      {showPopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "24px", width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: 0 }}>결제 대상 목록 관리</p>
              <button onClick={function () { setShowPopup(false); }} style={{ background: "none", border: "none", fontSize: 20, color: "#9ca3af", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              {purposes.map(function (p) {
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input value={p.label} onChange={function (e) { updatePurposeLabel(p.id, e.target.value); }}
                      style={{ flex: 1, fontSize: 13, padding: "7px 10px", border: "1.5px solid #d1d5db", borderRadius: 7, color: "#111", outline: "none" }} />
                    <button onClick={function () { removePurpose(p.id); }} style={{ fontSize: 12, padding: "6px 10px", border: "1.5px solid #fca5a5", borderRadius: 7, background: "#fff", color: "#ef4444", cursor: "pointer", flexShrink: 0 }}>삭제</button>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={newPurpose} onChange={function (e) { setNewPurpose(e.target.value); }} placeholder="새 항목 입력"
                onKeyDown={function (e) { if (e.key === "Enter") addPurpose(); }}
                style={{ flex: 1, fontSize: 13, padding: "7px 10px", border: "1.5px solid #d1d5db", borderRadius: 7, color: "#111", outline: "none" }} />
              <button onClick={addPurpose} style={{ fontSize: 13, padding: "7px 14px", border: "none", borderRadius: 7, background: "#111", color: "#fff", cursor: "pointer", fontWeight: 600 }}>추가</button>
            </div>
          </div>
        </div>
      )}

      {showDevicePopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "24px", width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: 0 }}>단말기 타입 목록 관리</p>
              <button onClick={function () { setShowDevicePopup(false); }} style={{ background: "none", border: "none", fontSize: 20, color: "#9ca3af", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              {deviceTypes.map(function (t) {
                return (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input value={t.label} onChange={function (e) { updateDeviceTypeLabel(t.id, e.target.value); }}
                      style={{ flex: 1, fontSize: 13, padding: "7px 10px", border: "1.5px solid #d1d5db", borderRadius: 7, color: "#111", outline: "none" }} />
                    <button onClick={function () { removeDeviceType(t.id); }} style={{ fontSize: 12, padding: "6px 10px", border: "1.5px solid #fca5a5", borderRadius: 7, background: "#fff", color: "#ef4444", cursor: "pointer", flexShrink: 0 }}>삭제</button>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={newDeviceType} onChange={function (e) { setNewDeviceType(e.target.value); }} placeholder="새 단말기 타입 입력"
                onKeyDown={function (e) { if (e.key === "Enter") addDeviceType(); }}
                style={{ flex: 1, fontSize: 13, padding: "7px 10px", border: "1.5px solid #d1d5db", borderRadius: 7, color: "#111", outline: "none" }} />
              <button onClick={addDeviceType} style={{ fontSize: 13, padding: "7px 14px", border: "none", borderRadius: 7, background: "#111", color: "#fff", cursor: "pointer", fontWeight: 600 }}>추가</button>
            </div>
          </div>
        </div>
      )}
      {devices.map(function (d, i) {
        return (
          <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0 10px", alignItems: "end", marginBottom: 10 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>단말기 타입</label>
                <button onClick={function () { setShowDevicePopup(true); }} title="단말기 타입 목록 수정"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "#9ca3af", fontSize: 14 }}>⚙</button>
              </div>
              <select value={d.device_type || ""} onChange={function (e) { updateDevice(i, "device_type", e.target.value); }}
                style={{ width: "100%", fontSize: 14, padding: "9px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, color: "#111", outline: "none", background: "#fff" }}>
                {deviceTypes.map(function (t) { return <option key={t.id} value={t.id}>{t.label}</option>; })}
              </select>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>결제 대상</label>
                <button onClick={function () { setShowPopup(true); }} title="결제 대상 목록 수정"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "#9ca3af", fontSize: 14 }}>⚙</button>
              </div>
              <select value={d.purpose || ""} onChange={function (e) { updateDevice(i, "purpose", e.target.value); }}
                style={{ width: "100%", fontSize: 14, padding: "9px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, color: "#111", outline: "none", background: "#fff" }}>
                {purposes.map(function (p) { return <option key={p.id} value={p.id}>{p.label}</option>; })}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>CAT ID</label>
              <Inp value={d.cat_id || ""} onChange={function (e) { updateDevice(i, "cat_id", e.target.value); }} placeholder="예: 3295656001" />
            </div>
            <button onClick={function () { removeDevice(i); }}
              style={{ fontSize: 12, padding: "9px 12px", border: "1.5px solid #fca5a5", borderRadius: 8, background: "#fff", color: "#ef4444", cursor: "pointer", marginBottom: 1 }}>삭제</button>
          </div>
        );
      })}
      <button onClick={addDevice}
        style={{ fontSize: 13, padding: "8px 16px", border: "1.5px dashed #d1d5db", borderRadius: 8, background: "#fff", color: "#6b7280", cursor: "pointer", width: "100%" }}>+ 단말기 추가</button>
    </div>
  );
}
