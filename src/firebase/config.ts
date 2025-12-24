export const firebaseConfig = {
  "projectId": "studio-9860963928-c712e",
  "appId": "1:799860295064:web:173cb6cc35526a41e897ed",
  "apiKey": "AIzaSyCGclNLB1QnYzNROpsZbW88cIQTMiw03D0",
  "authDomain": "studio-9860963928-c712e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "799860295064"
};

export const firebaseAdminConfig = {
    projectId: firebaseConfig.projectId,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};