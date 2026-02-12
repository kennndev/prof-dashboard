'use client'

import Link from 'next/link'
import { ArrowLeft, Scissors, AlertTriangle, CheckCircle, Ruler } from 'lucide-react'

export default function BleedGuidePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Designer
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Print Prep Guide: Understanding Bleed</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        To ensure your cards look professional and have borderless printing, you must include <span className="font-bold text-blue-600 dark:text-blue-400">bleed</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
                    {/* Visual Diagram */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                        <h3 className="text-xl font-bold mb-6 text-center">Standard Card Dimensions</h3>

                        <div className="relative w-[280px] h-[392px] flex items-center justify-center">
                            {/* Bleed Area */}
                            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 border-2 border-dashed border-blue-500 rounded-lg flex flex-col justify-between p-2">
                                <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 text-center bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow self-center -mt-3">Bleed Line (66.8mm x 91.8mm)</span>
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 text-center mb-1">Make sure artwork fills this entire area!</span>
                            </div>

                            {/* Cut Line */}
                            <div className="absolute w-[252px] h-[352px] border-2 border-red-500 rounded-lg flex flex-col justify-between p-1 z-10">
                                <span className="text-[10px] sm:text-xs font-bold text-red-600 dark:text-red-400 text-center bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow self-center -mt-3">Cut Line (63mm x 88mm)</span>
                            </div>

                            {/* Safe Zone */}
                            <div className="absolute w-[228px] h-[328px] border-2 border-dotted border-green-500 rounded-lg z-20 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-[10px] sm:text-xs font-bold text-green-600 dark:text-green-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow">Safe Zone</span>
                                    <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 max-w-[150px] mx-auto bg-white/80 dark:bg-slate-900/80 p-1 rounded">Keep important text inside this box</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-2 w-full text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/40 border border-blue-500"></div>
                                <span><span className="font-bold">Bleed Area (+1.9mm):</span> This part gets cut off, but ensures no white edges.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-red-500"></div>
                                <span><span className="font-bold">Cut Line (Standard):</span> Where the blade actually cuts.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-dotted border-green-500"></div>
                                <span><span className="font-bold">Safe Zone (-2mm):</span> Keep text away from edges to avoid being cut off.</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-l-4 border-blue-600 shadow-sm">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-blue-600" />
                                The 1.9mm Rule
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Standard trading cards are <strong>63mm x 88mm</strong>. However, printing presses can shift slightly (up to 1-2mm).
                                To prevent white slivers on the edge of your card, you must provide artwork that is <strong>66.8mm x 91.8mm</strong>.
                                This extra 1.9mm on each side is called "bleed".
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-l-4 border-amber-500 shadow-sm">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <Scissors className="w-5 h-5 text-amber-500" />
                                Use "Corner Trim"
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                Most digital card images come with sharp corners or black/white rounded corners.
                                Using our <strong>Corner Trim</strong> slider helps you:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 ml-1">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Remove existing white/black rounded corners</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Expand the inner artwork to fill the bleed area</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span><strong>Important:</strong> Check EVERY card after uploading to ensure the corners are without defects. Adjust individually if needed.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-bold text-lg mb-2">Checklist for Success:</h3>
                            <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300 ml-2">
                                <li className="pl-2">Upload images</li>
                                <li className="pl-2">Click <strong>"Add Bleed"</strong> in Print Prep</li>
                                <li className="pl-2">Adjust <strong>"Corner Trim"</strong> until white corners disappear</li>
                                <li className="pl-2">Click <strong>"Apply to All Cards"</strong></li>
                                <li className="pl-2 font-bold text-blue-600 dark:text-blue-400">Cycle through your deck and verify each card!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
