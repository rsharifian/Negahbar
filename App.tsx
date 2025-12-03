import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StoreView } from './components/StoreView'; 
import { InventoryView } from './components/InventoryView';
import { AiAssistantView } from './components/AiAssistantView';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { SpaceRequestView } from './components/SpaceRequestView';
import { AdminRequestsView } from './components/AdminRequestsView';
import { OrderCreationView } from './components/OrderCreationView';
import { MasterAdminView } from './components/MasterAdminView';
import { ViewState, Product, MovementLog, User, WarehouseRequest, Order, NegahbarRequest, Branch } from './types';
import { INITIAL_PRODUCTS, INITIAL_LOGS } from './constants';
import { Menu, Bell } from 'lucide-react';

function App() {
  // -- STATE MANAGEMENT --
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Local User Database (For Demo Purposes)
  // Initialize with Master Admin
  const [registeredUsers, setRegisteredUsers] = useState<{phone: string, password: string, data: User}[]>([
    {
      phone: '09162897941',
      password: 'Reza241310',
      data: {
        id: 'master_admin',
        name: 'مدیریت کل (رضا)',
        role: 'MASTER_ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Master+Admin&background=0D8ABC&color=fff',
        isActive: true
      }
    }
  ]);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS.map(p => ({...p, ownerId: 'demo_user', status: 'APPROVED', weight: 0.5 })));
  const [logs, setLogs] = useState<MovementLog[]>(INITIAL_LOGS);
  const [requests, setRequests] = useState<WarehouseRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Master Admin State
  const [negahbarRequests, setNegahbarRequests] = useState<NegahbarRequest[]>([]);
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', name: 'شعبه مرکزی درچه', managerName: 'سیستم', location: 'اصفهان، درچه', isActive: true, phone: '09130000000' }
  ]);

  // -- HANDLERS --

  // Strict Login Check
  const handleLoginAttempt = async (phone: string, password: string): Promise<User | null> => {
    const found = registeredUsers.find(u => u.phone === phone && u.password === password);
    if (found) {
        if (!found.data.isActive) {
           throw new Error('حساب کاربری شما غیرفعال شده است. لطفا با مدیریت تماس بگیرید.');
        }
        setCurrentUser(found.data);
        if (found.data.role === 'MASTER_ADMIN') {
            setCurrentView('MASTER_ADMIN_DASHBOARD');
        } else {
            setCurrentView('DASHBOARD');
        }
        return found.data;
    }
    return null;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LANDING');
  };

  // Client Registration (Direct Login)
  const handleRegisterClient = (name: string, phone: string, password: string, shopName: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      role: 'CLIENT',
      shopName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      isActive: true
    };

    setRegisteredUsers(prev => [...prev, { phone, password, data: newUser }]);
    setCurrentUser(newUser);
    setCurrentView('DASHBOARD');
  };

  // Negahbar Registration (Pending Approval)
  const handleRegisterNegahbar = (data: Omit<NegahbarRequest, 'id' | 'status' | 'date'>) => {
    const newRequest: NegahbarRequest = {
      ...data,
      id: `req_${Date.now()}`,
      status: 'PENDING',
      date: new Date().toLocaleDateString('fa-IR')
    };
    setNegahbarRequests([newRequest, ...negahbarRequests]);
  };

  // Master Admin Handlers
  const handleApproveNegahbar = (req: NegahbarRequest) => {
    // 1. Create a Branch
    const newBranch: Branch = {
        id: `branch_${Date.now()}`,
        name: `انبار ${req.name}`,
        managerName: req.name,
        location: 'آدرس ثبت نشده', // Could be added to form
        phone: req.phone,
        isActive: true
    };
    setBranches([...branches, newBranch]);

    // 2. Create a User Account for the Negahbar
    if (req.password) {
        const newNegahbarUser: User = {
            id: `negahbar_${Date.now()}`,
            name: req.name,
            role: 'ADMIN', // Negahbar role
            branchName: newBranch.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=random`,
            isActive: true
        };
        setRegisteredUsers(prev => [...prev, { phone: req.phone, password: req.password!, data: newNegahbarUser }]);
    }

    // 3. Remove Request
    setNegahbarRequests(negahbarRequests.filter(r => r.id !== req.id));
  };

  const handleRejectNegahbar = (id: string) => {
     setNegahbarRequests(negahbarRequests.filter(r => r.id !== id));
  };

  const handleAddBranch = (branchData: Omit<Branch, 'id' | 'isActive'>) => {
      setBranches([...branches, { ...branchData, id: `b_${Date.now()}`, isActive: true }]);
  };

  const handleToggleUserStatus = (userId: string) => {
    setRegisteredUsers(prev => prev.map(u => 
        u.data.id === userId 
        ? { ...u, data: { ...u.data, isActive: !u.data.isActive } } 
        : u
    ));
  };


  const handleSubmitRequest = (reqData: Omit<WarehouseRequest, 'id' | 'date' | 'status'>) => {
    const newRequest: WarehouseRequest = {
      ...reqData,
      id: Date.now().toString(),
      status: 'PENDING',
      date: new Date().toLocaleDateString('fa-IR')
    };
    setRequests([newRequest, ...requests]);
  };

  const handleApproveRequest = (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    // Add items to main inventory
    const approvedItems = req.items.map(item => ({
      ...item,
      status: 'APPROVED' as const,
      location: `PENDING-LOC-${Math.floor(Math.random() * 100)}`
    }));

    setProducts([...products, ...approvedItems]);
    
    // Log Inbound
    const newLogs = approvedItems.map(item => ({
      id: `log-${Date.now()}-${Math.random()}`,
      productId: item.id,
      productName: item.name,
      type: 'INBOUND' as const,
      quantity: item.quantity,
      date: new Date().toLocaleDateString('fa-IR'),
      reason: 'تایید درخواست انبار'
    }));
    setLogs([...newLogs, ...logs]);

    // Update request status
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'APPROVED' } : r));
  };

  const handleRejectRequest = (reqId: string) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'REJECTED' } : r));
  };

  const handleSubmitOrder = (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'PROCESSING',
      date: new Date().toLocaleDateString('fa-IR')
    };
    setOrders([newOrder, ...orders]);
  };

  const handleShipOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if(order) {
      // Deduct stock now
      const updatedProducts = [...products];
      const newLogs: MovementLog[] = [];

      order.items.forEach(item => {
        const pIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if(pIndex > -1) {
          updatedProducts[pIndex].quantity -= item.quantity;
          newLogs.push({
            id: `out-${Date.now()}`,
            productId: updatedProducts[pIndex].id,
            productName: updatedProducts[pIndex].name,
            type: 'OUTBOUND',
            quantity: item.quantity,
            date: new Date().toLocaleDateString('fa-IR'),
            reason: `سفارش #${orderId.slice(-4)}`
          });
        }
      });
      
      setProducts(updatedProducts);
      setLogs([...newLogs, ...logs]);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'SHIPPED' } : o));
    }
  };

  // -- RENDER LOGIC --

  if (currentView === 'LANDING') {
    return <LandingPage onStart={() => setCurrentView('AUTH')} />;
  }

  if (currentView === 'AUTH') {
    return (
      <AuthView 
        onLoginAttempt={handleLoginAttempt} 
        onRegisterNegahbar={handleRegisterNegahbar} 
        onRegisterClient={handleRegisterClient}
        onBack={() => setCurrentView('LANDING')} 
      />
    );
  }

  const renderContent = () => {
    // Filter data based on role
    // For DEMO: If user is ADMIN or MASTER_ADMIN, show everything. If CLIENT, show their items.
    const userProducts = (currentUser?.role === 'ADMIN' || currentUser?.role === 'MASTER_ADMIN')
      ? products 
      : products.filter(p => p.ownerId === currentUser?.id || p.ownerId === 'demo_user'); 

    switch (currentView) {
      case 'DASHBOARD':
        return <DashboardView products={userProducts} logs={logs} onAddProduct={() => setCurrentView('SPACE_REQUEST')} />;
      case 'MASTER_ADMIN_DASHBOARD':
        return <MasterAdminView 
            negahbarRequests={negahbarRequests} 
            branches={branches}
            allUsers={registeredUsers}
            onApproveNegahbar={handleApproveNegahbar}
            onRejectNegahbar={handleRejectNegahbar}
            onAddBranch={handleAddBranch}
            onToggleUserStatus={handleToggleUserStatus}
        />;
      case 'STORE':
        return <StoreView products={products} />;
      case 'SPACE_REQUEST':
        return currentUser ? <SpaceRequestView onSubmit={handleSubmitRequest} currentUser={currentUser} /> : null;
      case 'ADMIN_REQUESTS':
        return <AdminRequestsView requests={requests} orders={orders} onApproveRequest={handleApproveRequest} onRejectRequest={handleRejectRequest} onShipOrder={handleShipOrder} />;
      case 'CREATE_ORDER':
        return currentUser ? <OrderCreationView inventory={userProducts} onSubmitOrder={handleSubmitOrder} userId={currentUser.id} /> : null;
      case 'ADMIN_ORDERS':
        return <AdminRequestsView requests={requests} orders={orders} onApproveRequest={handleApproveRequest} onRejectRequest={handleRejectRequest} onShipOrder={handleShipOrder} />;
      case 'AI_ASSISTANT':
        return <AiAssistantView products={userProducts} logs={logs} />;
      default:
        return <DashboardView products={userProducts} logs={logs} onAddProduct={() => setCurrentView('SPACE_REQUEST')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {currentUser && (
        <Sidebar 
          currentView={currentView} 
          onChangeView={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          role={currentUser.role}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden md:block">
              {currentView === 'DASHBOARD' && (currentUser?.role === 'ADMIN' ? 'داشبورد نگهبار (مدیر شعبه)' : 'داشبورد فروشگاه (موجودی من)')}
              {currentView === 'MASTER_ADMIN_DASHBOARD' && 'مدیریت کل سیستم (نگهبار)'}
              {currentView === 'STORE' && 'فروشگاه محصولات'}
              {currentView === 'SPACE_REQUEST' && 'درخواست ورود کالا به انبار'}
              {currentView === 'CREATE_ORDER' && 'ثبت سفارش ارسال'}
              {currentView === 'ADMIN_REQUESTS' && 'مرکز پردازش درخواست‌ها'}
              {currentView === 'AI_ASSISTANT' && 'دستیار هوشمند نگهبار'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700">{currentUser?.name}</span>
              <span className="text-xs text-slate-400">
                {currentUser?.role === 'MASTER_ADMIN' ? 'مدیریت کل' : (currentUser?.role === 'ADMIN' ? 'نگهبار' : currentUser?.shopName)}
              </span>
            </div>
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              {currentUser?.role === 'MASTER_ADMIN' && negahbarRequests.length > 0 && (
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-jet-100 border-2 border-white shadow-sm overflow-hidden">
               <img src={currentUser?.avatar || "https://picsum.photos/100/100"} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;