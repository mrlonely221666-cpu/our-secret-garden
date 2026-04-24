import { useState } from "react";
import { Mail, StickyNote, Image as ImageIcon, Music, LogOut } from "lucide-react";
import { LettersSection } from "@/components/sections/LettersSection";
import { NotesSection } from "@/components/sections/NotesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { MusicSection } from "@/components/sections/MusicSection";
import { LoveCounter } from "@/components/LoveCounter";
import { SecretMessage } from "@/components/SecretMessage";

type Tab = "letters" | "notes" | "gallery" | "music";

const TABS: Array<{ id: Tab; label: string; icon: typeof Mail; emoji: string }> = [
  { id: "letters", label: "Lettres", icon: Mail, emoji: "💌" },
  { id: "notes", label: "Notes", icon: StickyNote, emoji: "📝" },
  { id: "gallery", label: "Galerie", icon: ImageIcon, emoji: "🖼️" },
  { id: "music", label: "Musique", icon: Music, emoji: "🎵" },
];

interface DashboardProps {
  onLock: () => void;
}

export const Dashboard = ({ onLock }: DashboardProps) => {
  const [tab, setTab] = useState<Tab>("letters");

  return (
    <div className="relative z-10 min-h-screen">
      <header className="container max-w-6xl pt-8 pb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-gradient-rose">Notre jardin secret</h1>
          <p className="font-script text-lg text-muted-foreground">Un espace rien qu'à nous deux ♥</p>
        </div>
        <button
          onClick={onLock}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-glow transition-colors"
        >
          <LogOut className="w-4 h-4" /> Verrouiller
        </button>
      </header>

      <div className="container max-w-6xl mb-6">
        <LoveCounter />
      </div>

      {/* Tabs */}
      <nav className="container max-w-6xl">
        <div className="romantic-card p-2 flex gap-1 sm:gap-2 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 min-w-fit px-4 py-3 rounded-xl font-display text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  active
                    ? "bg-gradient-rose text-primary-foreground shadow-glow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="hidden sm:inline">{t.label}</span>
                <Icon className="w-4 h-4 sm:hidden" />
              </button>
            );
          })}
        </div>
      </nav>

      <main className="container max-w-6xl py-8">
        {tab === "letters" && <LettersSection />}
        {tab === "notes" && <NotesSection />}
        {tab === "gallery" && <GallerySection />}
        {tab === "music" && <MusicSection />}
      </main>

      <SecretMessage />

      <footer className="container max-w-6xl py-8 text-center">
        <p className="font-script text-rose-glow/70 text-lg">Fait avec ♥</p>
      </footer>
    </div>
  );
};
