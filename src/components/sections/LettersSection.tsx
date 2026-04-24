import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Letter {
  id: string;
  title: string;
  content: string;
  date: string;
}

export const LettersSection = () => {
  const [letters, setLetters] = useLocalStorage<Letter[]>("romantic_letters", []);
  const [adding, setAdding] = useState(false);
  const [opened, setOpened] = useState<Letter | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addLetter = () => {
    if (!title.trim() || !content.trim()) return;
    setLetters([
      { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), date: new Date().toISOString() },
      ...letters,
    ]);
    setTitle("");
    setContent("");
    setAdding(false);
  };

  const remove = (id: string) => setLetters(letters.filter((l) => l.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-calligraphy text-xl text-gold-bright leading-none">~ mes mots pour toi ~</p>
          <h2 className="font-display italic text-3xl sm:text-4xl text-gradient-rose-gold">Lettres d'amour</h2>
          <p className="text-muted-foreground text-sm mt-1">Mots du cœur à garder pour toujours</p>
        </div>
        <Button onClick={() => setAdding(true)} className="bg-gradient-rose-gold text-primary-foreground hover:opacity-90 shadow-glow-rose">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle lettre
        </Button>
      </div>

      {adding && (
        <div className="romantic-card p-6 space-y-4 animate-scale-in">
          <Input placeholder="Titre de la lettre…" value={title} onChange={(e) => setTitle(e.target.value)} className="font-display text-lg" />
          <Textarea placeholder="Écris tes mots ici…" value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="font-script text-lg leading-relaxed" />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setAdding(false)}>Annuler</Button>
            <Button onClick={addLetter} className="bg-gradient-rose-gold text-primary-foreground">Sceller la lettre</Button>
          </div>
        </div>
      )}

      {letters.length === 0 && !adding && (
        <div className="romantic-card p-12 text-center">
          <p className="font-calligraphy text-4xl text-gradient-rose-gold mb-2">∼</p>
          <p className="font-script text-2xl text-muted-foreground">Aucune lettre encore… écris la première 💌</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {letters.map((l) => (
          <div
            key={l.id}
            className="group relative cursor-pointer"
            onClick={() => setOpened(l)}
          >
            <div className="bg-gradient-letter rounded-2xl p-6 shadow-letter transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1deg] group-hover:shadow-glow-rose aspect-[4/3] flex flex-col relative overflow-hidden">
              {/* Decorative corner ornament */}
              <div className="absolute top-0 left-0 w-16 h-16 opacity-20" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <path d="M0 0 L 64 0 L 0 64 Z" fill="hsl(var(--gold))" />
                </svg>
              </div>
              {/* Wax seal */}
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-rose to-rose-deep flex items-center justify-center shadow-lg border-2 border-rose-glow/40 rotate-12">
                <span className="text-starlight font-display italic text-lg">♥</span>
              </div>
              <h3 className="font-display italic text-2xl text-plum-deep mb-2 pr-8 mt-2">{l.title}</h3>
              <p className="font-script text-plum/80 text-lg line-clamp-3 flex-1">{l.content}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-plum/10">
                <span className="text-plum/40 text-xs">✦</span>
                <p className="text-xs text-plum/60 italic font-display">{new Date(l.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(l.id); }}
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-all"
                aria-label="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {opened && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setOpened(null)}
        >
          <div
            className="bg-gradient-letter rounded-3xl p-8 sm:p-12 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-glow-rose animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setOpened(null)} className="absolute top-4 right-4 text-plum hover:text-rose">
              <X className="w-6 h-6" />
            </button>
            <p className="text-center text-rose text-3xl mb-4">♥</p>
            <h3 className="font-display text-4xl text-plum text-center mb-2">{opened.title}</h3>
            <p className="text-center text-xs text-plum/50 mb-6">{new Date(opened.date).toLocaleDateString("fr-FR")}</p>
            <p className="font-script text-2xl text-plum leading-relaxed whitespace-pre-wrap">{opened.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};
