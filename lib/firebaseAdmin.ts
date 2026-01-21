
import * as admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        } as admin.ServiceAccount),
        // databaseURL: "..." // Firestore doesn't always need this if project_id is correct
    });
}

export const adminDb = admin.firestore();
