
import React, { useState } from 'react';
import { NegahbarRequest, Branch, User } from '../types';
import { ShieldCheck, UserCheck, X, Check, MapPin, Building, Bike, Car, Ruler, Users, Store, Lock, Unlock } from 'lucide-react';

interface MasterAdminViewProps {
  negahbarRequests: NegahbarRequest[];
  branches: Branch[];
  allUsers: { phone: string, data: User }[];
  onApproveNegahbar: (request: NegahbarRequest) => void;
  onRejectNegahbar: (id: string) => void;
  onAddBranch: (branch: Omit<Branch, 'id' | 'isActive'>) => void;
  onToggleUserStatus: (id: string) => void;
}

export const MasterAdminView: React.FC<MasterAdminViewProps> = ({ 
  negahbarRequests, 
  branches,
  allUsers,
  onApproveNegahbar,
  onRejectNegahbar,
  onAddBranch,
  onToggleUserStatus
}) => {
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'BRANCHES' | 'USERS'>('REQUESTS');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchLocation, setNewBranchLocation] = useState('');

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if(newBranchName && newBranchLocation) {
        onAddBranch({
            name: newBranchName,
            location: newBranchLocation,
            managerName: 'تعیین نشده',
            phone: '-'
        });
        setNewBranchName('');
        setNewBranchLocation('');
    }
  };

  const usersList = allUsers.filter(u => u.data.role !== 'MASTER_ADMIN');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800">پنل مدیریت کل (Admin Master)</h2>
          <div className="flex bg-slate-200 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
             <button 
                onClick={() => setActiveTab('REQUESTS')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'REQUESTS' ? 'bg-white text-jet-600 shadow-sm' : 'text-slate-500'}`}
             >
                درخواست‌ها ({negahbarRequests.length})
             </button>
             <button 
                onClick={() => setActiveTab('BRANCHES')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'BRANCHES' ? 'bg-white text-jet-600 shadow-sm' : 'text-slate-500'}`}
             >
                مدیریت شعبه‌ها
             </button>
             <button 
                onClick={() => setActiveTab('USERS')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'USERS' ? 'bg-white text-jet-600 shadow-sm' : 'text-slate-500'}`}
             >
                کاربران و فروشگاه‌ها
             </button>
          </div>
      </div>

      {activeTab === 'REQUESTS' && (
          <div className="grid gap-4">
             {negahbarRequests.length === 0 ? (
                 <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400">
                    هیچ درخواست ثبت نام جدیدی وجود ندارد.
                 </div>
             ) : (
                 negahbarRequests.map(req => (
                     <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-jet-600">{req.name}</h3>
                                <span className="bg-jet-50 text-jet-600 text-xs px-2 py-1 rounded">{req.phone}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mt-4">
                                <div>سن: <span className="font-bold">{req.age}</span></div>
                                <div>جنسیت: <span className="font-bold">{req.gender === 'MALE' ? 'آقا' : 'خانم'}</span></div>
                                <div className="flex items-center gap-1">
                                    <Ruler size={16} />
                                    <span>{req.warehouseSize} متر</span>
                                </div>
                                <div className="flex gap-2">
                                    {req.hasMotor && (
                                      <div title="موتور دارد">
                                        <Bike size={18} className="text-jet-500" />
                                      </div>
                                    )}
                                    {req.hasCar && (
                                      <div title="ماشین دارد">
                                        <Car size={18} className="text-jet-500" />
                                      </div>
                                    )}
                                    {!req.hasMotor && !req.hasCar && <span className="text-slate-400">بدون وسیله</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-2 border-r border-slate-100 pr-0 md:pr-6 mr-0 md:mr-6">
                            <button 
                                onClick={() => onApproveNegahbar(req)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-200"
                            >
                                <UserCheck size={18} />
                                تایید و ایجاد شعبه
                            </button>
                            <button 
                                onClick={() => onRejectNegahbar(req.id)}
                                className="text-red-500 hover:bg-red-50 px-6 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <X size={18} />
                                رد درخواست
                            </button>
                        </div>
                     </div>
                 ))
             )}
          </div>
      )}

      {activeTab === 'BRANCHES' && (
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4">افزودن شعبه جدید</h3>
                  <form onSubmit={handleCreateBranch} className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="نام شعبه (مثال: شعبه شمال تهران)" 
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                            value={newBranchName}
                            onChange={e => setNewBranchName(e.target.value)}
                            required
                          />
                      </div>
                      <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="موقعیت مکانی" 
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                            value={newBranchLocation}
                            onChange={e => setNewBranchLocation(e.target.value)}
                            required
                          />
                      </div>
                      <button type="submit" className="bg-jet-500 text-white px-6 py-2 rounded-xl font-bold">
                          افزودن
                      </button>
                  </form>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                  {branches.map(branch => (
                      <div key={branch.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start justify-between">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <Building className="w-5 h-5 text-jet-500" />
                                  <h4 className="font-bold text-slate-800">{branch.name}</h4>
                              </div>
                              <div className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                                  <MapPin className="w-4 h-4" />
                                  {branch.location}
                              </div>
                              <div className="text-xs bg-slate-100 p-2 rounded-lg inline-block">
                                  مدیر: {branch.managerName}
                              </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${branch.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {branch.isActive ? 'فعال' : 'غیرفعال'}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100">
               <h3 className="font-bold text-slate-800">لیست کاربران سیستم</h3>
               <p className="text-sm text-slate-400 mt-1">مدیریت دسترسی فروشندگان و نگهبارها</p>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-right">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">کاربر</th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">نقش</th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">نام فروشگاه / شعبه</th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">شماره تماس</th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">وضعیت</th>
                    <th className="px-6 py-4 text-sm font-medium text-slate-500">عملیات</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">کاربری یافت نشد</td>
                    </tr>
                  ) : (
                    usersList.map((entry) => {
                      const user = entry.data;
                      return (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                 </div>
                                 <span className="font-medium text-slate-800">{user.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              {user.role === 'ADMIN' ? (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                                   <ShieldCheck size={12} /> نگهبار
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">
                                   <Store size={12} /> فروشنده
                                </span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-sm text-slate-600">
                              {user.role === 'ADMIN' ? user.branchName : user.shopName}
                           </td>
                           <td className="px-6 py-4 font-mono text-sm text-slate-500">
                              {entry.phone}
                           </td>
                           <td className="px-6 py-4">
                              {user.isActive ? (
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">فعال</span>
                              ) : (
                                <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">غیرفعال</span>
                              )}
                           </td>
                           <td className="px-6 py-4">
                              <button 
                                onClick={() => onToggleUserStatus(user.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  user.isActive 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                {user.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                                {user.isActive ? 'مسدودسازی' : 'فعال‌سازی'}
                              </button>
                           </td>
                        </tr>
                      );
                    })
                  )}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};
