
import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthViewProps {
  onLogin: (role: UserRole, name: string) => void;
  onBack: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation logic
    onLogin('CLIENT', name || 'کاربر جدید');
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-jet-500">
            {isRegister ? 'عضویت در نگهبار' : 'ورود به پنل کاربری'}
          </h2>
          <p className="text-sm text-slate-400 mt-2">مدیریت لجستیک هوشمند</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">نام و نام خانوادگی</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none placeholder-slate-300"
              placeholder="مثال: علی محمدی"
              required
            />
          </div>
          
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">نام فروشگاه</label>
              <input 
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)} 
                className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none placeholder-slate-300"
                placeholder="مثال: موبایل شاپ"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">شماره موبایل</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none font-mono placeholder-slate-300"
              placeholder="0912..."
              dir="ltr"
              required
            />
          </div>

          <button type="submit" className="w-full bg-jet-500 hover:bg-jet-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-jet-200 mt-6">
            {isRegister ? 'ثبت نام و ورود' : 'ورود'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-slate-500 hover:text-jet-500"
          >
            {isRegister ? 'حساب کاربری دارید؟ ورود' : 'هنوز ثبت نام نکرده‌اید؟ عضویت'}
          </button>
        </div>
        
        <div className="mt-4 text-center pt-4 border-t border-slate-100">
          <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600">
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
};