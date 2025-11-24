
import React from 'react';
import { Package, Truck, ShieldCheck, Zap, ChevronLeft } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onAdminLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onAdminLogin }) => {
  return (
    <div className="min-h-screen bg-[#f2f2f2] font-sans text-[#353535]">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-jet-500 to-box-500 p-2 rounded-lg">
             <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-wider text-jet-500">Negahbar</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onAdminLogin} className="text-sm font-medium text-slate-500 hover:text-jet-600 transition-colors">
            ورود مدیریت
          </button>
          <button onClick={onStart} className="bg-jet-500 hover:bg-jet-600 text-white px-6 py-2 rounded-xl transition-colors shadow-lg shadow-jet-200">
            شروع همکاری
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-right">
          <h1 className="text-4xl md:text-6xl font-black text-[#353535] leading-tight">
            انبار هوشمند شما <br />
            <span className="text-box-500">در قلب اصفهان</span>
          </h1>
          <p className="text-lg text-slate-600 leading-8">
            انبارداری، بسته‌بندی و ارسال سریع محصولات خود را به ما بسپارید. 
            نگهبار بازوی لجستیک آنلاین‌شاپ‌های حرفه‌ای برای ارسال سریع‌تر به سراسر ایران.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <button onClick={onStart} className="flex items-center justify-center gap-2 bg-box-500 hover:bg-[#c99a2e] text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-amber-200">
              درخواست انبار
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-2xl text-lg font-bold text-jet-900 bg-white border border-slate-100 hover:bg-slate-50 transition-colors">
              محاسبه تعرفه
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-jet-50 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Negahbar Warehouse" 
            className="relative z-10 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white"
          />
        </div>
      </header>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#353535] mb-4">چرا نگهبار؟</h2>
            <p className="text-slate-500">مزیت‌های رقابتی ما برای فروشگاه شما</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-jet-50 rounded-2xl flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-jet-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#353535]">ارسال ۲۴ ساعته</h3>
              <p className="text-slate-500 leading-7">
                ارسال مستقیم از هاب درچه به تمام مراکز استان‌ها با سرعتی فراتر از پست معمولی.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#353535]">ضمانت سلامت کالا</h3>
              <p className="text-slate-500 leading-7">
                بسته‌بندی‌های استاندارد و مقاوم با ضربه‌گیرهای بادی برای محافظت ۱۰۰٪ از مرسولات.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-[#f9f9f9] border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-box-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#353535]">پنل هوشمند</h3>
              <p className="text-slate-500 leading-7">
                مدیریت موجودی، ثبت سفارش و رهگیری لحظه‌ای در پنل اختصاصی آنلاین‌شاپ‌ها.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
