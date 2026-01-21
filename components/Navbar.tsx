
import Link from "next/link";
import { BookOpen, Calendar, FileText, Home } from "lucide-react";
import UserSelector from "./UserSelector";
import { getUsers } from "@/lib/db";
import NavbarClient from "./NavbarClient";

export async function Navbar() {
    const users = await getUsers();

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
                    <Home size={24} />
                    <span>StudyFlow</span>
                </Link>
                <NavbarClient />
                <div className="flex items-center gap-4">
                    <UserSelector allUsers={users} />
                </div>
            </div>
        </nav>
    );
}