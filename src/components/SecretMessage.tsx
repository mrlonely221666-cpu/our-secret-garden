import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Sparkles, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const SecretMessage = () => {
  const [message, setMessage] = useLocalStorage<string>("romantic_secret", "");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message);

  return (
    <>
      <button
        onClick={() => { setOpen(true); setDraft(message); }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-rose shadow-glow-rose flex items-center justify-center hover:scale-110 transition-transform animate-float"
        aria-label="Message secret"
      >
        <Sparkles className="w-6 h-6 text-primary-foreground" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-start sm:items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => { setOpen(false); setEditing(false); }}
        >
          <div
            className="romantic-card p-6 sm:p-8 max-w-lg w-full my-8 animate-scale-in relative max-h-[calc(100vh-4rem)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setOpen(false); setEditing(false); }}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-velvet-deep/60 hover:bg-velvet-deep text-muted-foreground hover:text-rose-glow flex items-center justify-center transition-all"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4 shrink-0">
              <Sparkles className="w-8 h-8 mx-auto text-rose-glow mb-2" />
              <h3 className="font-display text-3xl text-gradient-rose">Message secret</h3>
            </div>

            {editing || !message ? (
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={6}
                  placeholder="Un secret rien que pour nous…"
                  className="font-script text-xl flex-1 min-h-[160px]"
                  autoFocus
                />
                <div className="flex gap-2 shrink-0">
                  {message && (
                    <Button
                      variant="ghost"
                      onClick={() => { setEditing(false); setDraft(message); }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  )}
                  <Button
                    onClick={() => { setMessage(draft); setEditing(false); }}
                    className="flex-1 bg-gradient-rose text-primary-foreground"
                  >
                    Garder ce secret
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                  <p className="font-script text-2xl text-foreground/90 text-center leading-relaxed whitespace-pre-wrap break-words">
                    {message}
                  </p>
                </div>
                <div className="flex gap-2 mt-6 shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => { setOpen(false); setEditing(false); }}
                    className="flex-1 text-muted-foreground hover:text-rose-glow"
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditing(true)}
                    className="flex-1 text-muted-foreground hover:text-rose-glow"
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
