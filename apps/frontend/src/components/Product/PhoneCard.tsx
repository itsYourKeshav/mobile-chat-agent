import { Phone } from '@repo/shared-types';
import { Battery, Camera, Zap } from 'lucide-react';

interface PhoneCardProps {
  phone: Phone;
}

export const PhoneCard = ({ phone }: PhoneCardProps) => {
  return (
    <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div>
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{phone.brand} {phone.model}</h3>
            <div className="text-sm text-slate-400">{phone.os}</div>
        </div>
        <div className="text-emerald-400 font-mono font-bold">₹{phone.price.toLocaleString()}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mt-3">
        <div className="flex items-center gap-1.5">
            <Camera size={14} className="text-blue-400" />
            <span>{phone.camera_mp}MP {phone.has_ois && '(OIS)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
            <Battery size={14} className="text-green-400" />
            <span>{phone.battery_mah}mAh</span>
        </div>
        <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-yellow-400" />
            <span>{phone.charging_watts}W Charging</span>
        </div>
        <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-500 flex items-center justify-center text-[8px]">R</div>
            <span>{phone.rating} ★</span>
        </div>
      </div>
    </div>
  );
};
