
import { getSubjectById, getStudyTimesBySubject, getHomeworks, getLectureNotes } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { Clock, MapPin, Calendar, FileText, Plus, Edit2, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import SubjectDetailActions from "./SubjectDetailActions";
import StudyTimeActions from "./StudyTimeActions";
import { cookies } from "next/headers";
import { USER_COOKIE_NAME } from "@/lib/constants";

export const revalidate = 0;

export default async function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const subject = await getSubjectById(id);

    if (!subject) notFound();

    const [studyTimes, allHomeworks, notes] = await Promise.all([
        getStudyTimesBySubject(id),
        getHomeworks(id),
        getLectureNotes(id)
    ]);

    const cookieStore = await cookies();
    const currentUserId = cookieStore.get(USER_COOKIE_NAME)?.value || "all";

    const filteredStudyTimes = currentUserId === "all"
        ? studyTimes
        : studyTimes.filter(st => st.participantUserIds?.includes(currentUserId) || st.participantUserIds?.includes("everyone"));

    // Filter homeworks: if linked to a studyTime, must be a participant. If not linked, show to all?
    const filteredHomeworks = currentUserId === "all"
        ? allHomeworks
        : allHomeworks.filter(hw => {
            if (!hw.studyTimeId) return true; // General homework
            const st = studyTimes.find(s => s.id === hw.studyTimeId);
            return st?.participantUserIds?.includes(currentUserId) || st?.participantUserIds?.includes("everyone");
        });

    // Prepare sessions for HomeworkModal
    const sessions = studyTimes.map(st => ({
        id: st.id,
        subjectId: id,
        startAt: st.startAt.toDate(),
        type: st.type
    }));

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl shadow-blue-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/subjects" className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                            <ArrowLeft size={20} className="text-gray-400" />
                        </Link>
                        <span className="text-sm font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50 px-4 py-1.5 rounded-full">{subject.code}</span>
                    </div>
                    <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight leading-none">{subject.name}</h1>
                    <div className="flex flex-wrap gap-6 items-center">
                        <p className="text-xl text-gray-500 font-medium flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]"></span>
                            Instructor: <span className="text-gray-900 font-bold">{subject.ownerTeacherName}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Schedule & Quick Info */}
                <div className="lg:col-span-1 space-y-10">
                    <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <Clock size={24} className="text-blue-500" /> Schedule
                            </h2>
                            <SubjectDetailActions subjectId={id} type="session" />
                        </div>
                        <div className="space-y-4">
                            {filteredStudyTimes.map(st => {
                                const sessionData = {
                                    id: st.id,
                                    subjectId: id,
                                    type: st.type,
                                    startAt: st.startAt.toDate(),
                                    endAt: st.endAt.toDate(),
                                    room: st.room,
                                    participantUserIds: st.participantUserIds || ["everyone"]
                                };

                                return (
                                    <div key={st.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-blue-100 group/item relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-blue-100 text-blue-700 uppercase tracking-widest">{st.type}</span>
                                            <StudyTimeActions session={sessionData} />
                                        </div>
                                        <div className="text-gray-900 font-black text-lg mb-1">
                                            {format(st.startAt.toDate(), "EEEE, MMM d")}
                                        </div>
                                        <div className="text-gray-500 font-bold mb-4 flex items-center gap-2">
                                            <Clock size={16} />
                                            {format(st.startAt.toDate(), "HH:mm")} - {format(st.endAt.toDate(), "HH:mm")}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover/item:text-blue-500 transition-colors">
                                            <MapPin size={16} /> {st.room}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredStudyTimes.length === 0 && (
                                <div className="text-center py-10 text-gray-400 font-medium italic">
                                    No sessions scheduled for you.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <FileText size={24} className="text-orange-500" /> Notes
                            </h2>
                            <Link href="/lecture-notes" className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {notes.slice(0, 5).map(note => (
                                <Link
                                    key={note.id}
                                    href={`/lecture-notes/${note.id}`}
                                    className="block p-5 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-lg hover:border-orange-100 transition-all group/note"
                                >
                                    <h4 className="font-bold text-gray-900 truncate group-hover/note:text-orange-600 transition-colors">{note.title}</h4>
                                    <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-tighter">
                                        {format(note.createdAt.toDate(), "MMM d, yyyy")}
                                    </p>
                                </Link>
                            ))}
                            {notes.length === 0 && (
                                <p className="text-gray-400 text-center py-6 font-medium italic">No notes created yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Homeworks & Submissions */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm min-h-[600px]">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                                <Calendar size={32} className="text-indigo-600" /> Coursework
                            </h2>
                            <SubjectDetailActions subjectId={id} type="homework" sessions={sessions} />
                        </div>

                        <div className="grid gap-6">
                            {filteredHomeworks.map(hw => {
                                const dueDate = hw.dueAt ? hw.dueAt.toDate() : null;
                                const isOverdue = dueDate && dueDate < new Date();

                                return (
                                    <div key={hw.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row gap-8 justify-between relative overflow-hidden group">
                                        {isOverdue && <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />}

                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{hw.title}</h3>
                                            <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-2xl">{hw.detail}</p>

                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-tighter ${isOverdue ? "text-red-500" : "text-gray-500"}`}>
                                                    <Calendar size={18} />
                                                    {dueDate ? `Deadline: ${format(dueDate, "PPP")}` : "Open Deadline"}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                                    <Clock size={16} />
                                                    {format(hw.assignedAt.toDate(), "MMM d")}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Link
                                                href="/homeworks"
                                                className="px-8 py-4 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-black rounded-2xl transition-all border border-gray-100 hover:border-indigo-100"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredHomeworks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-32 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                                        <Calendar size={40} className="text-gray-200" />
                                    </div>
                                    <p className="text-2xl font-black text-gray-300 italic">Clear skies! No relevant assignments.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
