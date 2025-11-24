
import React from 'react';
import { WarehouseRequest, Order } from '../types';
import { Check, X, Package, Truck, User } from 'lucide-react';

interface AdminRequestsViewProps {
  requests: WarehouseRequest[];
  orders: Order[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onShipOrder: (id: string) => void;
}

export const AdminRequestsView: React.FC<AdminRequestsViewProps> = ({ 
  requests, 
  orders, 
  onApproveRequest, 
  onRejectRequest,
  onShipOrder
}) => {
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const pendingOrders = orders.filter(o => o.status === 'PROCESSING');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Inbound Requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="text-jet-600" />
          درخواست‌های ورودی انبار (منتظر تایید)
        </h2>
        
        {pendingRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400">
            هیچ درخواست ورودی جدیدی وجود ندارد.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-jet-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-jet-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{req.userName}</h3>
                      <p className="text-sm text-slate-500">شعبه: {req.branch === 'isfahan-central' ? 'مرکزی' : 'شمال'}</p>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">در انتظار بررسی</span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">لیست اقلام:</h4>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                    {req.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.name}</span>
                        <span className="font-mono text-slate-500">{item.quantity} عدد</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => onRejectRequest(req.id)}
                    className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <X size={18} /> رد درخواست
                  </button>
                  <button 
                    onClick={() => onApproveRequest(req.id)}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200"
                  >
                    <Check size={18} /> تایید ورود کالا
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outbound Orders */}
      <div className="space-y-4 pt-8 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Truck className="text-jet-600" />
          سفارش‌های آماده ارسال
        </h2>

        {pendingOrders.length === 0 ? (
           <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400">
            سفارشی برای پردازش موجود نیست.
          </div>
        ) : (
          <div className="grid gap-4">
             {pendingOrders.map(order => (
               <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="font-bold text-slate-800">سفارش #{order.id.slice(-4)}</span>
                     <span className="text-xs bg-jet-100 text-jet-700 px-2 py-0.5 rounded">ارسال {order.shippingMethodId === 'jet' ? 'فوری' : 'عادی'}</span>
                   </div>
                   <p className="text-sm text-slate-500 mb-1">گیرنده: {order.customerName}</p>
                   <p className="text-xs text-slate-400 truncate max-w-md">{order.customerAddress}</p>
                 </div>
                 
                 <div className="text-left pl-4 border-l border-slate-100 hidden md:block">
                   <div className="text-lg font-bold text-slate-800">{order.items.reduce((acc, i) => acc + i.quantity, 0)} قلم</div>
                   <div className="text-xs text-slate-400">بسته‌بندی: {order.packagingType === 'PREMIUM' ? 'ویژه' : 'استاندارد'}</div>
                 </div>

                 <button 
                   onClick={() => onShipOrder(order.id)}
                   className="bg-jet-600 hover:bg-jet-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-jet-200 whitespace-nowrap"
                 >
                   تایید تحویل به پیک
                 </button>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
