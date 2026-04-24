import { useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Upload, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Photo {
  id: string;
  src: string; // base64 data URL
  name: string;
}

const fileToDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export const GallerySection = () => {
  const [photos, setPhotos] = useLocalStorage<Photo[]>("romantic_photos", []);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    const newPhotos: Photo[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`${file.name} est trop lourde (max 4 Mo)`);
        continue;
      }
      try {
        const src = await fileToDataURL(file);
        newPhotos.push({ id: crypto.randomUUID(), src, name: file.name });
      } catch {
        toast.error(`Impossible de lire ${file.name}`);
      }
    }
    if (newPhotos.length) {
      setPhotos([...newPhotos, ...photos]);
      toast.success(`${newPhotos.length} photo(s) ajoutée(s) ✨`);
    }
  };

  const remove = (id: string) => setPhotos(photos.filter((p) => p.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl text-gradient-rose">Galerie</h2>
          <p className="text-muted-foreground text-sm">Nos instants figés dans la lumière</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} className="bg-gradient-rose text-primary-foreground hover:opacity-90 shadow-glow-soft">
          <Upload className="w-4 h-4 mr-2" /> Ajouter des photos
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

      {photos.length === 0 && (
        <div className="romantic-card p-12 text-center">
          <p className="font-script text-2xl text-muted-foreground">Aucun souvenir partagé pour l'instant 🖼️</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-romantic cursor-pointer"
            onClick={() => setLightbox(p)}
          >
            <img src={p.src} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <button
              onClick={(e) => { e.stopPropagation(); remove(p.id); }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-all"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-foreground hover:text-rose-glow">
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.name}
            className="max-w-full max-h-[90vh] rounded-2xl shadow-glow-rose animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
