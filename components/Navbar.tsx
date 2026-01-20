
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calendar, FileText, Home } from "lucide-react";
import UserSelector from "./UserSelector";

export function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/subjects", label: "Subjects", icon: BookOpen },
        { href: "/homeworks", label: "Homeworks", icon: Calendar },
        { href: "/lecture-notes", label: "Lecture Notes", icon: FileText },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
                    <Home size={24} />
                    <span>StudyFlow</span>
                </Link>
                <div className="flex gap-1 md:gap-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="hidden md:inline">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className="flex items-center gap-4">
                    <UserSelector />
                </div>
            </div>
        </nav>
    );
}
