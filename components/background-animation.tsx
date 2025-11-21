"use client";
import Lottie from "lottie-react";
import Line from "../public/line-track.json";
import Treasure from "../public/treasure.json";
import NameLogo from "../public/name-logo.json";
export default function BackgroundAnimation({ children }: { children: React.ReactNode }) {
  const lottieSizeClasses = {
    mobileTreasure: "w-[200px] h-[200px] bottom-0 right-0 transform scale-[0.8]",
    mobileLine: "w-[150px] h-[150px] top-2 left-2 transform scale-[1.3]",
    desktopTreasure: "md:w-[250px] md:h-[250px] md:right-10 md:scale-[1]",
    desktopLine: "md:w-[250px] md:h-[250px] md:left-15 md:top-10 md:scale-[1.5]",
  };
  return (
    <div className="relative min-h-svh w-full bg-zinc-950 overflow-hidden">
      <div
        className={`absolute z-0 ${lottieSizeClasses.mobileLine} ${lottieSizeClasses.desktopLine}`}
      >
        <Lottie
          animationData={Line}
          autoplay={true}
          loop={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div
        className={`absolute z-0 ${lottieSizeClasses.mobileTreasure} ${lottieSizeClasses.desktopTreasure}`}
      >
        <Lottie
          animationData={Treasure}
          autoplay={true}
          loop={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center  min-h-svh">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="w-full max-w-[200px] h-auto mb-6 md:max-w-[200px] justify-center">
            <Lottie
              animationData={NameLogo}
              autoplay={true}
              loop={false}
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
