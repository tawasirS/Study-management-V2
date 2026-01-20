
"use server";

import { revalidatePath } from "next/cache";
import {
    createSubject,
    updateSubject,
    deleteSubject,
    createHomework,
    updateHomework,
    deleteHomework,
    createLectureNote,
    updateLectureNote,
    deleteLectureNote,
    createSubmission,
    createStudyTime,
    updateStudyTime,
    deleteStudyTime
} from "./db";
import { Timestamp } from "firebase-admin/firestore";

// ... (rest of the file)

// STUDY TIMES
export async function addStudyTimeAction(formData: FormData) {
    const subjectId = formData.get("subjectId") as string;
    const type = formData.get("type") as any;
    const startAtStr = formData.get("startAt") as string;
    const endAtStr = formData.get("endAt") as string;
    const room = formData.get("room") as string;
    const participants = formData.getAll("participantUserIds") as string[];

    await createStudyTime({
        subjectId,
        type,
        startAt: Timestamp.fromDate(new Date(startAtStr)),
        endAt: Timestamp.fromDate(new Date(endAtStr)),
        room,
        teacherName: "",
        participantUserIds: participants.length > 0 ? participants : ["everyone"]
    });

    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath("/");
}

export async function editStudyTimeAction(id: string, formData: FormData) {
    const subjectId = formData.get("subjectId") as string;
    const type = formData.get("type") as any;
    const startAtStr = formData.get("startAt") as string;
    const endAtStr = formData.get("endAt") as string;
    const room = formData.get("room") as string;
    const participants = formData.getAll("participantUserIds") as string[];

    await updateStudyTime(id, {
        type,
        startAt: Timestamp.fromDate(new Date(startAtStr)),
        endAt: Timestamp.fromDate(new Date(endAtStr)),
        room,
        participantUserIds: participants.length > 0 ? participants : ["everyone"]
    });

    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath("/");
}

export async function deleteStudyTimeAction(id: string, subjectId: string) {
    await deleteStudyTime(id);
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath("/");
}

export async function duplicateStudyTimeAction(id: string, subjectId: string) {
    // We could fetch the original first, but usually we can just pass the data from UI
    // To be safe we'll provide a way to just create a new one with same data
    // Usually handled by UI calling addStudyTimeAction with same data
}

// SUBJECTS
export async function addSubjectAction(formData: FormData) {
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const ownerTeacherName = formData.get("ownerTeacherName") as string;

    await createSubject({
        code,
        name,
        ownerTeacherName,
        memberUserIds: ["everyone"] // Open system
    });

    revalidatePath("/subjects");
    revalidatePath("/");
}

export async function editSubjectAction(id: string, formData: FormData) {
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const ownerTeacherName = formData.get("ownerTeacherName") as string;

    await updateSubject(id, {
        code,
        name,
        ownerTeacherName
    });

    revalidatePath("/subjects");
    revalidatePath(`/subjects/${id}`);
    revalidatePath("/");
}

// HOMEWORKS
export async function addHomeworkAction(formData: FormData) {
    const subjectId = formData.get("subjectId") as string;
    const studyTimeId = formData.get("studyTimeId") as string;
    const title = formData.get("title") as string;
    const detail = formData.get("detail") as string;
    const dueAtStr = formData.get("dueAt") as string;

    await createHomework({
        subjectId,
        studyTimeId: studyTimeId || undefined,
        title,
        detail,
        assignedAt: Timestamp.now(),
        dueAt: dueAtStr ? Timestamp.fromDate(new Date(dueAtStr)) : null
    });

    revalidatePath("/homeworks");
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath("/");
}

export async function editHomeworkAction(id: string, formData: FormData) {
    const subjectId = formData.get("subjectId") as string;
    const studyTimeId = formData.get("studyTimeId") as string;
    const title = formData.get("title") as string;
    const detail = formData.get("detail") as string;
    const dueAtStr = formData.get("dueAt") as string;

    await updateHomework(id, {
        studyTimeId: studyTimeId || undefined,
        title,
        detail,
        dueAt: dueAtStr ? Timestamp.fromDate(new Date(dueAtStr)) : null
    });

    revalidatePath("/homeworks");
    if (subjectId) revalidatePath(`/subjects/${subjectId}`);
    revalidatePath("/");
}

export async function submitHomeworkAction(homeworkId: string, userId: string, currentStatus?: string) {
    const isDone = currentStatus === "submitted";
    const newStatus = isDone ? "not_started" : "submitted";
    const submittedAt = isDone ? null : Timestamp.now();

    await createSubmission(homeworkId, userId, {
        status: newStatus as any,
        submittedAt
    });
    revalidatePath("/homeworks");
    revalidatePath("/");
}

// LECTURE NOTES
export async function addLectureNoteAction(data: {
    subjectId: string,
    title: string,
    content: string,
    date: string,
    studyTimeId?: string
}) {
    await createLectureNote({
        subjectId: data.subjectId,
        title: data.title,
        content: data.content,
        date: Timestamp.fromDate(new Date(data.date)),
        studyTimeId: data.studyTimeId,
        createdByUserId: "guest"
    });

    revalidatePath("/lecture-notes");
    revalidatePath("/");
}

export async function editLectureNoteAction(id: string, data: {
    title: string,
    content: string,
    date: string,
    subjectId: string
}) {
    await updateLectureNote(id, {
        title: data.title,
        content: data.content,
        date: Timestamp.fromDate(new Date(data.date)),
        subjectId: data.subjectId
    });

    revalidatePath("/lecture-notes");
    revalidatePath(`/lecture-notes/${id}`);
}

export async function deleteSubjectAction(id: string) {
    await deleteSubject(id);
    revalidatePath("/subjects");
    revalidatePath("/");
}

export async function deleteHomeworkAction(id: string) {
    await deleteHomework(id);
    revalidatePath("/homeworks");
    revalidatePath("/");
}
