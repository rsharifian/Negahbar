
import { Product, MovementLog, ShippingTariff } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'هدفون بی‌سیم مدل X1',
    sku: 'TECH-HD-001',
    category: 'الکترونیک',
    quantity: 120,
    minStockLevel: 20,
    location: 'A-01',
    imageUrl: 'https://picsum.photos/200/200?random=1',
    price: 850000,
    weight: 0.3,
    ownerId: 'demo_user',
    status: 'APPROVED',
    isForSale: true
  },
  {
    id: '2',
    name: 'کرم مرطوب کننده آلوئه‌ورا',
    sku: 'BEAUTY-CR-055',
    category: 'آرایشی بهداشتی',
    quantity: 45,
    minStockLevel: 50,
    location: 'B-12',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    price: 120000,
    weight: 0.2,
    ownerId: 'demo_user',
    status: 'APPROVED',
    isForSale: true
  },
  {
    id: '3',
    name: 'شلوار جین مردانه راسته',
    sku: 'CLOTH-JN-88',
    category: 'پوشاک',
    quantity: 200,
    minStockLevel: 30,
    location: 'C-05',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    price: 580000,
    weight: 0.6,
    ownerId: 'demo_user',
    status: 'APPROVED',
    isForSale: false
  },
  {
    id: '4',
    name: 'ماگ سرامیکی طرح گربه',
    sku: 'HOME-MG-12',
    category: 'خانه و آشپزخانه',
    quantity: 15,
    minStockLevel: 20,
    location: 'A-03',
    imageUrl: 'https://picsum.photos/200/200?random=4',
    price: 95000,
    weight: 0.4,
    ownerId: 'demo_user',
    status: 'APPROVED',
    isForSale: true
  },
  {
    id: '5',
    name: 'ساعت هوشمند سری ۷',
    sku: 'TECH-SW-007',
    category: 'الکترونیک',
    quantity: 8,
    minStockLevel: 10,
    location: 'S-SAFE',
    imageUrl: 'https://picsum.photos/200/200?random=5',
    price: 4500000,
    weight: 0.1,
    ownerId: 'demo_user',
    status: 'APPROVED',
    isForSale: true
  }
];

export const INITIAL_LOGS: MovementLog[] = [
  { id: '101', productId: '1', productName: 'هدفون بی‌سیم مدل X1', type: 'INBOUND', quantity: 50, date: '1403/02/10', reason: 'خرید جدید' },
  { id: '102', productId: '3', productName: 'شلوار جین مردانه راسته', type: 'OUTBOUND', quantity: 2, date: '1403/02/11', reason: 'سفارش #8842' },
  { id: '103', productId: '2', productName: 'کرم مرطوب کننده آلوئه‌ورا', type: 'OUTBOUND', quantity: 5, date: '1403/02/11', reason: 'سفارش #8843' },
];

export const SHIPPING_TARIFFS: ShippingTariff[] = [
  {
    id: 'instant',
    name: 'ارسال فوری (VIP)',
    basePrice: 150000,
    pricePerKg: 25000,
    estimatedHours: 'کمتر از ۳ ساعت',
    description: 'ارسال با پیک موتوری اختصاصی در محدوده اصفهان'
  },
  {
    id: 'daily',
    name: 'ارسال روزانه',
    basePrice: 65000,
    pricePerKg: 15000,
    estimatedHours: '۲۴ تا ۴۸ ساعت',
    description: 'تحویل سریع در مراکز استان‌ها (پست ویژه)'
  },
  {
    id: 'economic',
    name: 'ارسال اقتصادی',
    basePrice: 35000,
    pricePerKg: 8000,
    estimatedHours: '۴۸ تا ۷۲ ساعت',
    description: 'مقرون به صرفه برای بسته‌های غیرفوری (پست پیشتاز)'
  }
];
