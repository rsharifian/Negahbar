import React, { useState } from 'react';
import { SHIPPING_TARIFFS } from '../constants';
import { Truck, Package, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const ShippingView: React.FC = () => {
  const [weight, setWeight] = useState<number>(1);
  const [destination, setDestination] = useState<string>('tehran');

  const calculateCost = (base: number, perKg: number) => {
    return base + (weight > 1 ? (weight - 1) * perKg : 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-jet-500">محاسبه تعرفه ارسال نگهبار</h2>
        <p className="text-slate-500 mt-2">سریع‌ترین سیستم لجستیک از مبدا درچه اصفهان به سراسر ایران</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">وزن مرسوله (کیلوگرم)</label>
          <div className="relative">
             <Package className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:outline-none focus:ring-2 focus:ring-jet-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">مقصد ارسال</label>
           <div className="relative">
             <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:outline-none focus:ring-2 focus:ring-jet-500"
            >
              <option value="tehran">تهران</option>
              <option value="shiraz">شیراز</option>
              <option value="tabriz">تبریز</option>
              <option value="mashhad">مشهد</option>
              <option value="other">سایر شهرها</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {SHIPPING_TARIFFS.map((tariff) => {
           const finalCost = calculateCost(tariff.basePrice, tariff.pricePerKg);
           const isRecommended = tariff.id === 'jet';

           return (
            <div key={tariff.id} className={`relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${isRecommended ? 'bg-white border-jet-500 ring-2 ring-jet-500/20' : 'bg-white border-slate-200 hover:border-jet-300'}`}>
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-jet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  پیشنهاد ما
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isRecommended ? 'bg-jet-50 text-jet-500' : 'bg-slate-100 text-slate-600'}`}>
                  <Truck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-bold text-[#353535]">{finalCost.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">تومان</span>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 text-[#353535]">{tariff.name}</h3>
              <p className="text-sm text-slate-500 mb-4 h-10">{tariff.description}</p>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h4 text-box-500" />
                  <span>زمان تخمینی: {tariff.estimatedHours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck className="w-4 h4 text-emerald-500" />
                  <span>بیمه سلامت کالا</span>
                </div>
              </div>

              <button className={`w-full mt-6 py-2.5 rounded-xl font-medium transition-colors ${isRecommended ? 'bg-jet-500 text-white hover:bg-jet-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                انتخاب روش
              </button>
            </div>
           );
        })}
      </div>
      
      <div className="bg-gradient-to-r from-jet-900 to-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">خدمات بسته‌بندی نگهبار</h3>
          <p className="text-slate-300 text-sm max-w-lg">
            ما در درچه اصفهان کالاهای شما را با استانداردهای صادراتی بسته‌بندی می‌کنیم. استفاده از کارتن‌های ۵ لایه و ضربه‌گیرهای هوا جهت تضمین سلامت کالا.
          </p>
        </div>
        <button className="bg-box-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-colors whitespace-nowrap">
          درخواست بسته‌بندی ویژه
        </button>
      </div>
    </div>
  );
};