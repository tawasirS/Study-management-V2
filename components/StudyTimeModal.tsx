
"use client";

import { addStudyTimeAction, editStudyTimeAction } from '@/lib/actions';
import { X, Users } from 'lucide-react';
import { format } from 'date-fns';
import { USERS } from '@/lib/constants';

interface StudyTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjectId: string;
    session?: {
        id: string;
        type: string;
        startAt: Date;
        endAt: Date;
        room: string;
        participantUserIds: string[];
    };
}

export default function StudyTimeModal({ isOpen, onClose, subjectId, session }: StudyTimeModalProps) {
    if (!isOpen) return null;

    // Filter out 'all' for selection
    const selectableUsers = USERS.filter(u => u.id !== 'all');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in scale-in duration-200">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-bold">{session ? 'Edit Session' : 'Add Study Session'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                <form action={async (fd) => {
                    if (session) {
                        await editStudyTimeAction(session.id, fd);
                    } else {
                        await addStudyTimeAction(fd);
                    }
                    onClose();
                }} className="p-6 space-y-4">
                    <input type="hidden" name="subjectId" value={subjectId} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-700">Type</label>
                            <select name="type" defaultValue={session?.type} className="w-full p-3 rounded-xl border bg-gray-50 border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium">
                                <option value="lecture">Lecture</option>
                                <option value="lab">Lab</option>
                                <option value="tutorial">Tutorial</option>
                                <option value="exam">Exam</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-700">Room</label>
                            <input
                                name="room"
                                defaultValue={session?.room}
                                placeholder="e.g. 402"
                                className="w-full p-3 rounded-xl border bg-gray-50 border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                        <label className="text-sm font-bold mb-3 flex items-center gap-2 text-blue-700">
                            <Users size={16} /> Participants (ใครเรียนบ้าง)
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {selectableUsers.map(user => (
                                <label key={user.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-blue-100 shadow-sm cursor-pointer hover:border-blue-400 peer-checked:bg-blue-600 transition-all">
                                    <input
                                        type="checkbox"
                                        name="participantUserIds"
                                        value={user.id}
                                        defaultChecked={session?.participantUserIds.includes(user.id) ?? true}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-bold text-gray-700">{user.name.split(' ')[1] || user.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-700">Start Time</label>
                            <input
                                type="datetime-local"
                                name="startAt"
                                defaultValue={session ? format(session.startAt, "yyyy-MM-dd'T'HH:mm") : ""}
                                required
                                className="w-full p-3 rounded-xl border bg-gray-50 border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 text-gray-700">End Time</label>
                            <input
                                type="datetime-local"
                                name="endAt"
                                defaultValue={session ? format(session.endAt, "yyyy-MM-dd'T'HH:mm") : ""}
                                required
                                className="w-full p-3 rounded-xl border bg-gray-50 border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95">
                        {session ? 'Update Session' : 'Save Session'}
                    </button>
                </form>
            </div>
        </div>
    );
}
