/* eslint-disable @typescript-eslint/restrict-template-expressions */
// ...
// Use `useSession()` or `unstable_getServerSession()` to get the NextAuth session.

import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const session = await getServerSession();

const supabase = createClient(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      headers: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Authorization: `Bearer ${session?.supabaseAccessToken || ""}`,
      },
    },
  }
);

export default supabase;
