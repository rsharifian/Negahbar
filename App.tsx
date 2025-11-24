
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StoreView } from './components/StoreView'; // New Import
import { InventoryView } from './components/InventoryView'; // Keeping import just in case, but unused in main routing if fully moved
import { AiAssistantView } from './components/AiAssistantView';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { SpaceRequestView } from './components/SpaceRequestView';
import { AdminRequestsView } from './components/AdminRequestsView';
import { OrderCreationView } from './components/OrderCreationView';
import { ViewState, Product, MovementLog, UserRole, User, WarehouseRequest, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_LOGS } from './constants';
import { Menu, Bell } from 'lucide-react';

function App() {
  // -- STATE MANAGEMENT --
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS.map(p => ({...p, ownerId: 'demo_user', status: 'APPROVED', weight: 0.5 })));
  const [logs, setLogs] = useState<MovementLog[]>(INITIAL_LOGS);
  const [requests, setRequests] = useState<WarehouseRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // -- HANDLERS --

  const handleLogin = (role: UserRole, name: string) => {
    const mockUser: User = {
      id: role === 'ADMIN' ? 'admin_1' : 'user_1',
      name: name,
      role: role,
      avatar: `https://picsum.photos/100/100?random=${role}`,
      shopName: role === 'CLIENT' ? 'فروشگاه نمونه' : undefined
    };
    setCurrentUser(mockUser);
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LANDING');
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
    return <LandingPage onStart={() => setCurrentView('AUTH')} onAdminLogin={() => handleLogin('ADMIN', 'مدیر سیستم')} />;
  }

  if (currentView === 'AUTH') {
    return <AuthView onLogin={handleLogin} onBack={() => setCurrentView('LANDING')} />;
  }

  const renderContent = () => {
    // Filter data based on role
    const userProducts = currentUser?.role === 'ADMIN' 
      ? products 
      : products.filter(p => p.ownerId === currentUser?.id || p.ownerId === 'demo_user'); 

    switch (currentView) {
      case 'DASHBOARD':
        return <DashboardView products={userProducts} logs={logs} onAddProduct={() => setCurrentView('SPACE_REQUEST')} />;
      case 'STORE':
        // Store View shows ALL products (Marketplace style) or user products? 
        // Assuming Marketplace: Show all approved products that are for sale
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
              {currentView === 'DASHBOARD' && (currentUser?.role === 'ADMIN' ? 'داشبورد مدیریت کل' : 'داشبورد فروشگاه (موجودی من)')}
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
                {currentUser?.role === 'ADMIN' ? 'مدیر سیستم' : currentUser?.shopName}
              </span>
            </div>
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              {requests.filter(r => r.status === 'PENDING').length > 0 && currentUser?.role === 'ADMIN' && (
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
