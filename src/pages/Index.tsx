import { useState } from "react";
import { StarrySky } from "@/components/StarrySky";
import { BrokenHeart } from "@/components/BrokenHeart";
import { PinPad } from "@/components/PinPad";
import { Dashboard } from "@/components/Dashboard";

type Stage = "heart" | "pin" | "app";

const Index = () => {
  const [stage, setStage] = useState<Stage>("heart");

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <StarrySky />

      {stage === "heart" && (
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center gap-10 animate-fade-in">
          <div className="space-y-3">
            <h1 className="font-display text-5xl sm:text-7xl text-gradient-rose leading-tight">
              Pour toi, mon amour
            </h1>
            <p className="font-script text-xl sm:text-2xl text-rose-glow/90">
              Touche le cœur pour le réparer…
            </p>
          </div>
          <BrokenHeart onHealed={() => setStage("pin")} />
          <p className="text-xs text-muted-foreground/60 max-w-xs">
            Un sanctuaire intime — protégé par notre code secret
          </p>
        </section>
      )}

      {stage === "pin" && (
        <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <PinPad onSuccess={() => setStage("app")} />
        </section>
      )}

      {stage === "app" && <Dashboard onLock={() => setStage("heart")} />}
    </div>
  );
};

export default Index;
