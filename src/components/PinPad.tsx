import { useState } from "react";
import { Delete } from "lucide-react";

interface PinPadProps {
  onSuccess: () => void;
  correctPin?: string;
}

export const PinPad = ({ onSuccess, correctPin = "0104" }: PinPadProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return;
    setError(null);
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === correctPin) {
          onSuccess();
        } else {
          setError("Ce n'est pas le bon code 💔");
          setShake(true);
          setTimeout(() => {
            setPin("");
            setShake(false);
          }, 600);
        }
      }, 200);
    }
  };

  const handleDelete = () => {
    setError(null);
    setPin((p) => p.slice(0, -1));
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl sm:text-4xl text-gradient-rose">
          Entre notre code secret
        </h2>
        <p className="text-muted-foreground font-script text-lg">
          quatre chiffres pour ouvrir mon cœur
        </p>
      </div>

      {/* PIN dots */}
      <div className={`flex gap-4 ${shake ? "animate-shake" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              pin.length > i
                ? "bg-rose border-rose shadow-glow-soft scale-110"
                : "border-rose/40"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-rose-glow font-script text-xl animate-fade-in">{error}</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {digits.map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card/60 backdrop-blur-md border border-border text-2xl font-display text-foreground hover:bg-rose/20 hover:border-rose hover:shadow-glow-soft transition-all duration-200 active:scale-95"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleDigit("0")}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card/60 backdrop-blur-md border border-border text-2xl font-display text-foreground hover:bg-rose/20 hover:border-rose hover:shadow-glow-soft transition-all duration-200 active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          aria-label="Effacer"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card/40 backdrop-blur-md border border-border text-muted-foreground hover:text-rose-glow hover:border-rose/60 transition-all duration-200 active:scale-95 flex items-center justify-center"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
