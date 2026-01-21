
"use client";

import { addHomeworkAction, editHomeworkAction } from '@/lib/actions';
import { X, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface HomeworkModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjects: { id: string; name: string }[];
    sessions?: { id: string; subjectId: string; startAt: Date; type: string }[];
    homework?: {
        id: string;
        subjectId: string;
        studyTimeId?: string;
        title: string;
        detail: string;
        dueAt?: Date;
    };
}

export default function HomeworkModal({ isOpen, onClose, subjects, sessions, homework }: HomeworkModalProps) {
    if (!isOpen) return null;

    const selectedSubjectId = homework?.subjectId || (subjects.length === 1 ? subjects[0].id : "");
    const filteredSessions = sessions?.filter(s => s.subjectId === selectedSubjectId) || [];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (homework) {
            await editHomeworkAction(homework.id, formData);
        } else {
            await addHomeworkAction(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">
                        {homework ? 'Edit Assignment' : 'New Assignment'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {!homework && subjects.length > 1 ? (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <select
                                    name="subjectId"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                                >
                                    <option value="">Select subject...</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <input type="hidden" name="subjectId" value={selectedSubjectId} />
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <CalendarDays size={16} /> Linked Session
                            </label>
                            <select
                                name="studyTimeId"
                                defaultValue={homework?.studyTimeId}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white font-medium"
                            >
                                <option value="">General Assignment</option>
                                {filteredSessions.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {format(s.startAt, "MMM d")} - {s.type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Homework Title</label>
                        <input
                            name="title"
                            defaultValue={homework?.title}
                            placeholder="e.g. Lab 1: Getting Started"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Instructions / Details</label>
                        <textarea
                            name="detail"
                            defaultValue={homework?.detail}
                            rows={3}
                            placeholder="Describe what needs to be done..."
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Due Date & Time</label>
                        <input
                            name="dueAt"
                            type="datetime-local"
                            defaultValue={homework?.dueAt ? format(homework.dueAt, "yyyy-MM-dd'T'HH:mm") : ""}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                        {homework ? 'Update Assignment' : 'Post Assignment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
