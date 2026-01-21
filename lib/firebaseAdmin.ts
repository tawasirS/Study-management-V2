
import * as admin from "firebase-admin";

import serviceAccount from "../firebase.json";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        // databaseURL: "..." // Firestore doesn't always need this if project_id is correct
    });
}

export const adminDb = admin.firestore();
