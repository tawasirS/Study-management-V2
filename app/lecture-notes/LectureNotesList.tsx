
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Loader2, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Note {
    id: string;
    title: string;
    subjectId: string;
    createdAt: any;
}

interface LectureNotesListProps {
    initialNotes: Note[];
    subjects: { id: string; name: string }[];
}

export default function LectureNotesList({ initialNotes, subjects }: LectureNotesListProps) {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "New Lecture Note",
                    content: "<h1>Start writing...</h1>",
                    subjectId: subjects.length > 0 ? subjects[0].id : ""
                })
            });
            const data = await res.json();
            if (data.noteId) {
                router.push(`/lecture-notes/${data.noteId}`);
            }
        } catch (e) {
            console.error(e);
            setIsCreating(false);
        }
    };

    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Lecture Hub</h1>
                    <p className="text-lg text-gray-500 mt-2">Your collection of study materials and class insights.</p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-70"
                >
                    {isCreating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    Create New Note
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialNotes.map((note) => (
                    <Link
                        key={note.id}
                        href={`/lecture-notes/${note.id}`}
                        className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-72 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 blur-2xl opacity-50" />

                        <div className="flex-1 relative z-10">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-12 transition-transform">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                                {note.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                <BookOpen size={14} className="text-gray-300" />
                                {subjectMap.get(note.subjectId) || note.subjectId}
                            </div>
                        </div>

                        <div className="border-t border-gray-50 pt-6 flex items-center justify-between text-sm font-bold text-gray-400 relative z-10">
                            <span className="flex items-center gap-2">
                                <Calendar size={14} />
                                {note.createdAt ? format(note.createdAt, "MMM d, yyyy") : "?"}
                            </span>
                            <span className="text-orange-500 transform group-hover:translate-x-2 transition-transform">Open Note &rarr;</span>
                        </div>
                    </Link>
                ))}

                {initialNotes.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <FileText size={40} className="text-gray-200" />
                        </div>
                        <p className="text-2xl font-black text-gray-400">Your notebook is empty</p>
                        <p className="text-gray-400 mt-2 max-w-md mx-auto">Start capturing your class insights by creating your first lecture note today.</p>
                        <button
                            onClick={handleCreate}
                            className="mt-8 px-8 py-4 bg-white text-orange-600 border-2 border-orange-100 font-bold rounded-2xl hover:bg-orange-50 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
