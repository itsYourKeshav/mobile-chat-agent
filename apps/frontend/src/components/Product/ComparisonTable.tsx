import { Phone } from '@repo/shared-types';

interface ComparisonTableProps {
  phones: Phone[];
}

export const ComparisonTable = ({ phones }: ComparisonTableProps) => {
  if (phones.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 mt-4 bg-slate-900/50">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="text-xs uppercase bg-slate-800 text-slate-400">
          <tr>
            <th className="px-4 py-3">Feature</th>
            {phones.map(p => (
              <th key={p.id} className="px-4 py-3 min-w-[150px]">{p.brand} {p.model}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          <tr>
            <td className="px-4 py-3 font-medium text-slate-400">Price</td>
            {phones.map(p => (
              <td key={p.id} className="px-4 py-3 text-emerald-400 font-bold">₹{p.price.toLocaleString()}</td>
            ))}
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-slate-400">Camera</td>
            {phones.map(p => (
              <td key={p.id} className="px-4 py-3">{p.camera_mp}MP {p.has_ois ? 'OIS' : ''}</td>
            ))}
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-slate-400">Battery</td>
            {phones.map(p => (
              <td key={p.id} className="px-4 py-3">{p.battery_mah}mAh / {p.charging_watts}W</td>
            ))}
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-slate-400">OS</td>
            {phones.map(p => (
              <td key={p.id} className="px-4 py-3">{p.os}</td>
            ))}
          </tr>
           <tr>
            <td className="px-4 py-3 font-medium text-slate-400">Rating</td>
            {phones.map(p => (
              <td key={p.id} className="px-4 py-3">{p.rating} ★</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
