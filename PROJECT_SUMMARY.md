# StudyFlow Project Summary

StudyFlow is a modern Homework & Study Management System built with Next.js and Firebase. It provides a personalized experience for students to track their schedules, assignments, and lecture notes in an open, collaborative environment.

## 🚀 Current Features

### 📅 Calendar & Scheduling
- **Monthly View**: Interactive calendar on the homepage showing classes and homework deadlines.
- **Personalized Schedule**: Users (User A, B, C) see only the sessions they are participating in.
- **Session Management**: Full CRUD for study sessions (Lecture, Lab, Tutorial, Exam) including duplication and participant assignment.

### 📝 Homework & Coursework
- **Submission Tracking**: Users can mark assignments as "Submitted" or "Undo" individually.
- **Session Linking**: Homework can be linked to specific class sessions to automate participant visibility.
- **Deadline Monitoring**: Visual indicators for urgent and overdue tasks.

### 📓 Lecture Notes
- **Rich Text Editor**: Powered by Tiptap with support for tables, code blocks, and advanced formatting.
- **Maximized Workspace**: Clean, distraction-free writing area with a compact layout.
- **Subject Association**: Notes are grouped by subject and sorted by date.

### 👥 User Management (Open System)
- **Persisted Identity**: User selection is saved in cookies for a seamless experience.
- **Combined View**: Option to view "Everyone's" schedule and assignments in one view (รวม).

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase (Firestore) with `firebase-admin` for server-side operations.
- **UI & Icons**: Vanilla CSS, Tailwind-like utilities, and Lucide React icons.
- **Utilities**: `date-fns` for robust date manipulation.

## 📂 Project Structure
- `/app`: Next.js pages and layouts.
- `/components`: Reusable UI components (Modals, Editor, Calendar).
- `/lib`: Database logic (`db.ts`), server actions (`actions.ts`), and constants.
- `/public`: Static assets.

## 🔗 How to Continue
1.  **Firebase Config**: Ensure `serviceAccount.json` is present or environment variables are set for Vercel.
2.  **Adding Features**: Follow the pattern in `lib/actions.ts` for new server-side logic.
3.  **Phase 2**: Refer to `implementation plan phase 2.md` for suggested next steps.

---
*Created with ❤️ by Antigravity*
