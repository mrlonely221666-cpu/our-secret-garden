import { useEffect, useState } from "react";

const STORAGE_KEY = "romantic_start_date";

export const LoveCounter = () => {
  const [date, setDate] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || "");
  const [days, setDays] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!date) return;
    const start = new Date(date).getTime();
    const update = () => {
      const diff = Date.now() - start;
      setDays(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, [date]);

  const handleSave = (value: string) => {
    setDate(value);
    localStorage.setItem(STORAGE_KEY, value);
    setEditing(false);
  };

  if (!date || editing) {
    return (
      <div className="romantic-card p-4 flex items-center gap-3">
        <span className="font-script text-lg text-rose-glow">Notre première rencontre :</span>
        <input
          type="date"
          defaultValue={date}
          onChange={(e) => e.target.value && handleSave(e.target.value)}
          className="bg-input border border-border rounded-md px-3 py-1.5 text-sm text-foreground"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="romantic-card w-full px-6 py-5 hover:shadow-glow-rose transition-all group flex items-center justify-center gap-4 sm:gap-6"
    >
      <span className="hidden sm:block text-4xl text-gold animate-glow-pulse">✦</span>
      <div className="text-center">
        <p className="font-calligraphy text-xl text-gold-bright leading-none">~ ensemble depuis ~</p>
        <p className="font-display italic text-3xl sm:text-5xl text-gradient-rose-gold leading-tight">
          {days.toLocaleString("fr-FR")} <span className="font-script not-italic text-2xl sm:text-3xl">jours</span>
        </p>
        <p className="font-script text-rose-glow/70 text-sm">de notre histoire ✨</p>
      </div>
      <span className="hidden sm:block text-4xl text-gold animate-glow-pulse" style={{ animationDelay: "1s" }}>✦</span>
    </button>
  );
};
