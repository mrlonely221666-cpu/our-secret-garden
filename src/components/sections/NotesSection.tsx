import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  text: string;
  rotation: number;
  hue: number;
}

export const NotesSection = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>("romantic_notes", []);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    setNotes([
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        rotation: (Math.random() - 0.5) * 6,
        hue: Math.floor(Math.random() * 40) + 330,
      },
      ...notes,
    ]);
    setText("");
    setAdding(false);
  };

  const remove = (id: string) => setNotes(notes.filter((n) => n.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-gradient-rose">Notes</h2>
          <p className="text-muted-foreground text-sm">Petites pensées éphémères</p>
        </div>
        <Button onClick={() => setAdding(true)} className="bg-gradient-rose text-primary-foreground hover:opacity-90 shadow-glow-soft">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle note
        </Button>
      </div>

      {adding && (
        <div className="romantic-card p-6 space-y-4 animate-scale-in">
          <Textarea
            placeholder="Une pensée pour toi…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="font-script text-xl"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setAdding(false); setText(""); }}>Annuler</Button>
            <Button onClick={add} className="bg-gradient-rose text-primary-foreground">Coller la note</Button>
          </div>
        </div>
      )}

      {notes.length === 0 && !adding && (
        <div className="romantic-card p-12 text-center">
          <p className="font-script text-2xl text-muted-foreground">Le tableau est vide…</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {notes.map((n) => (
          <div
            key={n.id}
            className="group relative aspect-square p-4 shadow-romantic transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-10"
            style={{
              background: `linear-gradient(135deg, hsl(${n.hue} 80% 88%) 0%, hsl(${(n.hue + 10) % 360} 75% 80%) 100%)`,
              transform: `rotate(${n.rotation}deg)`,
              borderRadius: "4px 16px 4px 16px",
            }}
          >
            <p className="font-script text-lg sm:text-xl text-plum leading-snug whitespace-pre-wrap break-words">
              {n.text}
            </p>
            <button
              onClick={() => remove(n.id)}
              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-plum/80 text-white hover:bg-plum transition-all"
              aria-label="Supprimer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
