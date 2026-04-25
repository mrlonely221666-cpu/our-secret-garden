import { useState } from "react";
import { StarrySky } from "@/components/StarrySky";
import { PetalsLayer } from "@/components/PetalsLayer";
import { Nebula } from "@/components/Nebula";
import { Ornament } from "@/components/Ornament";
import { BrokenHeart } from "@/components/BrokenHeart";
import { PinPad } from "@/components/PinPad";
import { Dashboard } from "@/components/Dashboard";

type Stage = "heart" | "pin" | "app";

const Index = () => {
  const [stage, setStage] = useState<Stage>("heart");

  return (
    <div className="relative min-h-screen overflow-x-hidden vignette">
      <Nebula />
      <StarrySky count={120} />
      <PetalsLayer count={16} />

      {stage === "heart" && (
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center gap-8 sm:gap-10 animate-fade-in">
          <div className="space-y-4">
            <p className="font-calligraphy text-3xl sm:text-4xl text-gold-bright tracking-wide">
              ~ Mon âme te murmure ~
            </p>
            <h1 className="font-display italic font-light text-5xl sm:text-7xl lg:text-8xl text-gradient-rose-gold leading-[1.05] tracking-tight">
              Pour toi,
              <br />
              <span className="font-script not-italic font-normal">mon amour</span>
            </h1>
            <Ornament className="max-w-sm mx-auto" />
            <p className="font-script text-xl sm:text-2xl text-rose-glow/90">
              Touche-les pour qu'ils se retrouvent…
            </p>
          </div>

          <BrokenHeart onHealed={() => setStage("pin")} />

          <div className="space-y-2">
            <Ornament className="max-w-xs mx-auto opacity-60" />
            <p className="text-xs sm:text-sm text-muted-foreground/70 max-w-xs italic font-display">
              Un sanctuaire intime — protégé par notre code secret
            </p>
          </div>
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
