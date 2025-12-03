

import React from 'react';
import { ViewState, UserRole } from '../types';
import { LayoutDashboard, Store, Truck, Bot, LogOut, FolderPlus, ClipboardCheck, ListOrdered, Package, Shield, Users } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  role: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, role, onLogout }) => {
  
  const clientNavItems = [
    { id: 'DASHBOARD', label: 'داشبورد (موجودی من)', icon: LayoutDashboard },
    { id: 'STORE', label: 'فروشگاه', icon: Store },
    { id: 'SPACE_REQUEST', label: 'درخواست انبار / کالا', icon: FolderPlus },
    { id: 'CREATE_ORDER', label: 'ارسال سفارش', icon: Truck },
    { id: 'AI_ASSISTANT', label: 'دستیار هوشمند', icon: Bot },
  ];

  const negahbarNavItems = [
    { id: 'DASHBOARD', label: 'داشبورد نگهبار', icon: LayoutDashboard },
    { id: 'ADMIN_REQUESTS', label: 'درخواست‌های انبار', icon: ClipboardCheck },
    { id: 'ADMIN_ORDERS', label: 'مدیریت ارسال‌ها', icon: ListOrdered },
    { id: 'STORE', label: 'نمای فروشگاه', icon: Store },
    { id: 'AI_ASSISTANT', label: 'دستیار هوشمند', icon: Bot },
  ];

  const masterAdminNavItems = [
    { id: 'MASTER_ADMIN_DASHBOARD', label: 'پنل مدیریت کل', icon: Shield },
    { id: 'ADMIN_REQUESTS', label: 'مانیتورینگ درخواست‌ها', icon: Users },
  ];

  let navItems;
  if (role === 'MASTER_ADMIN') navItems = masterAdminNavItems;
  else if (role === 'ADMIN') navItems = negahbarNavItems;
  else navItems = clientNavItems;

  return (
    <aside className={`${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 right-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl`}>
      <div className="p-6 border-b border-slate-700 flex items-center justify-center gap-2">
        <div className="bg-gradient-to-tr from-jet-500 to-box-500 p-2 rounded-lg">
           <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-wider">Negahbar</h1>
          <p className="text-xs text-slate-400">
            {role === 'MASTER_ADMIN' ? 'پنل مدیریت کل' : (role === 'ADMIN' ? 'پنل نگهبار (شعبه)' : 'پنل فروشندگان')}
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-jet-600 text-white shadow-lg shadow-jet-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>خروج از حساب</span>
        </button>
      </div>
    </aside>
  );
};