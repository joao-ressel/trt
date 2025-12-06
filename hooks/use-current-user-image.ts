import { createClient } from "@/services/supabase/client";
import { useState, useEffect } from "react";

const DEFAULT_AVATAR_PATH = "../public/profile_default.png";

export const useCurrentUserImage = (): string => {
  const [image, setImage] = useState<string>(DEFAULT_AVATAR_PATH);

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error("Error fetching user session:", error);
        return;
      }

      const avatarUrl = data.session?.user.user_metadata.avatar_url;
      if (avatarUrl) {
        setImage(avatarUrl);
      }
    };

    fetchUserImage();
  }, []);

  return image;
};
