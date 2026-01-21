
"use client";

import React, { useState } from 'react';
import { addSubjectAction, editSubjectAction } from '@/lib/actions';
import { X } from 'lucide-react';

interface SubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject?: {
        id: string;
        code: string;
        name: string;
        ownerTeacherName: string;
    };
}

export default function SubjectModal({ isOpen, onClose, subject }: SubjectModalProps) {
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (subject) {
            await editSubjectAction(subject.id, formData);
        } else {
            await addSubjectAction(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">
                        {subject ? 'Edit Subject' : 'Add New Subject'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subject Code</label>
                        <input
                            name="code"
                            defaultValue={subject?.code}
                            placeholder="e.g. CS101"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subject Name</label>
                        <input
                            name="name"
                            defaultValue={subject?.name}
                            placeholder="e.g. Introduction to Programming"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Teacher Name</label>
                        <input
                            name="ownerTeacherName"
                            defaultValue={subject?.ownerTeacherName}
                            placeholder="e.g. Dr. Smith"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        {subject ? 'Save Changes' : 'Create Subject'}
                    </button>
                </form>
            </div>
        </div>
    );
}
