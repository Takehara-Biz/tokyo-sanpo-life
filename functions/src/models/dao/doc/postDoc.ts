import { Timestamp } from "firebase-admin/firestore";

/**
 * firestore格納用のPostデータを示す。<br />
 * 紐づくデータを持たない。
 */
export type PostDoc = {
  firestoreDocId?: string;
  postedFirebaseUserId: string;
  photoBase64: string;
  lat: number;
  lng: number;
  /**
   * for easy search.
   * https://firebase.google.com/docs/firestore/solutions/geoqueries?hl=ja#solution_geohashes
   */
  geohash: string;
  categoryId: number;
  description: string;
  insertedAt: Timestamp;
  updatedAt: Timestamp;
}