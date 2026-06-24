"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteMeasurementProfile } from "@/lib/actions/user-actions";
import type { MeasurementProfile } from "@prisma/client";

type AccountClientProps = {
  userId: string;
  user: { name: string; email: string; phone: string | null };
  measurementProfiles: MeasurementProfile[];
};

export function AccountClient({ userId, user, measurementProfiles }: AccountClientProps) {
  const router = useRouter();

  const handleDeleteProfile = async (profileId: string) => {
    await deleteMeasurementProfile(userId, profileId);
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <span className="text-muted-foreground">Phone</span>
              <p className="font-medium">{user.phone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Measurement Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          {measurementProfiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No saved profiles yet. Save measurements during checkout for faster future orders.
            </p>
          ) : (
            <div className="space-y-3">
              {measurementProfiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium">{profile.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Chest: {profile.chest ?? "—"} · Waist: {profile.waist ?? "—"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDeleteProfile(profile.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
