import { Timestamp } from "firebase-admin/firestore";

export type CommentDoc = {
  firestoreDocId?: string;
  postFirestoreDocId: string;
  userFirestoreDocId: string;
  comment: string;
  insertedAt: Timestamp;
  updatedAt: Timestamp;
}