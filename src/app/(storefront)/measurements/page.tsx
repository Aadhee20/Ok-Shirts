import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/actions/user-actions";
import { MeasurementsGuard } from "@/components/storefront/measurements-guard";

export default async function MeasurementsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    redirect("/login?callbackUrl=/measurements");
  }

  const profile = await getUserProfile(session.user.id);

  return (
    <div className="container-narrow py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Your Measurements</h1>
        <p className="text-muted-foreground mt-2">
          All garments are custom stitched. Please provide accurate measurements in inches.{" "}
          <Link href="/size-guide" className="text-forest hover:underline">Need help measuring?</Link>
        </p>
      </div>

      <MeasurementsGuard userId={session.user.id} savedProfiles={profile?.measurementProfiles ?? []} />
    </div>
  );
}
