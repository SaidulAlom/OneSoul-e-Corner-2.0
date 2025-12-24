
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseAdminConfig } from './config';

let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp(firebaseAdminConfig, 'firebase-admin-app');
} else {
  adminApp = getApps().find(app => app.name === 'firebase-admin-app') || initializeApp(firebaseAdminConfig, 'firebase-admin-app');
}

export const db = getFirestore(adminApp);
