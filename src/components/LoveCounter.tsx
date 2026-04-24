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
      className="romantic-card px-5 py-3 hover:shadow-glow-soft transition-all group"
    >
      <p className="font-script text-rose-glow text-lg leading-tight">
        Ensemble depuis
      </p>
      <p className="font-display text-2xl sm:text-3xl text-gradient-rose">
        {days.toLocaleString("fr-FR")} jours ✨
      </p>
    </button>
  );
};
