// // ...
// // Use `useSession()` or `unstable_getServerSession()` to get the NextAuth session.

// import { createClient } from "@supabase/supabase-js";
// import { useSession } from "next-auth/react";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   {
//     global: {
//       headers: {
//         Authorization: `Bearer ${supabaseAccessToken}`,
//       },
//     },
//   }
// );
