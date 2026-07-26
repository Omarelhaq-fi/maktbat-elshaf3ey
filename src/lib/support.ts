import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  updateDoc,
  getDoc,
  increment,
  limit,
} from "firebase/firestore";
import { getFirebase } from "./firebase";

export type TicketStatus = "open" | "closed";

export interface Ticket {
  id: string;
  userId: string | null;
  guestToken?: string;
  customerName: string;
  phone?: string;
  subject: string;
  status: TicketStatus;
  lastMessagePreview?: string;
  lastMessageAt?: unknown;
  adminUnread: number;
  userUnread: number;
  createdAt?: unknown;
}

export interface TicketMessage {
  id: string;
  sender: "user" | "admin";
  text: string;
  authorName?: string;
  createdAt?: unknown;
}

const GUEST_KEY = "shafi_support_guest_v1";

interface GuestRecord { id: string; token: string }

export function getGuestTickets(): GuestRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as GuestRecord[]) : [];
  } catch {
    return [];
  }
}

export function addGuestTicket(rec: GuestRecord) {
  const list = getGuestTickets().filter((g) => g.id !== rec.id);
  list.unshift(rec);
  localStorage.setItem(GUEST_KEY, JSON.stringify(list));
}

export function getGuestToken(ticketId: string): string | null {
  return getGuestTickets().find((g) => g.id === ticketId)?.token ?? null;
}

function randomToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function createTicket(input: {
  userId: string | null;
  customerName: string;
  phone?: string;
  subject: string;
  firstMessage: string;
}): Promise<{ id: string; guestToken?: string }> {
  const { db } = await getFirebase();
  const guestToken = input.userId ? undefined : randomToken();
  const ticketData: Record<string, unknown> = {
    userId: input.userId,
    customerName: input.customerName.trim(),
    subject: input.subject.trim() || "استفسار",
    status: "open" as TicketStatus,
    adminUnread: 1,
    userUnread: 0,
    lastMessagePreview: input.firstMessage.slice(0, 80),
    lastMessageAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  };
  if (input.phone?.trim()) ticketData.phone = input.phone.trim();
  if (guestToken) ticketData.guestToken = guestToken;

  const ref = await addDoc(collection(db, "supportTickets"), ticketData);
  await addDoc(collection(db, "supportTickets", ref.id, "messages"), {
    sender: "user",
    text: input.firstMessage.trim(),
    authorName: input.customerName.trim(),
    createdAt: serverTimestamp(),
  });
  if (guestToken) addGuestTicket({ id: ref.id, token: guestToken });
  return { id: ref.id, guestToken };
}

export async function sendMessage(
  ticketId: string,
  sender: "user" | "admin",
  text: string,
  authorName?: string,
) {
  const { db } = await getFirebase();
  const clean = text.trim();
  if (!clean) return;
  await addDoc(collection(db, "supportTickets", ticketId, "messages"), {
    sender,
    text: clean,
    authorName: authorName ?? null,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "supportTickets", ticketId), {
    lastMessagePreview: clean.slice(0, 80),
    lastMessageAt: serverTimestamp(),
    [sender === "user" ? "adminUnread" : "userUnread"]: increment(1),
    status: "open",
  });
}

export async function markRead(ticketId: string, side: "user" | "admin") {
  const { db } = await getFirebase();
  await updateDoc(doc(db, "supportTickets", ticketId), {
    [side === "user" ? "userUnread" : "adminUnread"]: 0,
  });
}

export async function setTicketStatus(ticketId: string, status: TicketStatus) {
  const { db } = await getFirebase();
  await updateDoc(doc(db, "supportTickets", ticketId), { status });
}

export async function getTicket(ticketId: string): Promise<Ticket | null> {
  const { db } = await getFirebase();
  const snap = await getDoc(doc(db, "supportTickets", ticketId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Ticket, "id">) };
}

export async function subscribeTicket(ticketId: string, cb: (t: Ticket | null) => void) {
  const { db } = await getFirebase();
  return onSnapshot(doc(db, "supportTickets", ticketId), (snap) => {
    if (!snap.exists()) cb(null);
    else cb({ id: snap.id, ...(snap.data() as Omit<Ticket, "id">) });
  });
}

export async function subscribeMessages(
  ticketId: string,
  cb: (msgs: TicketMessage[]) => void,
) {
  const { db } = await getFirebase();
  const q = query(
    collection(db, "supportTickets", ticketId, "messages"),
    orderBy("createdAt", "asc"),
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TicketMessage, "id">) })));
  });
}

export async function subscribeMyTickets(userId: string, cb: (items: Ticket[]) => void) {
  const { db } = await getFirebase();
  const q = query(collection(db, "supportTickets"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Ticket, "id">) }));
    items.sort((a, b) => {
      const ta = (a.lastMessageAt as { seconds?: number } | undefined)?.seconds ?? 0;
      const tb = (b.lastMessageAt as { seconds?: number } | undefined)?.seconds ?? 0;
      return tb - ta;
    });
    cb(items);
  });
}

export async function subscribeAllTickets(cb: (items: Ticket[]) => void) {
  const { db } = await getFirebase();
  const q = query(collection(db, "supportTickets"), orderBy("lastMessageAt", "desc"), limit(200));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Ticket, "id">) })));
  });
}
