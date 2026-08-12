import { db, storage } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { getApiUrl } from "./utils";

// Types
export interface NewsItem {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export interface GalleryItem {
  id?: string;
  title: string;
  imageUrl: string;
  date: string;
}

export interface SiteSettings {
  theme?: string;
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

// Upload helper — saves to web hosting server's public/uploads directory
export async function uploadImage(file: File, pathPrefix?: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  if (pathPrefix) {
    formData.append('path', pathPrefix);
  }

  const res = await fetch(getApiUrl('/api/upload'), {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.url;
}

// Settings (Theme & Banner)
export async function getSettings(): Promise<SiteSettings | null> {
  const docRef = doc(db, "settings", "general");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as SiteSettings;
  }
  return null;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, "settings", "general");
  await setDoc(docRef, settings, { merge: true });
}

// News Services
export async function getNews(): Promise<NewsItem[]> {
  const newsRef = collection(db, "news");
  const q = query(newsRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
}

export async function addNews(news: Omit<NewsItem, 'id'>, imageFile?: File): Promise<string> {
  let imageUrl = news.imageUrl;
  if (imageFile) {
    imageUrl = await uploadImage(imageFile, "news");
  }
  const docRef = await addDoc(collection(db, "news"), { ...news, imageUrl });
  return docRef.id;
}

export async function updateNews(id: string, news: Partial<NewsItem>, imageFile?: File): Promise<void> {
  let imageUrl = news.imageUrl;
  if (imageFile) {
    imageUrl = await uploadImage(imageFile, "news");
  }
  const updateData = imageUrl ? { ...news, imageUrl } : news;
  const docRef = doc(db, "news", id);
  await updateDoc(docRef, updateData);
}

export async function deleteNews(id: string, imageUrl?: string): Promise<void> {
  if (imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (e) {
      console.error("Failed to delete image", e);
    }
  }
  await deleteDoc(doc(db, "news", id));
}

// Gallery Services
export async function getGallery(): Promise<GalleryItem[]> {
  const galleryRef = collection(db, "gallery");
  const q = query(galleryRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id' | 'imageUrl'>, imageFile: File): Promise<string> {
  const imageUrl = await uploadImage(imageFile, "gallery");
  const docRef = await addDoc(collection(db, "gallery"), { ...item, imageUrl });
  return docRef.id;
}

export async function deleteGalleryItem(id: string, imageUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (e) {
    console.error("Failed to delete gallery image", e);
  }
  await deleteDoc(doc(db, "gallery", id));
}
