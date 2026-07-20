import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  getDoc,
  where,
} from "firebase/firestore";
import { getFirebase } from "./firebase";


export interface Category {
  id: string;
  name: string;
  createdAt?: unknown;
}

export async function subscribeCategories(cb: (items: Category[]) => void) {
  const { db } = await getFirebase();
  const q = query(collection(db, "categories"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) })));
  });
}

export async function createCategory(name: string) {
  const { db } = await getFirebase();
  await addDoc(collection(db, "categories"), { name, createdAt: serverTimestamp() });
}

export async function deleteCategory(id: string) {
  const { db } = await getFirebase();
  await deleteDoc(doc(db, "categories", id));
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  createdAt?: unknown;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  paymentMethod: "cod";
  telegramMessageId?: number;
  createdAt?: unknown;
}


export async function subscribeProducts(cb: (items: Product[]) => void) {
  const { db } = await getFirebase();
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) })));
  });
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">) {
  const { db } = await getFirebase();
  await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id: string, data: Partial<Omit<Product, "id">>) {
  const { db } = await getFirebase();
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string) {
  const { db } = await getFirebase();
  await deleteDoc(doc(db, "products", id));
}

export async function prepareOrderId(): Promise<string> {
  const { db } = await getFirebase();
  return doc(collection(db, "orders")).id;
}

export async function createOrderWithId(
  id: string,
  data: Omit<Order, "id" | "createdAt" | "status">,
) {
  const { db } = await getFirebase();
  const clean: Record<string, unknown> = { ...data };
  Object.keys(clean).forEach((k) => clean[k] === undefined && delete clean[k]);
  await setDoc(doc(db, "orders", id), {
    ...clean,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  const { db } = await getFirebase();
  const snap = await getDoc(doc(db, "orders", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Order, "id">) };
}


export async function subscribeAllOrders(cb: (items: Order[]) => void) {
  const { db } = await getFirebase();
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) })));
  });
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const { db } = await getFirebase();
  await updateDoc(doc(db, "orders", id), { status });
}

export async function getMyOrders(userId: string): Promise<Order[]> {
  const { db } = await getFirebase();
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }))
    .sort((a, b) => {
      const ta = (a.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
      const tb = (b.createdAt as { seconds?: number } | undefined)?.seconds ?? 0;
      return tb - ta;
    });
}
