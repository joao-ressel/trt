import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState<boolean>(false);

  useEffect(() => {
    console.log("Evento beforeinstallprompt disparado!");
    const handler = (e: any) => {
      if (e && e.prompt) {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallButton(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Usuário aceitou a instalação do PWA");
        } else {
          console.log("Usuário recusou a instalação do PWA");
        }

        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  }, [deferredPrompt]);

  if (!showInstallButton) {
    return null;
  }

  return (
    <Button variant="outline" onClick={handleInstallClick} title="Instalar Aplicativo Web">
      <Download className="text-foregroud" />
    </Button>
  );
};

export default InstallPWA;
