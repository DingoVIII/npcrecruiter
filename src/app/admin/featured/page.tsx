import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import FeaturedManager from "./FeaturedManager";

export const dynamic = "force-dynamic";

export default async function FeaturedAdminPage() {
  const admin = await requireAdmin();
  if (!admin.authorized) {
    if (admin.status === 401) redirect("/login");
    redirect("/");
  }
  return <FeaturedManager />;
}
