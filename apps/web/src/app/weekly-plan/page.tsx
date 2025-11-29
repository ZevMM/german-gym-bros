"use client";

import { Star, ArrowLeft, Calendar, Dumbbell, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WeeklyPlan() {
    const [activeProgram, setActiveProgram] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProgram = async () => {
        try {
            const res = await fetch("http://localhost:8000/active-program", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setActiveProgram(data);
            } else {
                setActiveProgram(null);
            }
        } catch (error) {
            console.error("Failed to fetch active program", error);
            setActiveProgram(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProgram();
    }, []);

    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const handleDelete = async (workoutId: number) => {
        try {
            const res = await fetch(`http://localhost:8000/workout/${workoutId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Refresh data
                fetchProgram();
                setConfirmDeleteId(null);
            } else {
                alert("Failed to delete workout");
            }
        } catch (error) {
            console.error("Error deleting workout", error);
            alert("Error deleting workout");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black/90 p-4 font-sans">
            {/* Mobile Container */}
            <div className="w-full max-w-[400px] bg-[#22281f] rounded-[30px] overflow-hidden shadow-2xl relative h-[850px] flex flex-col text-white border border-[#1a1f18]">

                {/* Header */}
                <header className="px-4 py-4 flex items-center gap-3 pt-12 shrink-0 bg-[#1a1f18] border-b border-white/10">
                    <div className="w-10 h-10 bg-black border border-[#fbbf24] flex items-center justify-center rounded-sm shrink-0">
                        <Star className="text-[#fbbf24] fill-[#fbbf24]" size={20} />
                        <span className="text-[6px] text-white absolute mt-6 font-bold tracking-tighter">U.S.ARMY</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-wide">Weekly Plan</h1>
                        <p className="text-xs text-gray-400">
                            {activeProgram ? activeProgram.name : "No Active Mission"}
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 px-4 overflow-y-auto pb-24 pt-4">

                    {isLoading ? (
                        <div className="flex items-center justify-center h-40 text-gray-400">Loading plan...</div>
                    ) : activeProgram ? (
                        <div className="space-y-6">
                            {/* Program Info */}
                            <div className="bg-[#2a3026] p-4 rounded-xl border border-white/10">
                                <h2 className="font-bold text-lg mb-1">{activeProgram.name}</h2>
                                <p className="text-sm text-gray-400">{activeProgram.description}</p>
                            </div>

                            {/* Weekly Schedule */}
                            <div className="space-y-4">
                                {activeProgram.workouts.map((day: any, index: number) => (
                                    <div key={index} className="bg-[#363d31] rounded-xl p-2 border border-white/5 shadow-sm">
                                        {/* Day Header */}
                                        <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                                            <h3 className="text-[#fbbf24] font-bold text-lg">Day {day.day_number}</h3>
                                            <div className="flex gap-2 items-center h-6">
                                                {confirmDeleteId === day.id ? (
                                                    <>
                                                        <span className="text-[10px] text-red-400 font-bold uppercase mr-1">Sure?</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(day.id);
                                                            }}
                                                            className="text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-2 h-6 flex items-center rounded text-xs font-medium"
                                                            title="Confirm Delete"
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setConfirmDeleteId(null);
                                                            }}
                                                            className="text-gray-400 hover:text-white transition-colors px-2 h-6 flex items-center text-xs font-medium"
                                                            title="Cancel"
                                                        >
                                                            No
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="text-gray-400 hover:text-white transition-colors h-6 w-6 flex items-center justify-center" title="Edit (Coming Soon)">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setConfirmDeleteId(day.id);
                                                            }}
                                                            className="text-gray-400 hover:text-red-500 transition-colors h-6 w-6 flex items-center justify-center"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Day Content */}
                                        <div className="space-y-2">
                                            {day.components.map((comp: any, i: number) => (
                                                <div key={i}>
                                                    {comp.component_type === 'warmup' && comp.data && comp.data.length > 0 && (
                                                        <WarmupSection data={comp.data} />
                                                    )}

                                                    {comp.component_type === 'circuit' && (
                                                        <div className="bg-[#2a3025] rounded-lg p-3">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-white font-medium text-sm">Circuit {comp.order_index}</span>
                                                                <span className="text-xs text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded-full">{comp.data.rounds} Rounds</span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {comp.data.exercises.map((ex: any, eIdx: number) => (
                                                                    <div key={eIdx} className="flex justify-between text-sm">
                                                                        <span className="text-gray-200">{ex.name}</span>
                                                                        <span className="text-white/50"> {ex.reps} reps</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {comp.component_type === 'cardio' && (
                                                        <div className="p-3 bg-[#394d26]/30 rounded-lg border border-[#394d26]">
                                                            <div className="text-[#fbbf24] text-sm font-bold mb-1">CARDIO</div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-white text-sm">{comp.data.type}</span>
                                                                <span className="text-gray-400 text-sm">{comp.data.duration_minutes || comp.data.duration} mins</span>
                                                            </div>
                                                            {comp.data.notes && (
                                                                <div className="text-xs text-white/50 mt-1">{comp.data.notes}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/20 rounded-xl mb-6 p-6 text-center space-y-4">
                            <Dumbbell className="text-gray-500" size={48} />
                            <div>
                                <h3 className="text-lg font-bold text-white">No Active Plan</h3>
                                <p className="text-sm text-gray-400">Your squad needs a mission. Build a new PT plan to get started.</p>
                            </div>
                            <Link href="/build-plan" className="bg-[#fbbf24] hover:bg-[#d9a51f] text-black font-bold py-3 px-6 rounded-xl shadow-lg transition-colors w-full">
                                Build New Plan
                            </Link>
                        </div>
                    )}

                </main>

                {/* Bottom Navigation */}
                <nav className="absolute bottom-0 w-full bg-[#1a1f18] border-t border-white/10 flex">
                    <Link href="/" className="flex-1 py-4 flex flex-col items-center justify-center gap-1 hover:bg-[#2a3026] transition-colors">
                        <span className="text-xs font-medium text-gray-400 leading-tight text-center">Daily<br />Plan</span>
                    </Link>
                    <button className="flex-1 py-4 flex flex-col items-center justify-center gap-1 bg-[#2a3026]">
                        <span className="text-xs font-bold text-white leading-tight text-center">Weekly<br />Plan</span>
                    </button>
                    <Link href="/build-plan" className="flex-1 py-4 flex flex-col items-center justify-center gap-1 hover:bg-[#2a3026] transition-colors">
                        <span className="text-xs font-medium text-gray-400 leading-tight text-center">Build<br />New Plan</span>
                    </Link>
                    <button className="flex-1 py-4 flex flex-col items-center justify-center gap-1 hover:bg-[#2a3026] transition-colors">
                        <span className="text-xs font-medium text-gray-400 leading-tight text-center">Squad<br />Info</span>
                    </button>
                </nav>

            </div>
        </div>
    );
}

function WarmupSection({ data }: { data: string[] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayData = isExpanded ? data : data.slice(0, 3);
    const hasMore = data.length > 3;

    return (
        <div className="bg-[#2a3025] rounded-lg p-3">
            <h4 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">Warmup</h4>
            <div className="space-y-1">
                {displayData.map((w, idx) => (
                    <div key={idx} className="text-sm text-gray-300">{w}</div>
                ))}
            </div>
            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-[#fbbf24] mt-2 hover:underline focus:outline-none"
                >
                    {isExpanded ? "Show less" : `...and ${data.length - 3} more`}
                </button>
            )}
        </div>
    );
}
