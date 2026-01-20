# System Improvement Roadmap (Phase 2)

Based on the current implementation of user management and personalized views, here are proposed areas for improvement to elevate the user experience.

## Proposed Changes

### 1. Intelligence & Dashboard
Add a dedicated "Overview" section on the Home page to provide immediate value.
- **Next Session Countdown**: A card showing "Next: CS101 in 45 minutes" (calculated from current time).
- **Weekly Stats**: A summary of study hours attended and homework completion rates for the current user.
- **Urgent Task Carousel**: A focused list of homework due within 48 hours.

### 2. Deep Connectivity
Strengthen the relationship between different entities.
- **Note-to-Session Linking**: Allow users to click "Start Note" directly from a StudyTime session, automatically linking the note to that specific date/time.
- **Suggested Reading**: In Homework details, show links to Lecture Notes that were created around the same time as the assignment.

### 3. Advanced Management Features
- **Grade & Achievement Tracker**: Add fields for scores in Homework and Exams. Calculate a projected GPA or "Subject Mastery" score.
- **Global Search**: A command bar (Ctrl+K) to quickly search through all Subject names, Note content, and Homework titles.
- **Search & Filter**: More granular filters in the Homeworks page (e.g., filter by "Urgent", "Needs Grading").

### 4. Customization & UI Polish
- **Subject Branding**: Allow users to choose a color or icon for each subject (e.g., Physics = Purple, Math = Blue).
- **Dark Mode**: Implement a sleek dark theme for late-night study sessions.
- **Real-time Updates**: (Advanced) Use Firebase listeners to update the UI instantly when another user adds a session or marker.

## Verification Plan

### Automated Tests
- None planned for this phase yet.

### Manual Verification
- Verify time calculation for "Next Session" by adding a session near the current time.
- Verify search functionality across multiple types of data.
- Test theme toggle behavior.
