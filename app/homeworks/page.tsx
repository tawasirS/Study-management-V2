
import { getAllHomeworksWithStatus, getSubjects, getAllStudyTimes } from "@/lib/db";
import { USER_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import HomeworkList from "./HomeworkList";

export const revalidate = 0;

export default async function HomeworksPage() {
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get(USER_COOKIE_NAME)?.value || "all";

    const [allHomeworksRaw, subjects, studyTimes] = await Promise.all([
        getAllHomeworksWithStatus(currentUserId === "all" ? "user-a" : currentUserId), // Temporary userId for combined view to fetch at least some status
        getSubjects(),
        getAllStudyTimes()
    ]);

    // Filter homeworks based on user participation if not in combined view
    const filteredHomeworks = currentUserId === "all"
        ? allHomeworksRaw
        : allHomeworksRaw.filter(hw => {
            if (!hw.studyTimeId) return true; // General
            const st = studyTimes.find(s => s.id === hw.studyTimeId);
            return st?.participantUserIds?.includes(currentUserId) || st?.participantUserIds?.includes("everyone");
        });

    return (
        <HomeworkList
            currentUserId={currentUserId}
            allHomeworks={filteredHomeworks.map(h => ({
                id: h.id,
                subjectId: h.subjectId,
                studyTimeId: h.studyTimeId || null,
                title: h.title,
                detail: h.detail,
                assignedAt: h.assignedAt ? h.assignedAt.toDate() : null,
                dueAt: h.dueAt ? h.dueAt.toDate() : null,
                submission: h.submission ? {
                    userId: h.submission.userId,
                    status: h.submission.status,
                    grade: h.submission.grade,
                    note: h.submission.note,
                    submittedAt: h.submission.submittedAt ? h.submission.submittedAt.toDate() : null
                } : null
            }))}
            subjects={subjects.map(s => ({ id: s.id, name: s.name }))}
            sessions={studyTimes.map(st => ({ id: st.id, subjectId: st.subjectId, startAt: st.startAt.toDate(), type: st.type }))}
        />
    );
}
