
"use client";

import { useState } from "react";
import TiptapEditor from "./TiptapEditor";
import { Save, Loader2, ArrowLeft, Calendar, BookOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface NoteEditorWrapperProps {
    noteId: string;
    initialTitle: string;
    initialHtml: string;
    initialSubjectId: string;
    initialStudyTimeId: string;
    initialDate: Date;
    subjects: { id: string; name: string; code: string }[];
    studyTimes: { id: string; subjectId: string; type: string; startAt: Date; endAt: Date }[];
}

export default function NoteEditorWrapper({
    noteId,
    initialTitle,
    initialHtml,
    initialSubjectId,
    initialStudyTimeId,
    initialDate,
    subjects,
    studyTimes
}: NoteEditorWrapperProps) {
    const [content, setContent] = useState(initialHtml);
    const [title, setTitle] = useState(initialTitle);
    const [subjectId, setSubjectId] = useState(initialSubjectId);
    const [studyTimeId, setStudyTimeId] = useState(initialStudyTimeId);
    const [date, setDate] = useState(initialDate);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const filteredStudyTimes = subjectId
        ? studyTimes.filter(st => st.subjectId === subjectId)
        : studyTimes;

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/notes/${noteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    subjectId: subjectId || null,
                    studyTimeId: studyTimeId || null,
                    date: date.toISOString()
                })
            });
            if (!res.ok) throw new Error("Failed to save");
            router.refresh();
        } catch (e) {
            alert("Error saving note");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            router.push("/lecture-notes");
            router.refresh();
        } catch (e) {
            alert("Delete failed");
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col h-screen bg-white shadow-2xl">
            <header className="px-6 py-4 flex flex-col gap-4 border-b border-gray-100 bg-gray-50/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <Link href="/lecture-notes" className="group p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200">
                            <ArrowLeft size={20} className="text-gray-400 group-hover:text-gray-900" />
                        </Link>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-3xl font-black text-gray-900 border-none focus:ring-0 bg-transparent placeholder-gray-200 w-full tracking-tight"
                            placeholder="Untilted Note"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={deleting || saving}
                            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30"
                            title="Delete note"
                        >
                            {deleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-70"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Note
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center text-sm">
                    <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 transition-all hover:border-blue-200 group">
                        <BookOpen size={18} className="text-gray-400 group-hover:text-blue-500" />
                        <select
                            value={subjectId}
                            onChange={(e) => {
                                setSubjectId(e.target.value);
                                setStudyTimeId("");
                            }}
                            className="bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-bold min-w-[150px] cursor-pointer"
                        >
                            <option value="">Select Subject...</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.code} {s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 transition-all hover:border-indigo-200 group">
                        <Calendar size={18} className="text-gray-400 group-hover:text-indigo-500" />
                        <select
                            value={studyTimeId}
                            onChange={(e) => {
                                const sid = e.target.value;
                                setStudyTimeId(sid);
                                // Auto set date if session selected
                                if (sid) {
                                    const st = studyTimes.find(s => s.id === sid);
                                    if (st) setDate(st.startAt);
                                }
                            }}
                            className="bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-bold min-w-[200px] cursor-pointer"
                        >
                            <option value="">Link to Class Session...</option>
                            {filteredStudyTimes.map(st => {
                                const day = format(st.startAt, "EEE, MMM d");
                                const time = format(st.startAt, "HH:mm");
                                return (
                                    <option key={st.id} value={st.id}>
                                        {day} at {time} ({st.type})
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 transition-all hover:border-orange-200 group">
                        <input
                            type="date"
                            value={date.toISOString().split('T')[0]}
                            onChange={(e) => setDate(new Date(e.target.value))}
                            className="bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-bold cursor-pointer"
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden">
                <TiptapEditor content={initialHtml} onChange={setContent} />
            </main>
        </div>
    );
}
