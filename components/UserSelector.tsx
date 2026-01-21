
"use client";

import React, { useEffect, useState } from 'react';
import { USER_COOKIE_NAME } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export type User = {
    id: string;
    displayName: string;
};

export default function UserSelector({ allUsers }: { allUsers: User[] }) {
    const [selectedUser, setSelectedUser] = useState<string>("all");
    const router = useRouter();

    // Format users for display
    const users = [
        { id: "all", displayName: "Combined View (รวม)" },
        ...allUsers
    ];

    useEffect(() => {
        const cookies = document.cookie.split('; ');
        const userCookie = cookies.find(row => row.startsWith(`${USER_COOKIE_NAME}=`));
        if (userCookie) {
            setSelectedUser(userCookie.split('=')[1]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedUser(val);
        // Set cookie for 30 days
        document.cookie = `${USER_COOKIE_NAME}=${val}; path=/; max-age=${60 * 60 * 24 * 30}`;
        router.refresh();
    };

    const currentUser = users.find(u => u.id === selectedUser) || users[0];

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
                <select
                    value={selectedUser}
                    onChange={handleChange}
                    className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-blue-600 transition-colors appearance-none text-right"
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.displayName}</option>
                    ))}
                </select>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Status: Active</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100 ring-2 ring-white">
                {currentUser.displayName.charAt(0)}
            </div>
        </div>
    );
}
