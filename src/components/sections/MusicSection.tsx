import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Play, Pause, SkipForward, SkipBack, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Track {
  id: string;
  name: string;
  path: string;
  url: string;
}

export const MusicSection = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = currentIdx !== null ? tracks[currentIdx] : null;

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast.error("Erreur de chargement");
      setLoading(false);
      return;
    }
    const withUrls: Track[] = (data ?? []).map((t) => {
      const { data: pub } = supabase.storage.from("tracks").getPublicUrl(t.path);
      return { id: t.id, name: t.name, path: t.path, url: pub.publicUrl };
    });
    setTracks(withUrls);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!audioRef.current || !current) return;
    audioRef.current.src = current.url;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [current?.id]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
    else audioRef.current.pause();
  }, [playing]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let added = 0;
    for (const file of Array.from(files)) {
      const isMp3 = file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3");
      if (!isMp3) {
        toast.error(`${file.name} : MP3 uniquement`);
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 50 Mo`);
        continue;
      }
      const path = `${crypto.randomUUID()}.mp3`;
      const { error: upErr } = await supabase.storage.from("tracks").upload(path, file, {
        contentType: "audio/mpeg",
        upsert: false,
      });
      if (upErr) {
        toast.error(`Erreur upload ${file.name}`);
        continue;
      }
      const cleanName = file.name.replace(/\.mp3$/i, "");
      const { error: insErr } = await supabase
        .from("tracks")
        .insert({ name: cleanName, path });
      if (insErr) {
        await supabase.storage.from("tracks").remove([path]);
        toast.error(`Erreur enregistrement ${file.name}`);
        continue;
      }
      added++;
    }
    setUploading(false);
    if (added > 0) {
      toast.success(`${added} musique(s) sauvegardée(s) dans le cloud 🎵`);
      load();
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

  const remove = async (t: Track) => {
    const idx = tracks.findIndex((x) => x.id === t.id);
    await supabase.storage.from("tracks").remove([t.path]);
    await supabase.from("tracks").delete().eq("id", t.id);
    const next = tracks.filter((x) => x.id !== t.id);
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
          <p className="font-calligraphy text-xl text-gold-bright leading-none">~ notre playlist ~</p>
          <h2 className="font-display italic text-3xl sm:text-4xl text-gradient-rose-gold">Musique</h2>
          <p className="text-muted-foreground text-sm mt-1">Sauvegardée dans le cloud, accessible partout ☁️</p>
        </div>
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="bg-gradient-rose-gold text-primary-foreground hover:opacity-95 shadow-glow-soft hover:shadow-glow-gold transition-all"
        >
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {uploading ? "Envoi…" : "Ajouter MP3"}
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
          <div className="w-14 h-14 rounded-full bg-gradient-rose-gold flex items-center justify-center shadow-glow-soft animate-glow-pulse text-2xl">
            ♥
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display italic text-lg truncate">{current.name}</p>
            <p className="text-xs text-muted-foreground">{playing ? "En lecture…" : "En pause"}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={prev}><SkipBack className="w-5 h-5" /></Button>
            <Button
              size="icon"
              onClick={() => setPlaying((p) => !p)}
              className="bg-gradient-rose-gold text-primary-foreground rounded-full h-12 w-12"
            >
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={next}><SkipForward className="w-5 h-5" /></Button>
          </div>
        </div>
      )}

      <audio ref={audioRef} onEnded={next} preload="auto" />

      {loading && (
        <div className="romantic-card p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-glow" />
        </div>
      )}

      {!loading && tracks.length === 0 && (
        <div className="romantic-card p-12 text-center">
          <p className="font-calligraphy text-4xl text-gradient-rose-gold mb-2">∼</p>
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
              onClick={() => remove(t)}
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
