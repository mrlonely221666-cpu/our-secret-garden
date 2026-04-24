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
          className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => { setOpen(false); setEditing(false); }}
        >
          <div
            className="romantic-card p-8 max-w-lg w-full animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => { setOpen(false); setEditing(false); }} className="absolute top-4 right-4 text-muted-foreground hover:text-rose-glow">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <Sparkles className="w-8 h-8 mx-auto text-rose-glow mb-2" />
              <h3 className="font-display text-3xl text-gradient-rose">Message secret</h3>
            </div>

            {editing || !message ? (
              <div className="space-y-4">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  placeholder="Un secret rien que pour nous…"
                  className="font-script text-xl"
                  autoFocus
                />
                <Button
                  onClick={() => { setMessage(draft); setEditing(false); }}
                  className="w-full bg-gradient-rose text-primary-foreground"
                >
                  Garder ce secret
                </Button>
              </div>
            ) : (
              <>
                <p className="font-script text-2xl text-foreground/90 text-center leading-relaxed whitespace-pre-wrap">
                  {message}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setEditing(true)}
                  className="w-full mt-6 text-muted-foreground hover:text-rose-glow"
                >
                  Modifier
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
