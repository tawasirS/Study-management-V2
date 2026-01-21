
import * as admin from "firebase-admin";

<<<<<<< HEAD
import serviceAccount from "../firebase.json";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        // databaseURL: "..." // Firestore doesn't always need this if project_id is correct
=======
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        } as admin.ServiceAccount),
>>>>>>> master
    });
}

export const adminDb = admin.firestore();
