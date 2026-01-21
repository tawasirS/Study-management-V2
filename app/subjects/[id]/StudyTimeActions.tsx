
"use client";

import React, { useState } from 'react';
import { Edit2, Trash2, Copy } from 'lucide-react';
import { deleteStudyTimeAction, addStudyTimeAction } from '@/lib/actions';
import StudyTimeModal from '@/components/StudyTimeModal';

interface StudyTimeActionsProps {
    session: {
        id: string;
        subjectId: string;
        type: string;
        startAt: Date;
        endAt: Date;
        room: string;
        participantUserIds: string[];
    };
}

export default function StudyTimeActions({ session }: StudyTimeActionsProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this session?")) return;
        setDeleting(true);
        await deleteStudyTimeAction(session.id, session.subjectId);
        setDeleting(false);
    };

    const handleCopy = async () => {
        const formData = new FormData();
        formData.append("subjectId", session.subjectId);
        formData.append("type", session.type);
        formData.append("startAt", session.startAt.toISOString().slice(0, 16));
        formData.append("endAt", session.endAt.toISOString().slice(0, 16));
        formData.append("room", `${session.room} (Copy)`);

        if (session.participantUserIds) {
            session.participantUserIds.forEach(uid => {
                formData.append("participantUserIds", uid);
            });
        }

        await addStudyTimeAction(formData);
    };

    return (
        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
            <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Duplicate"
            >
                <Copy size={16} />
            </button>
            <button
                onClick={() => setIsEditOpen(true)}
                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                title="Edit"
            >
                <Edit2 size={16} />
            </button>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                title="Delete"
            >
                <Trash2 size={16} />
            </button>

            <StudyTimeModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                subjectId={session.subjectId}
                session={session}
            />
        </div>
    );
}
