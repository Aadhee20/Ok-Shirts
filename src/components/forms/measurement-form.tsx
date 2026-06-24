"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  shirtMeasurementsSchema,
  pantMeasurementsSchema,
  suitMeasurementsSchema,
  type MeasurementsData,
} from "@/lib/validators";
import { useCartStore } from "@/store/cart-store";
import { saveMeasurementProfile } from "@/lib/actions/user-actions";
import type { MeasurementProfile } from "@prisma/client";

type MeasurementFormProps = {
  categories: string[];
  userId: string;
  savedProfiles?: MeasurementProfile[];
};

export function MeasurementForm({ categories, userId, savedProfiles = [] }: MeasurementFormProps) {
  const router = useRouter();
  const setMeasurements = useCartStore((s) => s.setMeasurements);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveProfile, setSaveProfile] = useState(false);
  const [profileLabel, setProfileLabel] = useState("");

  const hasSuit = categories.includes("SUIT");
  const hasShirt = categories.includes("SHIRT");
  const hasPant = categories.includes("PANT");

  const needsShirt = hasShirt && !hasSuit;
  const needsPant = hasPant && !hasSuit;
  const needsSuit = hasSuit;

  const loadProfile = (profile: MeasurementProfile) => {
    const form = document.getElementById("measurement-form") as HTMLFormElement;
    if (!form) return;
    const fields = ["neck", "chest", "shoulder", "sleeveLength", "shirtLength", "waist", "hips", "inseam", "thigh", "rise", "jacketLength"];
    fields.forEach((field) => {
      const input = form.elements.namedItem(field) as HTMLInputElement;
      const value = profile[field as keyof MeasurementProfile];
      if (input && value != null) input.value = String(value);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const data: MeasurementsData = {};
    const newErrors: Record<string, string> = {};

    if (needsShirt) {
      const shirtData = {
        neck: formData.get("neck"),
        chest: formData.get("chest"),
        shoulder: formData.get("shoulder"),
        sleeveLength: formData.get("sleeveLength"),
        shirtLength: formData.get("shirtLength"),
      };
      const parsed = shirtMeasurementsSchema.safeParse(shirtData);
      if (!parsed.success) {
        parsed.error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
      } else {
        data.shirt = parsed.data;
      }
    }

    if (needsPant) {
      const pantData = {
        waist: formData.get("waist"),
        hips: formData.get("hips"),
        inseam: formData.get("inseam"),
        thigh: formData.get("thigh"),
        rise: formData.get("rise"),
      };
      const parsed = pantMeasurementsSchema.safeParse(pantData);
      if (!parsed.success) {
        parsed.error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
      } else {
        data.pant = parsed.data;
      }
    }

    if (needsSuit) {
      const suitData = {
        neck: formData.get("neck"),
        chest: formData.get("chest"),
        shoulder: formData.get("shoulder"),
        sleeveLength: formData.get("sleeveLength"),
        jacketLength: formData.get("jacketLength"),
        waist: formData.get("waist"),
        hips: formData.get("hips"),
        inseam: formData.get("inseam"),
        thigh: formData.get("thigh"),
        rise: formData.get("rise"),
      };
      const parsed = suitMeasurementsSchema.safeParse(suitData);
      if (!parsed.success) {
        parsed.error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
      } else {
        data.suit = parsed.data;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setMeasurements(data);

    if (saveProfile && profileLabel) {
      await saveMeasurementProfile(userId, {
        label: profileLabel,
        neck: Number(formData.get("neck")) || undefined,
        chest: Number(formData.get("chest")) || undefined,
        shoulder: Number(formData.get("shoulder")) || undefined,
        sleeveLength: Number(formData.get("sleeveLength")) || undefined,
        shirtLength: Number(formData.get("shirtLength")) || undefined,
        waist: Number(formData.get("waist")) || undefined,
        hips: Number(formData.get("hips")) || undefined,
        inseam: Number(formData.get("inseam")) || undefined,
        thigh: Number(formData.get("thigh")) || undefined,
        rise: Number(formData.get("rise")) || undefined,
        jacketLength: Number(formData.get("jacketLength")) || undefined,
      });
    }

    router.push("/checkout");
  };

  const renderField = (name: string, label: string, unit = "inches") => (
    <div className="space-y-1">
      <Label htmlFor={name}>{label} ({unit})</Label>
      <Input id={name} name={name} type="number" step="0.5" min="0" required />
      {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form id="measurement-form" onSubmit={handleSubmit} className="space-y-8">
      {savedProfiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Saved Profiles</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {savedProfiles.map((profile) => (
              <Button
                key={profile.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadProfile(profile)}
              >
                {profile.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {(needsShirt || needsSuit) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {needsSuit ? "Suit — Upper Body Measurements" : "Shirt Measurements"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderField("neck", "Neck")}
            {renderField("chest", "Chest")}
            {renderField("shoulder", "Shoulder Width")}
            {renderField("sleeveLength", "Sleeve Length")}
            {needsSuit
              ? renderField("jacketLength", "Jacket Length")
              : renderField("shirtLength", "Shirt Length")}
          </CardContent>
        </Card>
      )}

      {(needsPant || needsSuit) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {needsSuit ? "Suit — Lower Body Measurements" : "Pant Measurements"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderField("waist", "Waist")}
            {renderField("hips", "Hips")}
            {renderField("inseam", "Inseam")}
            {renderField("thigh", "Thigh")}
            {renderField("rise", "Rise")}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveProfile"
              checked={saveProfile}
              onChange={(e) => setSaveProfile(e.target.checked)}
              className="rounded border-input"
            />
            <Label htmlFor="saveProfile">Save these measurements for future orders</Label>
          </div>
          {saveProfile && (
            <div className="space-y-1">
              <Label htmlFor="profileLabel">Profile Name</Label>
              <Input
                id="profileLabel"
                value={profileLabel}
                onChange={(e) => setProfileLabel(e.target.value)}
                placeholder="e.g. My usual size"
                required={saveProfile}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/cart")}>
          Back to Cart
        </Button>
        <Button type="submit">Save & Continue to Checkout</Button>
      </div>
    </form>
  );
}
