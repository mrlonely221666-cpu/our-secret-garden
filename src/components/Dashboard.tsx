import { useState } from "react";
import { Mail, StickyNote, Image as ImageIcon, Music, LogOut } from "lucide-react";
import { LettersSection } from "@/components/sections/LettersSection";
import { NotesSection } from "@/components/sections/NotesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { MusicSection } from "@/components/sections/MusicSection";
import { LoveCounter } from "@/components/LoveCounter";
import { SecretMessage } from "@/components/SecretMessage";
import { Ornament } from "@/components/Ornament";

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
      <header className="container max-w-6xl pt-10 pb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <p className="font-calligraphy text-2xl text-gold-bright leading-none">~ bienvenue ~</p>
          <h1 className="font-display italic text-4xl sm:text-5xl lg:text-6xl text-gradient-rose-gold leading-tight">
            Notre jardin secret
          </h1>
          <p className="font-script text-lg text-rose-glow/80">Un espace rien qu'à nous deux ♥</p>
        </div>
        <button
          onClick={onLock}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-rose-glow transition-colors px-4 py-2 rounded-full border border-border hover:border-rose/40"
        >
          <LogOut className="w-4 h-4" /> Verrouiller
        </button>
      </header>

      <div className="container max-w-6xl mb-6">
        <Ornament className="max-w-md mx-auto mb-6" />
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
                className={`flex-1 min-w-fit px-4 py-3 rounded-xl font-display text-base sm:text-lg transition-all duration-500 flex items-center justify-center gap-2 ${
                  active
                    ? "bg-gradient-rose-gold text-primary-foreground shadow-glow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
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

      <footer className="container max-w-6xl py-10 text-center space-y-3">
        <Ornament className="max-w-xs mx-auto" />
        <p className="font-calligraphy text-3xl text-gradient-rose-gold">Fait avec amour ♥</p>
      </footer>
    </div>
  );
};
