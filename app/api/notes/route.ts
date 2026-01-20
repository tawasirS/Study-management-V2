
import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { subjectId, title, content, createdByUserId, date, studyTimeId } = body;

        const noteId = `lecture-${uuidv4().substring(0, 8)}`;

        const noteData = {
            subjectId: subjectId || "",
            title: title || "Untitled Note",
            content: content || "<h1>New Note</h1><p>Start typing...</p>",
            studyTimeId: studyTimeId || null,
            date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
            createdByUserId: createdByUserId || "guest",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        await adminDb.collection("lectureNotes").doc(noteId).set(noteData);

        return NextResponse.json({ success: true, noteId });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
