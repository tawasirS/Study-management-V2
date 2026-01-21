"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calendar, FileText } from "lucide-react";

const links = [
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/homeworks", label: "Homeworks", icon: Calendar },
    { href: "/lecture-notes", label: "Lecture Notes", icon: FileText },
];

export default function NavbarClient() {
    const pathname = usePathname();

    return (
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
    );
}
