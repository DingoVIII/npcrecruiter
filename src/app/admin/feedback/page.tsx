import { redirect } from "next/navigation";

import { GuildmasterFeedbackInbox } from "@/components/admin/GuildmasterFeedbackInbox";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

export default async function GuildmasterFeedbackPage() {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    if (admin.status === 401) {
      redirect("/login");
    }

    redirect("/");
  }

  return <GuildmasterFeedbackInbox />;
}
