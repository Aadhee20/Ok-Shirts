import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/actions/user-actions";
import { AccountClient } from "@/components/storefront/account-client";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    redirect("/login?callbackUrl=/account");
  }

  const profile = await getUserProfile(session.user.id);

  return (
    <div className="container-narrow py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">My Account</h1>
      <AccountClient
        userId={session.user.id}
        user={{
          name: profile?.name ?? session.user.name,
          email: profile?.email ?? session.user.email,
          phone: profile?.phone ?? null,
        }}
        measurementProfiles={profile?.measurementProfiles ?? []}
      />
    </div>
  );
}
