
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Snacks' | 'Main Course' | 'Beverages' | 'Desserts';
  isVeg: boolean;
  image: string;
}

export interface Canteen {
  id: string;
  name: string;
  description: string;
  image: string;
  menu: MenuItem[];
}

export interface CartItem {
  itemId: string;
  canteenId: string;
  name: string;
  price: number;
  quantity: number;
  canteenName: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Order Placed' | 'Preparing' | 'Ready' | 'Completed';
  canteenNames: string[];
  userInfo: {
    name: string;
    collegeId: string;
    phone: string;
    pickupLocation: string;
    paymentMethod: string;
    notes?: string;
  };
}
