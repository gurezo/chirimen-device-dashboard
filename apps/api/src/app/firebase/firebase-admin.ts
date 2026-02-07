import * as admin from 'firebase-admin';

export function getFirestore(): admin.firestore.Firestore {
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }
  return admin.firestore();
}
