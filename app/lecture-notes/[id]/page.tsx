
import { adminDb } from "@/lib/firebaseAdmin";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import NoteEditorWrapper from "@/components/NoteEditorWrapper";
import { getSubjects, getAllStudyTimes } from "@/lib/db";

export const revalidate = 0;

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Metadata & Content
    const doc = await adminDb.collection("lectureNotes").doc(id).get();
    if (!doc.exists) notFound();

    const data = doc.data();

    // Fetch Lists for Dropdowns
    const [rawSubjects, rawStudyTimes] = await Promise.all([
        getSubjects(),
        getAllStudyTimes()
    ]);

    // Serialize data for client
    const subjects = rawSubjects.map(s => ({
        id: s.id,
        name: s.name,
        code: s.code
    }));

    const studyTimes = rawStudyTimes.map(st => ({
        id: st.id,
        subjectId: st.subjectId,
        type: st.type,
        startAt: st.startAt.toDate(),
        endAt: st.endAt.toDate()
    }));

    return (
        <div>
            <NoteEditorWrapper
                noteId={id}
                initialTitle={data?.title || "Untitled"}
                initialHtml={data?.content || ""}
                initialSubjectId={data?.subjectId || ""}
                initialStudyTimeId={data?.studyTimeId || ""}
                initialDate={data?.date ? data.date.toDate() : new Date()}
                subjects={subjects}
                studyTimes={studyTimes}
            />
        </div>
    );
}
