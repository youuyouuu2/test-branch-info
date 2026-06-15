import { STATE_BADGE } from '../../data/mock';

export interface StateBadgeProps { state: string; }

export function StateBadge({ state }: StateBadgeProps) {
  var b = STATE_BADGE[state as keyof typeof STATE_BADGE] || STATE_BADGE["0"];
  return <span style={{ fontSize:11, padding:"2px 8px", borderRadius:5, background:b.bg, color:b.color, fontWeight:600 }}>{b.label}</span>;
}
