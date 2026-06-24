export type Role = "user" | "manager";

export interface UserDoc {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  category: string;
  isBestSeller: boolean;
  discountTag?: string | null;
  stock: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: number;
}

export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number; // 1-5
  message: string;
  isApproved: boolean;
  isFeatured: boolean;
  sheetSynced: boolean;
  createdAt: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  youtube?: string;
  linkedin?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface SiteSettings {
  websiteName: string;
  logoUrl: string;
  heroHeading: string;
  heroSubheading: string;
  aboutText: string;
  faqs: Faq[];
  footerLinks: FooterLink[];
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
}
