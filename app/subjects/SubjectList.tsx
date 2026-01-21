
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import SubjectModal from '@/components/SubjectModal';
import { deleteSubjectAction } from '@/lib/actions';

interface Subject {
    id: string;
    code: string;
    name: string;
    ownerTeacherName: string;
}

interface SubjectListProps {
    initialSubjects: Subject[];
}

export default function SubjectList({ initialSubjects }: SubjectListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);

    const openAddModal = () => {
        setEditingSubject(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (e: React.MouseEvent, subject: Subject) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingSubject(subject);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Academic Subjects</h1>
                    <p className="text-lg text-gray-500 mt-2">Manage your courses and learning materials.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-95"
                >
                    <Plus size={20} /> Add Subject
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialSubjects.map((subject) => (
                    <Link
                        key={subject.id}
                        href={`/subjects/${subject.id}`}
                        className="group relative block bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200"
                    >
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button
                                onClick={(e) => openEditModal(e, subject)}
                                className="p-2 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (confirm("Delete this subject?")) {
                                        await deleteSubjectAction(subject.id);
                                    }
                                }}
                                className="p-2 bg-gray-50 text-red-300 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <BookOpen size={28} />
                            </div>
                            <span className="text-xs font-black px-3 py-1 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors uppercase tracking-widest">
                                {subject.code}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {subject.name}
                        </h3>

                        <p className="text-gray-500 mb-8 flex items-center gap-2 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {subject.ownerTeacherName}
                        </p>

                        <div className="flex items-center text-sm font-bold text-blue-600 mt-auto">
                            Go to Subject <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                ))}

                {initialSubjects.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-xl font-bold text-gray-400">No subjects found.</p>
                        <p className="text-gray-400 mt-1">Start by adding your first academic course.</p>
                    </div>
                )}
            </div>

            <SubjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subject={editingSubject}
            />
        </div>
    );
}
