
import React, { useState } from 'react';
import { Product, ShippingTariff, Order } from '../types';
import { SHIPPING_TARIFFS } from '../constants';
import { Package, Truck, User, MapPin, CheckCircle2, Phone, Upload, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';

interface OrderCreationViewProps {
  inventory: Product[];
  onSubmitOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => void;
  userId: string;
}

type OrderMode = 'MANUAL' | 'BULK';

export const OrderCreationView: React.FC<OrderCreationViewProps> = ({ inventory, onSubmitOrder, userId }) => {
  const [mode, setMode] = useState<OrderMode>('MANUAL');
  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<{ id: string; quantity: number }[]>([]);
  
  // Customer Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Shipping & Packaging
  const [shippingMethod, setShippingMethod] = useState<string>('daily');
  const [packaging, setPackaging] = useState<'STANDARD' | 'PREMIUM' | 'ECO'>('STANDARD');

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  const addToOrder = (productId: string, maxQty: number) => {
    const existing = selectedProducts.find(p => p.id === productId);
    if (existing) {
      if (existing.quantity < maxQty) {
        setSelectedProducts(selectedProducts.map(p => p.id === productId ? { ...p, quantity: p.quantity + 1 } : p));
      }
    } else {
      setSelectedProducts([...selectedProducts, { id: productId, quantity: 1 }]);
    }
  };

  const removeFromOrder = (productId: string) => {
    const existing = selectedProducts.find(p => p.id === productId);
    if (existing && existing.quantity > 1) {
      setSelectedProducts(selectedProducts.map(p => p.id === productId ? { ...p, quantity: p.quantity - 1 } : p));
    } else {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    }
  };

  const handleSubmit = () => {
    // Calculate fake cost
    const method = SHIPPING_TARIFFS.find(t => t.id === shippingMethod);
    const baseCost = method?.basePrice || 0;
    
    onSubmitOrder({
      userId,
      customerName: mode === 'BULK' ? 'سفارش انبوه (فایل)' : customerName,
      customerAddress: mode === 'BULK' ? 'موجود در فایل پیوست' : address,
      customerPhone: mode === 'BULK' ? '-' : customerPhone,
      items: selectedProducts.map(p => ({ productId: p.id, quantity: p.quantity })),
      shippingMethodId: shippingMethod,
      packagingType: packaging,
      totalWeight: 2.5, // Mock
      totalCost: baseCost + (mode === 'BULK' ? 100000 : 20000), // Mock
      isBulkUpload: mode === 'BULK'
    });
    setStep(4); // Success view
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBulkFile(e.target.files[0]);
    }
  };

  if (step === 4) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in text-center">
        <div className="w-20 h-20 bg-jet-100 rounded-full flex items-center justify-center mb-6">
          <Truck className="w-10 h-10 text-jet-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#353535] mb-2">سفارش ارسال شد!</h2>
        <p className="text-slate-500 max-w-md">
          {mode === 'BULK' 
            ? 'فایل سفارشات شما دریافت شد. همکاران ما پس از بررسی فایل، سفارش‌ها را پردازش می‌کنند.' 
            : 'سفارش شما برای پردازش به واحد انبارداری ارسال شد. پس از بسته‌بندی و تحویل به ناوگان نگهبار، کد رهگیری صادر می‌شود.'}
        </p>
        <button onClick={() => { setStep(1); setSelectedProducts([]); setBulkFile(null); setCustomerName(''); setCustomerPhone(''); setAddress(''); }} className="mt-8 bg-jet-900 text-white px-6 py-2 rounded-xl">
          ثبت سفارش جدید
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      {/* Mode Selection Tabs */}
      {step === 1 && (
        <div className="flex bg-slate-200 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setMode('MANUAL')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'MANUAL' ? 'bg-white text-jet-600 shadow-sm' : 'text-slate-500 hover:text-jet-600'}`}
          >
            انتخاب دستی محصولات
          </button>
          <button 
            onClick={() => setMode('BULK')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'BULK' ? 'bg-white text-jet-600 shadow-sm' : 'text-slate-500 hover:text-jet-600'}`}
          >
            آپلود فایل سفارش (اکسل/تصویر)
          </button>
        </div>
      )}

      {/* Manual Mode Steps */}
      {mode === 'MANUAL' && (
        <>
          {/* Steps Indicator */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10"></div>
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-jet-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#353535]">۱. انتخاب محصولات</h2>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                {inventory.filter(p => p.quantity > 0).map(product => {
                   const selected = selectedProducts.find(p => p.id === product.id);
                   const qty = selected?.quantity || 0;
                   
                   return (
                     <div key={product.id} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <img src={product.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                          <div>
                            <div className="font-medium text-[#353535]">{product.name}</div>
                            <div className="text-xs text-slate-400">موجودی: {product.quantity}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {qty > 0 && (
                            <>
                              <button onClick={() => removeFromOrder(product.id)} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">-</button>
                              <span className="font-bold w-4 text-center">{qty}</span>
                            </>
                          )}
                          <button onClick={() => addToOrder(product.id, product.quantity)} className="w-8 h-8 bg-jet-50 text-jet-600 rounded-lg flex items-center justify-center hover:bg-jet-100">+</button>
                        </div>
                     </div>
                   );
                })}
              </div>
              <button 
                disabled={selectedProducts.length === 0}
                onClick={() => setStep(2)} 
                className="w-full bg-jet-500 hover:bg-jet-600 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold transition-colors"
              >
                مرحله بعد: اطلاعات مشتری
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#353535]">۲. مشخصات گیرنده</h2>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">نام کامل گیرنده</label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                      <input 
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)} 
                        className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:outline-none focus:ring-2 focus:ring-jet-500" 
                        placeholder="نام مشتری..." 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">شماره تماس</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                      <input 
                        value={customerPhone} 
                        onChange={e => setCustomerPhone(e.target.value)} 
                        className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl focus:outline-none focus:ring-2 focus:ring-jet-500" 
                        placeholder="0912..." 
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">آدرس پستی</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                    <textarea 
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-jet-500" 
                      placeholder="استان، شهر، خیابان، پلاک، واحد..." 
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl">بازگشت</button>
                <button onClick={() => setStep(3)} disabled={!customerName || !address || !customerPhone} className="flex-1 bg-jet-500 hover:bg-jet-600 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold transition-colors">مرحله بعد</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#353535]">۳. نحوه ارسال و بسته‌بندی</h2>
              <div className="space-y-4">
                 <div className="bg-white p-4 rounded-2xl border border-slate-100">
                   <h3 className="font-bold mb-3 text-slate-700">روش ارسال</h3>
                   <div className="space-y-2">
                     {SHIPPING_TARIFFS.map(t => (
                       <label key={t.id} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${shippingMethod === t.id ? 'border-jet-500 bg-jet-50' : 'border-slate-200'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="shipping" checked={shippingMethod === t.id} onChange={() => setShippingMethod(t.id)} />
                            <div>
                              <div className="font-bold text-sm">{t.name}</div>
                              <div className="text-xs text-slate-500">{t.estimatedHours}</div>
                            </div>
                          </div>
                          <div className="font-bold text-jet-600">{t.basePrice.toLocaleString()}</div>
                       </label>
                     ))}
                   </div>
                 </div>

                 <div className="bg-white p-4 rounded-2xl border border-slate-100">
                   <h3 className="font-bold mb-3 text-slate-700">نوع بسته‌بندی</h3>
                   <div className="grid grid-cols-3 gap-2">
                     {['STANDARD', 'PREMIUM', 'ECO'].map(p => (
                       <button 
                        key={p}
                        onClick={() => setPackaging(p as any)}
                        className={`py-2 rounded-lg text-sm font-medium border ${packaging === p ? 'bg-box-500 border-box-500 text-white' : 'border-slate-200 text-slate-600'}`}
                       >
                         {p === 'STANDARD' ? 'استاندارد' : p === 'PREMIUM' ? 'ویژه (هدیه)' : 'اقتصادی'}
                       </button>
                     ))}
                   </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl">بازگشت</button>
                <button onClick={handleSubmit} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200">تایید نهایی و پرداخت</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Bulk Upload Mode */}
      {mode === 'BULK' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4 hover:bg-slate-50 transition-colors">
            <div className="w-16 h-16 bg-jet-50 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-jet-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">آپلود لیست سفارشات</h3>
              <p className="text-slate-500 text-sm mt-1">فایل اکسل (Excel) یا تصویر (Image) لیست سفارشات خود را اینجا رها کنید</p>
            </div>
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv,image/*" 
              className="hidden" 
              id="bulk-upload"
              onChange={handleBulkFileChange}
            />
            <label 
              htmlFor="bulk-upload"
              className="bg-jet-500 hover:bg-jet-600 text-white px-6 py-2 rounded-xl cursor-pointer transition-colors"
            >
              انتخاب فایل
            </label>
            {bulkFile && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-700 rounded-lg mt-4 border border-emerald-100">
                {bulkFile.type.includes('image') ? <ImageIcon size={16} /> : <FileSpreadsheet size={16} />}
                <span className="text-sm font-medium">{bulkFile.name}</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
             <div className="bg-amber-100 p-2 rounded-lg">
               <FileSpreadsheet className="w-5 h-5 text-amber-600" />
             </div>
             <div>
               <h4 className="font-bold text-amber-800 text-sm">نکته مهم</h4>
               <p className="text-amber-700 text-xs mt-1">
                 لطفا اطمینان حاصل کنید فایل شما شامل: نام گیرنده، شماره تماس، آدرس کامل و لیست محصولات باشد.
                 کارشناسان ما پس از بررسی فایل برای تایید نهایی با شما تماس خواهند گرفت.
               </p>
             </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={() => setMode('MANUAL')} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl">انصراف</button>
            <button onClick={handleSubmit} disabled={!bulkFile} className="flex-1 bg-jet-500 hover:bg-jet-600 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold transition-colors">ارسال فایل سفارشات</button>
          </div>
        </div>
      )}
    </div>
  );
};
