import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Upload, Trash2, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Track {
  id: string;
  src: string; // data URL
  name: string;
}

const fileToDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export const MusicSection = () => {
  const [tracks, setTracks] = useLocalStorage<Track[]>("romantic_tracks", []);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = currentIdx !== null ? tracks[currentIdx] : null;

  useEffect(() => {
    if (!audioRef.current || !current) return;
    audioRef.current.src = current.src;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [current?.id]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
    else audioRef.current.pause();
  }, [playing]);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    const added: Track[] = [];
    for (const file of Array.from(files)) {
      if (file.type !== "audio/mpeg" && !file.name.toLowerCase().endsWith(".mp3")) {
        toast.error(`${file.name} : MP3 uniquement`);
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 8 Mo`);
        continue;
      }
      try {
        const src = await fileToDataURL(file);
        added.push({ id: crypto.randomUUID(), src, name: file.name.replace(/\.mp3$/i, "") });
      } catch {
        toast.error(`Erreur sur ${file.name}`);
      }
    }
    if (added.length) {
      setTracks([...tracks, ...added]);
      toast.success(`${added.length} musique(s) ajoutée(s) 🎵`);
    }
  };

  const playTrack = (idx: number) => {
    setCurrentIdx(idx);
    setPlaying(true);
  };

  const next = () => {
    if (currentIdx === null || tracks.length === 0) return;
    setCurrentIdx((currentIdx + 1) % tracks.length);
    setPlaying(true);
  };

  const prev = () => {
    if (currentIdx === null || tracks.length === 0) return;
    setCurrentIdx((currentIdx - 1 + tracks.length) % tracks.length);
    setPlaying(true);
  };

  const remove = (id: string) => {
    const idx = tracks.findIndex((t) => t.id === id);
    const next = tracks.filter((t) => t.id !== id);
    setTracks(next);
    if (currentIdx === idx) {
      setPlaying(false);
      setCurrentIdx(null);
    } else if (currentIdx !== null && idx < currentIdx) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-gradient-rose">Musique</h2>
          <p className="text-muted-foreground text-sm">Notre bande-son secrète</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} className="bg-gradient-rose text-primary-foreground hover:opacity-90 shadow-glow-soft">
          <Upload className="w-4 h-4 mr-2" /> Ajouter MP3
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,.mp3"
          multiple
          className="hidden"
          onChange={(e) => { handleUpload(e.target.files); e.target.value = ""; }}
        />
      </div>

      {/* Player */}
      {current && (
        <div className="romantic-card p-6 flex items-center gap-4 animate-scale-in shadow-glow-soft">
          <div className="w-14 h-14 rounded-full bg-gradient-rose flex items-center justify-center shadow-glow-soft animate-glow-pulse text-2xl">
            ♥
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg truncate">{current.name}</p>
            <p className="text-xs text-muted-foreground">{playing ? "En lecture…" : "En pause"}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={prev}><SkipBack className="w-5 h-5" /></Button>
            <Button
              size="icon"
              onClick={() => setPlaying((p) => !p)}
              className="bg-gradient-rose text-primary-foreground rounded-full h-12 w-12"
            >
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={next}><SkipForward className="w-5 h-5" /></Button>
          </div>
        </div>
      )}

      <audio ref={audioRef} onEnded={next} preload="auto" />

      {tracks.length === 0 && (
        <div className="romantic-card p-12 text-center">
          <p className="font-script text-2xl text-muted-foreground">Aucune mélodie pour l'instant 🎶</p>
        </div>
      )}

      <div className="space-y-2">
        {tracks.map((t, idx) => (
          <div
            key={t.id}
            className={`romantic-card p-4 flex items-center gap-3 transition-all hover:shadow-glow-soft ${
              currentIdx === idx ? "border-rose/60" : ""
            }`}
          >
            <button
              onClick={() => (currentIdx === idx ? setPlaying((p) => !p) : playTrack(idx))}
              className="w-10 h-10 rounded-full bg-rose/20 hover:bg-rose/40 flex items-center justify-center transition-all"
            >
              {currentIdx === idx && playing ? <Pause className="w-4 h-4 text-rose-glow" /> : <Play className="w-4 h-4 text-rose-glow ml-0.5" />}
            </button>
            <p className="flex-1 font-body truncate">{t.name}</p>
            <button
              onClick={() => remove(t.id)}
              className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
