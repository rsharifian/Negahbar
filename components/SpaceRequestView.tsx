
import React, { useState } from 'react';
import { Product, WarehouseRequest } from '../types';
import { Building2, Plus, Trash2, Upload, CheckCircle2 } from 'lucide-react';

interface SpaceRequestViewProps {
  onSubmit: (request: Omit<WarehouseRequest, 'id' | 'date' | 'status'>) => void;
  currentUser: { id: string; name: string };
}

export const SpaceRequestView: React.FC<SpaceRequestViewProps> = ({ onSubmit, currentUser }) => {
  // Only one branch available now
  const [branch, setBranch] = useState('dorcheh-isfahan');
  const [items, setItems] = useState<Partial<Product>[]>([
    { id: Date.now().toString(), name: '', quantity: 1, price: 0, weight: 0, category: 'عمومی', hasPackaging: true, isForSale: true }
  ]);
  const [submitted, setSubmitted] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, price: 0, weight: 0, category: 'عمومی', hasPackaging: true, isForSale: true }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof Product, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = () => {
    const validItems = items.filter(i => i.name && i.quantity);
    if (validItems.length === 0) return;

    // Generate fake Image URLs for demo
    const enrichedItems = validItems.map((item, idx) => ({
      ...item,
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      minStockLevel: 5,
      location: 'PENDING',
      ownerId: currentUser.id,
      imageUrl: `https://picsum.photos/200/200?random=${Date.now() + idx}`,
      status: 'PENDING'
    })) as Product[];

    onSubmit({
      userId: currentUser.id,
      userName: currentUser.name,
      branch,
      items: enrichedItems
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#353535] mb-2">درخواست شما ثبت شد</h2>
        <p className="text-slate-500 max-w-md">
          درخواست انبار و کالاهای شما برای مدیریت ارسال شد. پس از بررسی و تایید، کالاها به موجودی شما اضافه شده و می‌توانید آنها را ارسال کنید.
        </p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-jet-600 font-medium hover:underline">
          ثبت درخواست جدید
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-[#353535] mb-4 flex items-center gap-2">
          <Building2 className="text-jet-500" />
          شعبه انبار
        </h2>
        <div className="grid md:grid-cols-1 gap-4">
          <label className="p-4 border-2 border-jet-500 bg-jet-50 rounded-xl cursor-pointer transition-all">
            <input type="radio" name="branch" value="dorcheh-isfahan" checked={true} readOnly className="hidden" />
            <div className="font-bold text-[#353535]">شعبه مرکزی درچه / اصفهان</div>
            <div className="text-sm text-slate-500 mt-1">تنها شعبه فعال - ظرفیت نامحدود</div>
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#353535]">لیست کالاهای ورودی</h2>
          <button onClick={handleAddItem} className="flex items-center gap-2 text-sm text-jet-600 bg-jet-50 px-3 py-1.5 rounded-lg hover:bg-jet-100 transition-colors">
            <Plus size={16} />
            افزودن سطر
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-[#f9f9f9] rounded-xl border border-slate-200 relative group">
              <div className="md:col-span-3">
                <label className="block text-xs text-slate-500 mb-1">نام کالا</label>
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={(e) => handleItemChange(item.id!, 'name', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white text-[#353535]" 
                  placeholder="مثال: کفش ورزشی" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">اجازه فروش</label>
                <select
                  value={item.isForSale ? 'true' : 'false'}
                  onChange={(e) => handleItemChange(item.id!, 'isForSale', e.target.value === 'true')}
                  className={`w-full p-2 border rounded-lg text-sm ${item.isForSale ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white text-slate-500'}`}
                >
                  <option value="true">بله، فروش در فروشگاه</option>
                  <option value="false">خیر، فقط انبار</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs text-slate-500 mb-1">تعداد</label>
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => handleItemChange(item.id!, 'quantity', parseInt(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white text-[#353535]" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">قیمت (تومان)</label>
                <input 
                  type="number" 
                  value={item.price} 
                  onChange={(e) => handleItemChange(item.id!, 'price', parseInt(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white text-[#353535]" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">وزن (Kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={item.weight} 
                  onChange={(e) => handleItemChange(item.id!, 'weight', parseFloat(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white text-[#353535]" 
                />
              </div>
              <div className="md:col-span-2 flex items-end gap-2">
                 <button className="flex-1 p-2 bg-white border border-dashed border-slate-300 text-slate-400 rounded-lg hover:text-jet-500 hover:border-jet-500 flex justify-center items-center" title="آپلود تصویر">
                   <Upload size={16} />
                 </button>
                 <button onClick={() => handleRemoveItem(item.id!)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSubmit}
          className="bg-jet-500 hover:bg-jet-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-jet-200 transition-all"
        >
          ارسال درخواست به انبار
        </button>
      </div>
    </div>
  );
};
