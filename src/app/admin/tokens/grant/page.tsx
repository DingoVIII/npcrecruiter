import { redirect } from "next/navigation";

import { TokenGrantPanel } from "@/components/admin/TokenGrantPanel";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

export default async function GrantTokensPage() {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    if (admin.status === 401) redirect("/login");
    redirect("/");
  }

  return <TokenGrantPanel />;
}
