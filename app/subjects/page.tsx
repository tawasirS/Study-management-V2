
import { getSubjects } from "@/lib/db";
import SubjectList from "./SubjectList";

export const revalidate = 0;

export default async function SubjectsPage() {
    const subjects = await getSubjects();

    return (
        <SubjectList initialSubjects={subjects.map(s => ({
            id: s.id,
            code: s.code,
            name: s.name,
            ownerTeacherName: s.ownerTeacherName
        }))} />
    );
}
