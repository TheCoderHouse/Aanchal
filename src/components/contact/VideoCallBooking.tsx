"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { useUI } from "@/store/ui";

const slots = ["11:00 am", "12:30 pm", "3:00 pm", "4:30 pm", "6:00 pm", "7:30 pm"];
const languages = ["English", "Hindi", "Tamil", "Bengali", "Marathi"];

/** The next six days, built on the client so server and browser agree. */
function nextDays() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      key: d.toDateString(),
      weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });
}

export function VideoCallBooking() {
  const mounted = useMounted();
  const toast = useUI((s) => s.toast);
  const days = mounted ? nextDays() : [];
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [language, setLanguage] = useState(languages[0]);
  const [booked, setBooked] = useState(false);
  const chosen = days.find((d) => d.key === day);

  return (
    <div className="border border-gold-500/20 bg-wine-950 p-6 md:p-10">
      <AnimatePresence mode="wait">
        {booked && chosen ? (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center">
            <CalendarCheck size={36} className="mx-auto text-gold-300" strokeWidth={1.3} />
            <p className="mt-5 font-display text-3xl text-ivory-50">You&apos;re booked</p>
            <p className="mt-2 text-sm text-ivory-100/60">
              {chosen.weekday} {chosen.day} {chosen.month} at {slot}, in {language}. We&apos;ll send the video link on WhatsApp.
            </p>
            <Button variant="ghost" className="mt-6" onClick={() => setBooked(false)}>
              Change booking
            </Button>
          </motion.div>
        ) : (
          <motion.div key="pick" exit={{ opacity: 0 }}>
            <p className="eyebrow flex items-center gap-2">
              <Video size={13} /> Free · 30 minutes
            </p>
            <h2 className="mt-3 font-display text-4xl text-ivory-50">Book a video call</h2>
            <p className="mt-2 max-w-md text-sm text-ivory-100/55">
              A stylist will show you sarees up close, drape them live and help you choose.
            </p>

            <p className="mb-3 mt-8 text-xs uppercase tracking-[0.2em] text-ivory-100/50">Day</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {days.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDay(d.key)}
                  aria-pressed={day === d.key}
                  className={cn(
                    "border py-3 text-center transition",
                    day === d.key ? "border-gold-400 bg-gold-400/10" : "border-ivory-100/15 hover:border-ivory-100/35",
                  )}
                >
                  <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-ivory-100/50">{d.weekday}</span>
                  <span className="block font-display text-2xl text-ivory-50">{d.day}</span>
                  <span className="block text-[0.6rem] text-ivory-100/40">{d.month}</span>
                </button>
              ))}
            </div>

            <p className="mb-3 mt-6 text-xs uppercase tracking-[0.2em] text-ivory-100/50">Time</p>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  aria-pressed={slot === s}
                  className={cn(
                    "border px-4 py-2 text-xs transition",
                    slot === s ? "border-gold-400 bg-gold-400/10 text-gold-200" : "border-ivory-100/15 text-ivory-100/60 hover:text-ivory-100",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <label htmlFor="call-language" className="mb-3 mt-6 block text-xs uppercase tracking-[0.2em] text-ivory-100/50">
              Language
            </label>
            <select
              id="call-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full appearance-none border-0 border-b border-ivory-100/20 bg-transparent pb-2 text-ivory-50 outline-none focus:border-gold-400 sm:w-64"
            >
              {languages.map((l) => (
                <option key={l} className="bg-wine-950">
                  {l}
                </option>
              ))}
            </select>

            <Button
              size="lg"
              className="mt-8 flex"
              disabled={!day || !slot}
              onClick={() => {
                setBooked(true);
                toast("Video call booked", "The link will arrive on WhatsApp");
              }}
            >
              Confirm booking
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
