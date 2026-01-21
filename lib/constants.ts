
export const APP_NAME = "StudyFlow";
export const USER_COOKIE_NAME = "app_user_id";

export const CURRENT_USER_ID = "guest"; // Legacy, we'll use cookies

// Users are now fetched from Firebase using the getUsers() function from db.ts
// See: lib/db.ts - getUsers()
export const USERS = [
    { id: "all", name: "Combined View (รวม)" },
];
