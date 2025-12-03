

export type UserRole = 'GUEST' | 'CLIENT' | 'ADMIN' | 'MASTER_ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  shopName?: string;
  branchName?: string;
  isActive: boolean; // Controls if the user can log in
}

export interface NegahbarRequest {
  id: string;
  name: string;
  phone: string;
  password?: string; // Store password to create user upon approval
  age: number;
  gender: 'MALE' | 'FEMALE';
  hasMotor: boolean;
  hasCar: boolean;
  warehouseSize: number; // in meters
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface Branch {
  id: string;
  name: string;
  managerName: string;
  phone: string;
  location: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  location: string; 
  imageUrl: string;
  price: number;
  weight: number; // in Kg
  ownerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  hasPackaging?: boolean;
  isForSale?: boolean; // New field for Store visibility
}

export interface WarehouseRequest {
  id: string;
  userId: string;
  userName: string;
  branch: string;
  items: Product[]; // Proposed items
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string; // New field
  items: { productId: string; quantity: number }[];
  shippingMethodId: string;
  packagingType: 'STANDARD' | 'PREMIUM' | 'ECO';
  totalWeight: number;
  totalCost: number;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  date: string;
  isBulkUpload?: boolean;
}

export interface MovementLog {
  id: string;
  productId: string;
  productName: string;
  type: 'INBOUND' | 'OUTBOUND';
  quantity: number;
  date: string;
  reason?: string;
}

export interface ShippingTariff {
  id: string;
  name: string;
  basePrice: number;
  pricePerKg: number;
  estimatedHours: string;
  description: string;
}

export type ViewState = 
  | 'LANDING'
  | 'AUTH'
  | 'DASHBOARD' // Now contains Inventory
  | 'STORE' // New Store View
  | 'SPACE_REQUEST' // Request warehouse space/add goods
  | 'CREATE_ORDER' // Send to customer
  | 'ADMIN_REQUESTS' // Admin: Approve inbound
  | 'ADMIN_ORDERS' // Admin: Approve outbound
  | 'MASTER_ADMIN_DASHBOARD' // Master Admin: Manage Branches
  | 'AI_ASSISTANT';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  hasAttachment?: boolean;
}