import { createClient } from "@/services/supabase/client";
import { useEffect, useState } from "react";

export const useCurrentUserEmail = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error(error);
      }

      setEmail(data.session?.user.user_metadata.email ?? "?");
    };

    fetchEmail();
  }, []);

  return email || "?";
};
