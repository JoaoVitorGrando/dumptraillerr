"use client";

import { useState } from "react";
import { DEMO_FLEET } from "@/data/demo";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function OwnerAvailabilityPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedTrailer, setSelectedTrailer] = useState(DEMO_FLEET[0].id);
  const [blockedDays, setBlockedDays] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function toggleDay(day: number) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setBlockedDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSaved(false);
  }

  function isDayBlocked(day: number) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return blockedDays.has(key);
  }

  function isDayPast(day: number) {
    const d = new Date(year, month, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    setSaved(false);
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    setSaved(false);
  }

  function handleSave() {
    // TODO: POST para Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Availability</h1>
        <p className="text-brand-gray mt-1 text-sm">
          Block dates when a trailer is unavailable. Click a day to toggle.
        </p>
      </div>

      {/* Trailer selector */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
          Trailer
        </label>
        <div className="flex flex-wrap gap-2">
          {DEMO_FLEET.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setSelectedTrailer(t.id); setSaved(false); }}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                selectedTrailer === t.id
                  ? "bg-brand-dark text-white border-brand-dark"
                  : "bg-white text-brand-dark border-gray-200 hover:border-gray-300"
              }`}
            >
              {t.name} ({t.size})
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-md">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button type="button" onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-brand-gray">
            ←
          </button>
          <p className="font-bold text-brand-dark">
            {MONTHS[month]} {year}
          </p>
          <button type="button" onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-brand-gray">
            →
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-brand-gray py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Blank cells before first day */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const past = isDayPast(day);
            const blocked = isDayBlocked(day);
            return (
              <button
                key={day}
                type="button"
                disabled={past}
                onClick={() => toggleDay(day)}
                className={`aspect-square rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
                  past
                    ? "text-gray-300 cursor-not-allowed"
                    : blocked
                    ? "bg-red-100 text-red-600 border border-red-200"
                    : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-100"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs text-brand-gray">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-100 border border-green-200 inline-block" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />
            Blocked
          </span>
        </div>
      </div>

      {/* Save */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="btn-primary"
        >
          Save Availability
        </button>
        {saved && (
          <span className="text-sm text-green-700 font-medium">✅ Saved!</span>
        )}
        {blockedDays.size > 0 && (
          <span className="text-xs text-brand-gray">{blockedDays.size} days blocked</span>
        )}
      </div>
    </div>
  );
}
