
import { getAllStudyTimes, getHomeworks, getSubjects } from "@/lib/db";
import CalendarView from "@/components/CalendarView";
import { cookies } from "next/headers";
import { USER_COOKIE_NAME, USERS } from "@/lib/constants";

export const revalidate = 0;

export default async function Home() {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get(USER_COOKIE_NAME)?.value || "all";

  const [allStudyTimes, allHomeworks, subjects] = await Promise.all([
    getAllStudyTimes(),
    getHomeworks(),
    getSubjects()
  ]);

  const subjectMap = new Map(subjects.map(s => [s.id, s.name]));
  const currentUser = USERS.find(u => u.id === currentUserId);

  // Filter logic
  const filteredStudyTimes = currentUserId === "all"
    ? allStudyTimes
    : allStudyTimes.filter(st => st.participantUserIds?.includes(currentUserId) || st.participantUserIds?.includes("everyone"));

  const filteredHomeworks = currentUserId === "all"
    ? allHomeworks
    : allHomeworks.filter(hw => {
      if (!hw.studyTimeId) return true;
      const st = allStudyTimes.find(s => s.id === hw.studyTimeId);
      return st?.participantUserIds?.includes(currentUserId) || st?.participantUserIds?.includes("everyone");
    });

  const events = [
    ...filteredStudyTimes.map(st => ({
      id: st.id,
      title: subjectMap.get(st.subjectId) || "Class",
      date: st.startAt.toDate(),
      type: 'class' as const,
      color: 'blue',
      subjectId: st.subjectId
    })),
    ...filteredHomeworks.filter(hw => hw.dueAt).map(hw => ({
      id: hw.id,
      title: `Due: ${hw.title}`,
      date: hw.dueAt!.toDate(),
      type: 'homework' as const,
      color: 'orange',
      subjectId: hw.subjectId
    }))
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          {currentUserId === "all" ? "Combined Calendar" : `${currentUser?.name.split(' ')[1]}'s Schedule`}
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          {currentUserId === "all"
            ? "Overview of everyone's classes and assignment deadlines."
            : `Personalized view for ${currentUser?.name}.`}
        </p>
      </header>

      <CalendarView events={events} />
    </div>
  );
}
