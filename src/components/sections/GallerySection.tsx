import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Photo {
  id: string;
  name: string;
  path: string;
  url: string;
}

export const GallerySection = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur de chargement");
      setLoading(false);
      return;
    }

    const withUrls: Photo[] = (data ?? []).map((p) => {
      const { data: pub } = supabase.storage.from("photos").getPublicUrl(p.path);
      return { id: p.id, name: p.name, path: p.path, url: pub.publicUrl };
    });
    setPhotos(withUrls);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let added = 0;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image`);
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 50 Mo`);
        continue;
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("photos").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) {
        toast.error(`Erreur upload ${file.name}`);
        continue;
      }
      const { error: insErr } = await supabase
        .from("photos")
        .insert({ name: file.name, path });
      if (insErr) {
        await supabase.storage.from("photos").remove([path]);
        toast.error(`Erreur enregistrement ${file.name}`);
        continue;
      }
      added++;
    }
    setUploading(false);
    if (added > 0) {
      toast.success(`${added} photo(s) ajoutée(s) ✨`);
      load();
    }
  };

  const remove = async (p: Photo) => {
    await supabase.storage.from("photos").remove([p.path]);
    await supabase.from("photos").delete().eq("id", p.id);
    setPhotos((prev) => prev.filter((x) => x.id !== p.id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-calligraphy text-xl text-gold-bright leading-none">~ nos souvenirs ~</p>
          <h2 className="font-display italic text-3xl sm:text-4xl text-gradient-rose-gold">Galerie</h2>
        </div>
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="bg-gradient-rose-gold text-primary-foreground hover:opacity-95 shadow-glow-soft hover:shadow-glow-gold transition-all"
        >
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {uploading ? "Envoi…" : "Ajouter des photos"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleUpload(e.target.files); e.target.value = ""; }}
        />
      </div>

      {loading && (
        <div className="romantic-card p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-glow" />
        </div>
      )}

      {!loading && photos.length === 0 && (
        <div className="romantic-card p-12 text-center">
          <p className="font-calligraphy text-4xl text-gradient-rose-gold mb-2">∼</p>
          <p className="font-script text-2xl text-muted-foreground">Aucun souvenir partagé pour l'instant 🖼️</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-romantic hover:shadow-elevated transition-all duration-500 cursor-pointer ring-1 ring-gold/10 hover:ring-gold/40"
            onClick={() => setLightbox(p)}
          >
            <img src={p.url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-velvet-deep/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <button
              onClick={(e) => { e.stopPropagation(); remove(p); }}
              className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-all"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div className="absolute top-3 right-3 z-[110] flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const p = lightbox;
                setLightbox(null);
                remove(p);
              }}
              className="p-2 rounded-full bg-velvet-deep/70 text-foreground hover:text-destructive hover:bg-velvet-deep transition-all shadow-romantic"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="p-2 rounded-full bg-velvet-deep/70 text-foreground hover:text-rose-glow hover:bg-velvet-deep transition-all shadow-romantic"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <img
            src={lightbox.url}
            alt={lightbox.name}
            className="max-w-full max-h-[88vh] rounded-2xl shadow-glow-rose animate-scale-in select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
