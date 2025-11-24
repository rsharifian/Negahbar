
import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Search, Tag } from 'lucide-react';

interface StoreViewProps {
  products: Product[];
}

export const StoreView: React.FC<StoreViewProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products: Must be APPROVED and isForSale === true
  const storeProducts = products.filter(p => 
    p.status === 'APPROVED' && 
    p.isForSale &&
    (p.name.includes(searchTerm) || p.category.includes(searchTerm)) &&
    (activeCategory === 'all' || p.category === activeCategory)
  );

  const categories = ['all', ...Array.from(new Set(products.filter(p => p.isForSale).map(p => p.category)))];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-jet-500 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7" />
            فروشگاه
          </h2>
          <p className="text-slate-500 mt-1">محصولات موجود و آماده فروش</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="جستجو در فروشگاه..."
            className="w-full pr-10 pl-4 py-3 bg-white border border-slate-200 text-[#353535] rounded-2xl focus:outline-none focus:ring-2 focus:ring-jet-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-jet-500 text-white shadow-lg shadow-jet-200' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat === 'all' ? 'همه محصولات' : cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {storeProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
           <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
             <Tag size={32} />
           </div>
           <p className="text-slate-500 text-lg">محصولی برای نمایش یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {storeProducts.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-jet-600 shadow-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-[#353535] text-lg leading-tight truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">موجودی: {product.quantity}</span>
                  <span className="font-bold text-jet-600 text-lg">
                    {product.price.toLocaleString()} <span className="text-xs font-normal">تومان</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                 <button className="flex-1 bg-jet-50 text-jet-600 hover:bg-jet-500 hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                   جزئیات
                 </button>
                 <button className="flex-1 bg-jet-500 text-white hover:bg-jet-600 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-jet-200 transition-colors">
                   خرید
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
