
import React, { useState } from 'react';
import { User, NegahbarRequest } from '../types';
import { Loader2, AlertCircle, ShieldCheck, Store, Bike, Car, Ruler } from 'lucide-react';

interface AuthViewProps {
  onLoginAttempt: (phone: string, password: string) => Promise<User | null>;
  onRegisterNegahbar: (data: Omit<NegahbarRequest, 'id' | 'status' | 'date'>) => void;
  onRegisterClient: (name: string, phone: string, password: string, shopName: string) => void;
  onBack: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginAttempt, onRegisterNegahbar, onRegisterClient, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  // Registration Type: CLIENT (Shop Owner) or ADMIN (Negahbar/Branch Manager)
  const [registrationType, setRegistrationType] = useState<'CLIENT' | 'ADMIN'>('CLIENT');
  
  // Common Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Client Specific
  const [shopName, setShopName] = useState('');

  // Negahbar Specific
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [hasMotor, setHasMotor] = useState(false);
  const [hasCar, setHasCar] = useState(false);
  const [warehouseSize, setWarehouseSize] = useState<string>('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isRegister) {
        if (registrationType === 'ADMIN') {
          // Negahbar Registration (Requires Approval)
          onRegisterNegahbar({
            name,
            phone,
            password, // Save password for later
            age: parseInt(age),
            gender,
            hasMotor,
            hasCar,
            warehouseSize: parseInt(warehouseSize)
          });
          setSuccessMessage('اطلاعات شما با موفقیت ثبت و به پنل مدیریت ارسال شد. پس از بررسی و تایید توسط مدیریت، می‌توانید با همین شماره و رمز عبور وارد شوید.');
          setLoading(false);
        } else {
          // Client Registration (Instant Access)
          onRegisterClient(name, phone, password, shopName || 'فروشگاه جدید');
        }
      } else {
        // LOGIN LOGIC
        const user = await onLoginAttempt(phone, password);
        if (!user) {
          throw new Error('نام کاربری یا رمز عبور اشتباه است، یا حساب شما هنوز تایید نشده است.');
        }
        // Login successful (handled by parent via state change)
      }

    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'خطا در عملیات');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccessMessage('');
    setPassword('');
    if (!isRegister) setRegistrationType('CLIENT');
  };

  if (successMessage) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#353535] mb-2">ثبت نام موفق</h2>
          <p className="text-slate-500 mb-6">{successMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-jet-500 text-white py-3 rounded-xl font-bold hover:bg-jet-600 transition-colors"
          >
            بازگشت به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-jet-500">
            {isRegister ? 'عضویت در نگهبار' : 'ورود به پنل کاربری'}
          </h2>
          <p className="text-sm text-slate-400 mt-2">سامانه هوشمند مدیریت انبار</p>
        </div>

        {isRegister && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRegistrationType('CLIENT')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${registrationType === 'CLIENT' ? 'bg-white text-jet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Store size={16} />
              درخواست انبار
            </button>
            <button
              type="button"
              onClick={() => setRegistrationType('ADMIN')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${registrationType === 'ADMIN' ? 'bg-white text-jet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ShieldCheck size={16} />
              ثبت نام نگهبار
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* REGISTER FIELDS */}
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نام و نام خانوادگی</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none placeholder-slate-300 transition-all"
                  placeholder="مثال: علی محمدی"
                  required
                />
              </div>

              {/* Client Specific */}
              {registrationType === 'CLIENT' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">نام فروشگاه (اختیاری)</label>
                  <input 
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)} 
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none placeholder-slate-300 transition-all"
                    placeholder="مثال: موبایل شاپ"
                  />
                </div>
              )}

              {/* Negahbar Specific */}
              {registrationType === 'ADMIN' && (
                <div className="space-y-4 animate-fade-in">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">سن</label>
                        <input 
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)} 
                          className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">جنسیت</label>
                        <select 
                          value={gender}
                          onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
                          className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none"
                        >
                          <option value="MALE">آقا</option>
                          <option value="FEMALE">خانم</option>
                        </select>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">فضای انبار (متر مربع)</label>
                      <div className="relative">
                        <Ruler className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                          type="number"
                          value={warehouseSize}
                          onChange={(e) => setWarehouseSize(e.target.value)} 
                          className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none"
                          placeholder="مثال: 50"
                          required
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${hasMotor ? 'bg-jet-50 border-jet-500 text-jet-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                         <input type="checkbox" checked={hasMotor} onChange={(e) => setHasMotor(e.target.checked)} className="hidden" />
                         <Bike className="w-6 h-6 mb-1" />
                         <span className="text-xs font-bold">موتور دارم</span>
                      </label>
                      <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${hasCar ? 'bg-jet-50 border-jet-500 text-jet-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                         <input type="checkbox" checked={hasCar} onChange={(e) => setHasCar(e.target.checked)} className="hidden" />
                         <Car className="w-6 h-6 mb-1" />
                         <span className="text-xs font-bold">ماشین دارم</span>
                      </label>
                   </div>
                </div>
              )}
            </>
          )}

          {/* COMMON FIELDS */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">شماره موبایل</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none font-mono placeholder-slate-300 transition-all"
              placeholder="0912..."
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">رمز عبور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:ring-2 focus:ring-jet-500 outline-none font-mono placeholder-slate-300 transition-all"
              placeholder="********"
              dir="ltr"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-jet-500 hover:bg-jet-600 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-jet-200 mt-6 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin w-5 h-5" />}
            {loading ? 'در حال پردازش...' : (isRegister ? (registrationType === 'ADMIN' ? 'ارسال درخواست نگهبانی' : 'ثبت نام فروشگاه') : 'ورود')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={toggleMode}
            className="text-sm text-slate-500 hover:text-jet-500 transition-colors"
          >
            {isRegister ? 'حساب کاربری دارید؟ ورود' : 'هنوز ثبت نام نکرده‌اید؟ عضویت'}
          </button>
        </div>
        
        <div className="mt-4 text-center pt-4 border-t border-slate-100">
          <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
};