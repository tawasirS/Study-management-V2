
"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertTriangle, Plus, Edit2, Trash2, RotateCcw, CalendarDays } from 'lucide-react';
import { submitHomeworkAction, deleteHomeworkAction } from '@/lib/actions';
import HomeworkModal from '@/components/HomeworkModal';
import { USERS } from '@/lib/constants';

interface Homework {
    id: string;
    subjectId: string;
    studyTimeId: string | null;
    title: string;
    detail: string;
    assignedAt: any;
    dueAt: any;
    submission?: any;
}

interface HomeworkListProps {
    allHomeworks: Homework[];
    subjects: { id: string; name: string }[];
    currentUserId: string;
    sessions?: { id: string; subjectId: string; startAt: Date; type: string }[];
}

export default function HomeworkList({ allHomeworks, subjects, currentUserId, sessions }: HomeworkListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHomework, setEditingHomework] = useState<any>(undefined);
    const now = Date.now();

    const pending = allHomeworks.filter(h => !h.submission || h.submission.status === 'not_started' || h.submission.status === 'in_progress');
    const submitted = allHomeworks.filter(h => h.submission && ['submitted', 'late', 'graded'].includes(h.submission.status));

    const handleToggleSubmit = async (hw: Homework) => {
        if (currentUserId === "all") {
            alert("Please select a specific user to mark homework as done.");
            return;
        }
        await submitHomeworkAction(hw.id, currentUserId, hw.submission?.status);
    };

    const openAddModal = () => {
        setEditingHomework(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (hw: any) => {
        setEditingHomework(hw);
        setIsModalOpen(true);
    };

    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));
    const currentUser = USERS.find(u => u.id === currentUserId);

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Assignments {currentUserId !== 'all' && <span className="text-blue-600">for {currentUser?.name.split(' ')[1] || currentUser?.name}</span>}
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">Track upcoming deadlines and project submissions.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                    <Plus size={20} /> Create Assignment
                </button>
            </header>

            {/* Pending Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                        <Clock size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Pending Tasks</h2>
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 text-sm font-bold rounded-full border border-orange-100 italic">
                        {pending.length} remaining
                    </span>
                </div>

                <div className="grid gap-6">
                    {pending.map(hw => {
                        const dueDate = hw.dueAt;
                        const isUrgent = dueDate && (dueDate.getTime() - now < 86400000 * 3);
                        const session = sessions?.find(s => s.id === hw.studyTimeId);

                        return (
                            <div key={hw.id} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row gap-8 relative overflow-hidden">
                                {isUrgent && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />}

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className="text-[10px] font-black px-3 py-1 bg-gray-900 text-white rounded-lg uppercase tracking-widest">
                                            {subjectMap.get(hw.subjectId) || hw.subjectId}
                                        </span>
                                        {session && (
                                            <span className="text-[10px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 flex items-center gap-1 uppercase tracking-widest">
                                                <CalendarDays size={12} /> {format(session.startAt, "MMM d")} - {session.type}
                                            </span>
                                        )}
                                        {isUrgent && (
                                            <span className="text-xs font-black px-3 py-1 bg-red-50 text-red-600 rounded-lg flex items-center gap-1 animate-pulse uppercase tracking-wider">
                                                <AlertTriangle size={12} /> Due Soon
                                            </span>
                                        )}

                                        <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(hw)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Delete this assignment?")) {
                                                        await deleteHomeworkAction(hw.id);
                                                    }
                                                }}
                                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                                        {hw.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">
                                        {hw.detail}
                                    </p>

                                    <div className="flex items-center gap-6 text-sm">
                                        {dueDate && (
                                            <div className={`flex items-center gap-2 font-bold ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>
                                                <Clock size={16} />
                                                Due {format(dueDate, "PPPp")}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center md:justify-end shrink-0">
                                    <button
                                        onClick={() => handleToggleSubmit(hw)}
                                        disabled={currentUserId === "all"}
                                        className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-100 font-black rounded-2xl transition-all hover:border-blue-200 active:scale-95 flex items-center gap-2 disabled:opacity-30"
                                    >
                                        Mark as Submitted
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {pending.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                            <CheckCircle2 size={64} className="mx-auto text-green-300 mb-6" />
                            <p className="text-xl font-bold text-gray-400">Great job! No pending tasks.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Completed Section */}
            <section className="bg-gray-50/50 p-10 rounded-[40px] border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Completed</h2>
                </div>

                <div className="grid gap-4">
                    {submitted.map(hw => (
                        <div key={hw.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group/done">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{hw.title}</h4>
                                    <p className="text-xs text-gray-400 font-medium tracking-tight">
                                        Submitted on {hw.submission?.submittedAt ? format(hw.submission.submittedAt, "MMM d, yyyy 'at' h:mm a") : "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleToggleSubmit(hw)}
                                    className="p-2 text-gray-300 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all opacity-0 group-hover/done:opacity-100 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                                    title="Undo submission"
                                >
                                    <RotateCcw size={14} /> Undo
                                </button>
                                <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                                    {hw.submission?.status.replace("_", " ")}
                                </span>
                            </div>
                        </div>
                    ))}
                    {submitted.length === 0 && (
                        <p className="text-gray-400 text-center py-8 font-medium italic">No completed assignments yet.</p>
                    )}
                </div>
            </section>

            <HomeworkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subjects={subjects}
                sessions={sessions}
                homework={editingHomework}
            />
        </div>
    );
}
