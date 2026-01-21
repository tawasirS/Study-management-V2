
import { adminDb } from "./firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

// Types based on our Schema
export type Subject = {
    id: string;
    code: string;
    name: string;
    ownerTeacherName: string;
    memberUserIds: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type StudyTime = {
    id: string;
    subjectId: string;
    startAt: Timestamp;
    endAt: Timestamp;
    room: string;
    teacherName: string;
    type: "lecture" | "lab" | "tutorial" | "exam" | "other";
    participantUserIds: string[];
};

export type Homework = {
    id: string;
    subjectId: string;
    studyTimeId?: string; // Link to the session it was assigned
    title: string;
    detail: string;
    assignedAt: Timestamp;
    dueAt: Timestamp | null;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

export type Submission = {
    userId: string;
    status: "not_started" | "in_progress" | "submitted" | "late" | "graded";
    submittedAt: Timestamp | null;
    grade: number | null;
    note: string | null;
};

export type LectureNoteMetadata = {
    id: string;
    subjectId: string;
    studyTimeId?: string;
    title: string;
    content: string; // Storing content in Firestore now for simplicity/openness
    createdByUserId: string;
    createdAt: Timestamp;
    date: Timestamp; // For linking to a specific date
};

export type User = {
    id: string;
    displayName: string;
};

// ---------------------------------------------------------
// REPOSITORY FUNCTIONS (Data Access)
// ---------------------------------------------------------

export async function getUsers(): Promise<User[]> {
    const snapshot = await adminDb.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
    return users.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function getSubjects(): Promise<Subject[]> {
    const snapshot = await adminDb.collection("subjects").get();
    const subjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Subject));
    return subjects.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export async function createSubject(data: Omit<Subject, "id" | "createdAt" | "updatedAt">) {
    const docRef = adminDb.collection("subjects").doc();
    await docRef.set({
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    });
    return docRef.id;
}

export async function updateSubject(id: string, data: Partial<Subject>) {
    await adminDb.collection("subjects").doc(id).update({
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteSubject(id: string) {
    await adminDb.collection("subjects").doc(id).delete();
}

export async function getSubjectById(subjectId: string): Promise<Subject | null> {
    const doc = await adminDb.collection("subjects").doc(subjectId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Subject;
}

export async function getAllStudyTimes(): Promise<StudyTime[]> {
    const snapshot = await adminDb.collection("studyTimes").get();
    const times = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StudyTime));
    return times.sort((a, b) => a.startAt.toMillis() - b.startAt.toMillis());
}

export async function getStudyTimesBySubject(subjectId: string): Promise<StudyTime[]> {
    const snapshot = await adminDb
        .collection("studyTimes")
        .where("subjectId", "==", subjectId)
        .get();

    const times = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StudyTime));
    return times.sort((a, b) => a.startAt.toMillis() - b.startAt.toMillis());
}

export async function createStudyTime(data: Omit<StudyTime, "id">) {
    const docRef = adminDb.collection("studyTimes").doc();
    await docRef.set(data);
    return docRef.id;
}

export async function updateStudyTime(id: string, data: Partial<StudyTime>) {
    await adminDb.collection("studyTimes").doc(id).update(data);
}

export async function deleteStudyTime(id: string) {
    await adminDb.collection("studyTimes").doc(id).delete();
}

export async function getHomeworks(subjectId?: string): Promise<Homework[]> {
    let query: FirebaseFirestore.Query = adminDb.collection("homeworks");
    if (subjectId) {
        query = query.where("subjectId", "==", subjectId);
    }
    const snapshot = await query.get();

    const homeworks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Homework));
    return homeworks.sort((a, b) => {
        const tA = a.dueAt?.toMillis() ?? Infinity;
        const tB = b.dueAt?.toMillis() ?? Infinity;
        return tA - tB;
    });
}

export async function createHomework(data: Omit<Homework, "id" | "createdAt" | "updatedAt">) {
    const docRef = adminDb.collection("homeworks").doc();
    await docRef.set({
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    });
    return docRef.id;
}

export async function updateHomework(id: string, data: Partial<Homework>) {
    await adminDb.collection("homeworks").doc(id).update({
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteHomework(id: string) {
    await adminDb.collection("homeworks").doc(id).delete();
}

export async function createSubmission(homeworkId: string, userId: string, data: Partial<Submission>) {
    await adminDb.collection("homeworks").doc(homeworkId).collection("submissions").doc(userId).set({
        ...data,
        userId,
        updatedAt: Timestamp.now()
    }, { merge: true });
}

export async function getMySubmission(homeworkId: string, userId: string): Promise<Submission | null> {
    const doc = await adminDb
        .collection("homeworks")
        .doc(homeworkId)
        .collection("submissions")
        .doc(userId)
        .get();

    if (!doc.exists) return null;
    return { userId: doc.id, ...doc.data() } as Submission;
}

export async function getAllHomeworksWithStatus(userId: string): Promise<(Homework & { submission?: Submission })[]> {
    const subjects = await getSubjects();
    const allHomeworks: (Homework & { submission?: Submission })[] = [];

    for (const sub of subjects) {
        const hws = await getHomeworks(sub.id);
        for (const hw of hws) {
            const submission = await getMySubmission(hw.id, userId);
            allHomeworks.push({ ...hw, submission: submission || undefined });
        }
    }

    return allHomeworks.sort((a, b) => {
        const tA = a.dueAt?.toMillis() ?? Infinity;
        const tB = b.dueAt?.toMillis() ?? Infinity;
        return tA - tB;
    });
}

export async function getLectureNotes(subjectId?: string): Promise<LectureNoteMetadata[]> {
    let query: FirebaseFirestore.Query = adminDb.collection("lectureNotes");
    if (subjectId) {
        query = query.where("subjectId", "==", subjectId);
    }
    const snapshot = await query.get();

    const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LectureNoteMetadata));
    return notes.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export async function getLectureNoteById(id: string): Promise<LectureNoteMetadata | null> {
    const doc = await adminDb.collection("lectureNotes").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as LectureNoteMetadata;
}

export async function createLectureNote(data: Omit<LectureNoteMetadata, "id" | "createdAt">) {
    const docRef = adminDb.collection("lectureNotes").doc();
    await docRef.set({
        ...data,
        createdAt: Timestamp.now()
    });
    return docRef.id;
}

export async function updateLectureNote(id: string, data: Partial<LectureNoteMetadata>) {
    await adminDb.collection("lectureNotes").doc(id).update(data);
}

export async function deleteLectureNote(id: string) {
    await adminDb.collection("lectureNotes").doc(id).delete();
}
