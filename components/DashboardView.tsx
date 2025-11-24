
import React, { useState } from 'react';
import { Product, MovementLog } from '../types';
import { TrendingUp, AlertTriangle, PackageCheck, Search, MoreVertical, MapPin, Clock, Filter, Plus } from 'lucide-react';

interface DashboardViewProps {
  products: Product[];
  logs: MovementLog[];
  onAddProduct: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ products, logs, onAddProduct }) => {
  const totalItems = products.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const lowStockCount = products.filter(p => p.quantity <= p.minStockLevel).length;

  // Inventory Table State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.sku.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtext && <p className={`text-xs mt-2 ${colorClass}`}>{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="کل موجودی کالا" 
          value={totalItems.toLocaleString()} 
          subtext="+۱۲٪ نسبت به ماه قبل"
          icon={PackageCheck}
          colorClass="text-jet-600"
          bgClass="bg-jet-50"
        />
        <StatCard 
          title="ارزش کل انبار (تومان)" 
          value={(totalValue / 1000000).toFixed(0) + " م"} 
          subtext="بروزرسانی لحظه‌ای"
          icon={TrendingUp}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard 
          title="هشدار موجودی کم" 
          value={lowStockCount} 
          subtext={lowStockCount > 0 ? "نیاز به شارژ مجدد" : "وضعیت نرمال"}
          icon={AlertTriangle}
          colorClass="text-box-500"
          bgClass="bg-orange-50"
        />
      </div>

      {/* Inventory Section (Moved from InventoryView) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">موجودی من</h3>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجو نام کالا یا شناسه SKU..."
              className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 text-[#353535] rounded-xl focus:outline-none focus:ring-2 focus:ring-jet-500 transition-all placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              className="px-4 py-2 bg-white border border-slate-200 text-[#353535] rounded-xl focus:outline-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">همه دسته‌ها</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <button 
              onClick={onAddProduct}
              className="flex items-center gap-2 bg-jet-500 hover:bg-jet-600 text-white px-5 py-2 rounded-xl transition-colors shadow-lg shadow-jet-200"
            >
              <Plus className="w-5 h-5" />
              <span>افزودن کالا</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#f9f9f9] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">تصویر</th>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">نام محصول / SKU</th>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">وضعیت</th>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">اجازه فروش</th>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">موجودی</th>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">موقعیت</th>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">قیمت (تومان)</th>
                  <th className="px-6 py-4 text-slate-500 font-medium text-sm">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-3">
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-medium text-[#353535]">{product.name}</div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">{product.sku}</div>
                    </td>
                    <td className="px-6 py-3">
                      {product.status === 'APPROVED' ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-100">
                          فعال
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium border border-amber-100 flex items-center w-fit gap-1">
                          <Clock size={12} />
                          در انتظار
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                       {product.isForSale ? (
                         <span className="text-xs font-bold text-jet-600 bg-jet-50 px-2 py-1 rounded">قابل فروش</span>
                       ) : (
                         <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">عدم فروش</span>
                       )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${product.quantity <= product.minStockLevel ? 'text-red-500' : 'text-[#353535]'}`}>
                          {product.quantity}
                        </span>
                        {product.quantity <= product.minStockLevel && product.status === 'APPROVED' && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="موجودی کم" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <MapPin className="w-3 h-3" />
                        {product.location}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[#353535]">
                      {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              موردی یافت نشد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
