
"use client";

import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, BookOpen, ClipboardList } from 'lucide-react';
import Link from 'next/link';

type CalendarEvent = {
    id: string;
    title: string;
    date: Date;
    type: 'class' | 'homework';
    color: string;
    subjectId: string;
};

interface CalendarViewProps {
    events: CalendarEvent[];
}

export default function CalendarView({ events }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "MMMM yyyy";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getEventsForDay = (day: Date) => {
        return events.filter(event => isSameDay(event.date, day));
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <h2 className="text-2xl font-bold">{format(currentMonth, dateFormat)}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                    const dayEvents = getEventsForDay(day);
                    const isOutsideMonth = !isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={idx}
                            className={`min-h-[140px] p-2 border-r border-b border-gray-100 transition-colors hover:bg-gray-50/50 relative ${isOutsideMonth ? 'bg-gray-50/30' : ''
                                }`}
                        >
                            <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full mb-1 ${isToday
                                ? 'bg-blue-600 text-white shadow-md'
                                : isOutsideMonth ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                {format(day, 'd')}
                            </span>

                            <div className="space-y-1 mt-1">
                                {dayEvents.map(event => (
                                    <Link
                                        key={event.id}
                                        href={`/subjects/${event.subjectId}`}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 truncate shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${event.type === 'class'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                            : 'bg-orange-50 text-orange-700 border border-orange-100'
                                            }`}
                                    >
                                        {event.type === 'class' ? <BookOpen size={10} /> : <ClipboardList size={10} />}
                                        {event.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
