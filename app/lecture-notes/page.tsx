
import { getLectureNotes, getSubjects } from "@/lib/db";
import LectureNotesList from "./LectureNotesList";

export const revalidate = 0;

export default async function LectureNotesPage() {
    const [notes, subjects] = await Promise.all([
        getLectureNotes(),
        getSubjects()
    ]);

    return (
        <LectureNotesList
            initialNotes={notes.map(n => ({
                id: n.id,
                title: n.title,
                subjectId: n.subjectId,
                createdAt: n.createdAt ? n.createdAt.toDate() : null
            }))}
            subjects={subjects.map(s => ({ id: s.id, name: s.name }))}
        />
    );
}
