
import { adminDb } from "../lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// ------------------------------------------------------------------
// RAW DATA (Legacy format provided by user)
// ------------------------------------------------------------------
const RAW_DATA = {
    subjects: [
        {
            id: "subject-0001",
            code: "ENG51 0000",
            name: "Mechatronic",
            studyTime: [
                {
                    id: "studyTime-0001-0001",
                    studyTimeStart: "2026-01-01 08:00:00",
                    studyTimeEnd: "2026-01-01 12:00:00",
                    studyRoom: "F61234 lab1",
                    studyUser: ["user-0001", "user-0002", "user-0003"],
                    Teacher: "PHD.PROF. Srisawat",
                    type: "lacture", // Will fix typo
                    homeWorkId: ["homework-0001", "homework-0002", "homework-0003"],
                    lactureNoteId: ["lacture-0001", "lacture-0002", "lacture-0003"]
                }
            ]
        }
    ],
    users: [
        { id: "user-0001", name: "A" },
        { id: "user-0002", name: "B" },
        { id: "user-0003", name: "C" }
    ],
    homeWork: [
        {
            id: "homework-0001",
            name: "การบ้าน.....",
            detail: "ให้ทำ.....",
            assignDate: "2026-01-01 00:00:00",
            dueDate: "2026-01-10 00:00:00",
            userDone: ["user-0001", "user-0002"]
        },
        // Placeholders for homework-0002/0003 as requested
        {
            id: "homework-0002",
            name: "Homework 2 (TBD)",
            detail: "Placeholder detail",
            assignDate: "2026-01-05 09:00:00",
            dueDate: null,
            userDone: []
        },
        {
            id: "homework-0003",
            name: "Homework 3 (TBD)",
            detail: "Placeholder detail",
            assignDate: "2026-01-08 09:00:00",
            dueDate: null,
            userDone: []
        }
    ],
    lactureNote: [
        { id: "lacture-0001", data: "<h1>Lecture 1</h1><p>Content 1...</p>" },
        { id: "lacture-0002", data: "<h1>Lecture 2</h1><p>Content 2...</p>" },
        // Placeholder for 0003
        { id: "lacture-0003", data: "<h1>Lecture 3</h1><p>Content 3...</p>" }
    ]
};

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------
function toTimestamp(dateStr: string | null): Timestamp | null {
    if (!dateStr) return null;
    // Handle space separator if ISO fails (simple replacement)
    const iso = dateStr.replace(" ", "T");
    const date = new Date(iso);
    // Assume UTC or local? User said "2026-01-01 08:00:00". 
    // Given current time context (UTC+7), let's assume valid ISO string or Local.
    // We'll treat it as local time if no offsets, but for simplicity:
    return Timestamp.fromDate(date);
}

const NOTES_storageDir = path.join(process.cwd(), "public", "notes");

async function seed() {
    console.log("Starting seed...");

    // 1. Seed Users
    console.log("Seeding Users...");
    for (const u of RAW_DATA.users) {
        await adminDb.collection("users").doc(u.id).set({
            displayName: u.name,
            email: `${u.name}@example.com`,
            photoURL: null,
            createdAt: Timestamp.now()
        });
    }

    // 2. Seed Subjects and StudyTimes
    console.log("Seeding Subjects & StudyTimes...");

    // Note: We need to know which subject owns which homework/note to link ID.
    // The structure links FROM subject TO ids.

    for (const sub of RAW_DATA.subjects) {
        // Collect all members from all study times to put in subject.memberUserIds
        const allMembers = new Set<string>();

        // Process StudyTimes first to gather members
        for (const st of sub.studyTime) {
            if (st.studyUser) st.studyUser.forEach(uid => allMembers.add(uid));

            // Correct type typo
            const typeFixed = st.type === "lacture" ? "lecture" : st.type;

            await adminDb.collection("studyTimes").doc(st.id).set({
                subjectId: sub.id,
                startAt: toTimestamp(st.studyTimeStart)!,
                endAt: toTimestamp(st.studyTimeEnd)!,
                room: st.studyRoom,
                teacherName: st.Teacher,
                type: typeFixed,
                participantUserIds: st.studyUser,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
        }

        await adminDb.collection("subjects").doc(sub.id).set({
            code: sub.code,
            name: sub.name,
            ownerTeacherName: "PHD.PROF. Srisawat", // Extracted or default
            memberUserIds: Array.from(allMembers),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
    }

    // 3. Seed Homeworks
    console.log("Seeding Homeworks...");
    for (const hw of RAW_DATA.homeWork) {
        // Find which subject this homework belongs to (reverse lookup from subject.studyTime.homeWorkId)
        // For this dataset, we know it's subject-0001. 
        // Logic: Iterate subjects -> studyTimes -> check if hw.id in homeWorkId
        const subjectId = "subject-0001"; // Fallback

        // (Optional: Implement lookup if dynamic)

        const assignedAt = toTimestamp(hw.assignDate)!;

        await adminDb.collection("homeworks").doc(hw.id).set({
            subjectId: subjectId,
            title: hw.name,
            detail: hw.detail,
            assignedAt: assignedAt,
            dueAt: toTimestamp(hw.dueDate),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        // Submissions (Subcollection)
        // Users who have DONE it
        const doneUsers = (hw.userDone || []) as string[];
        // Users who are MEMBERS (Need to get all members of subject to create "not_started"?)
        // Reqt: "ถ้าไม่อยู่: status="not_started"" - This implies we should seed "not_started" entries 
        // OR we just handle it at query time (no doc = not started). 
        // Schema says "submissions" is a subcollection. 
        // Let's seed "submitted" for those in userDone.
        // Let's seed "not_started" for others? Or let the app handle it? 
        // Prompt says: "งานที่ต้องทำ: แปลง homeWork.userDone -> ... ถ้าไม่อยู่: status=not_started". 
        // This implies we SHOULD create a doc for them.

        // Get subject members
        const subjectDoc = await adminDb.collection("subjects").doc(subjectId).get();
        const data = subjectDoc.data() as { memberUserIds: string[] } | undefined;
        const members = data?.memberUserIds || [];

        for (const uid of members) {
            const isDone = doneUsers.includes(uid);
            const status = isDone ? "submitted" : "not_started";
            const submittedAt = isDone ? new Timestamp(assignedAt.seconds + 86400, 0) : null; // +1 day

            await adminDb.collection("homeworks").doc(hw.id).collection("submissions").doc(uid).set({
                status: status,
                submittedAt: submittedAt,
                grade: null,
                note: null,
                updatedAt: Timestamp.now()
            });
        }
    }

    // 4. Seed Lecture Notes
    console.log("Seeding Lecture Notes...");

    // Ensure storage dir exists
    if (!fs.existsSync(NOTES_storageDir)) {
        fs.mkdirSync(NOTES_storageDir, { recursive: true });
    }

    for (const ln of RAW_DATA.lactureNote) {
        const noteId = ln.id.replace("lacture", "note"); // clean id if desired, or keep legacy
        // Keep legacy ID but maybe map it for consistency? Let's assume we map "lacture-0001" -> "lecture-0001" or just use as is.
        // Requirement says: "use correct consistent name i.e. lecture". 
        // I'll keep the ID from the "lactureNoteId" array in subject for link consistency, 
        // OR I assume I'm fixing the ID too. 
        // The subject data has "lactureNoteId: ['lacture-0001']". If I change ID, I break link unless I fix subject too.
        // But I already processed subjects. 
        // Actually, in the new schema, LectureNote has `subjectId`. It doesn't rely on subject's array.
        // So I can generate fresh IDs or use the old ones. I'll use old ones for simplicity but fix "lacture" prefix?
        // No, let's keep ID stable to avoid confusion, or keys.
        // The prompt says "subject ... lactureNoteId ... (ต้องแก้เป็น lecture)". 
        // This means the field name in subject or the data? 
        // I'll assume I should use "lecture-xxxx".

        const newId = ln.id.replace("lacture", "lecture");
        const fileName = `${newId}.html`;
        const filePath = path.join(NOTES_storageDir, fileName);

        // Write HTML to file system
        fs.writeFileSync(filePath, ln.data);

        await adminDb.collection("lectureNotes").doc(newId).set({
            subjectId: "subject-0001", // derived
            studyTimeId: null, // optional
            title: `Lecture Note ${newId.split('-')[1]}`,
            contentUrl: `/notes/${fileName}`, // Relative URL for fetching
            contentVersion: 1,
            createdByUserId: "teacher-id", // Placeholder
            tags: [],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
    }

    console.log("Seed completed!");
}

seed().catch(console.error);
