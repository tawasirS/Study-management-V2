
import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const doc = await adminDb.collection("lectureNotes").doc(id).get();
        if (!doc.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        return NextResponse.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const body = await req.json();
        const { content, title, subjectId, studyTimeId } = body;

        const docRef = adminDb.collection("lectureNotes").doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        const updateData: Record<string, any> = { updatedAt: Timestamp.now() };
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (subjectId !== undefined) updateData.subjectId = subjectId;
        if (studyTimeId !== undefined) updateData.studyTimeId = studyTimeId;

        await docRef.update(updateData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await adminDb.collection("lectureNotes").doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
