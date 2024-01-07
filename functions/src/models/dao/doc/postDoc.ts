import { Timestamp } from "firebase-admin/firestore";

/**
 * firestore格納用のPostデータを示す。<br />
 * 紐づくデータを持たない。
 */
export type PostDoc = {
  /**
   * before creating, it has no value.
   */
  firestoreDocId?: string;
  postedFirebaseUserId: string;
  /**
   * At first, it has no value.
   */
  photoUrl?: string;
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