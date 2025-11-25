import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
// Assuming this is your Supabase client setup

// Define the path to your default avatar image
// Adjust this path based on where you store your assets
const DEFAULT_AVATAR_PATH = "../public/profile_default.png";

export const useCurrentUserImage = (): string => {
  // 2. Inicialize o estado com o caminho padrão.
  // O tipo agora é estritamente 'string'.
  const [image, setImage] = useState<string>(DEFAULT_AVATAR_PATH);

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error } = await createClient().auth.getSession();

      if (error) {
        console.error("Error fetching user session:", error);
        // Em caso de erro, mantém o estado com o valor inicial (DEFAULT_AVATAR_PATH)
        return;
      }

      const avatarUrl = data.session?.user.user_metadata.avatar_url;

      // 3. Se houver um avatarUrl válido, atualiza.
      // Caso contrário, o estado (que já é o DEFAULT_AVATAR_PATH) não é alterado.
      if (avatarUrl) {
        setImage(avatarUrl);
      }
    };

    fetchUserImage();
  }, []);

  // O hook agora garante que SEMPRE retorna uma string.
  return image;
};
