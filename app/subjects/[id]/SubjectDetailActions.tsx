
"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StudyTimeModal from '@/components/StudyTimeModal';
import HomeworkModal from '@/components/HomeworkModal';

interface SubjectDetailActionsProps {
    subjectId: string;
    type: 'session' | 'homework';
    sessions?: { id: string; subjectId: string; startAt: Date; type: string }[];
}

export default function SubjectDetailActions({ subjectId, type, sessions }: SubjectDetailActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    // For HomeworkModal, we need the subjects list
    const [mockSubjects] = useState([{ id: subjectId, name: "Current Subject" }]);

    return (
        <div className="relative z-20">
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
                <Plus size={20} />
            </button>

            {type === 'session' ? (
                <StudyTimeModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    subjectId={subjectId}
                />
            ) : (
                <HomeworkModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    subjects={mockSubjects}
                    sessions={sessions}
                />
            )}
        </div>
    );
}
