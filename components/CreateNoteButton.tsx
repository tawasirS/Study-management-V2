
"use client";

import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateNoteButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        try {
            // Create a placeholder note
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjectId: "subject-0001", // Default for now, ideally specific
                    title: "Untitled Note",
                    contentHtml: "<h1>New Note</h1><p>Start typing...</p>",
                    createdByUserId: "user-0001"
                })
            });
            const data = await res.json();
            if (data.noteId) {
                router.push(`/lecture-notes/${data.noteId}`);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCreate}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-indigo-200 shadow-lg transition-all active:scale-95 disabled:opacity-70"
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            New Note
        </button>
    );
}
