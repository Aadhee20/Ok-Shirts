import { Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const measurementGuides = [
  {
    title: "Neck",
    description: "Measure around the base of your neck where the collar sits. Keep the tape snug but not tight.",
  },
  {
    title: "Chest",
    description: "Measure around the fullest part of your chest, keeping the tape horizontal under your arms.",
  },
  {
    title: "Shoulder Width",
    description: "Measure from the edge of one shoulder to the other across the back.",
  },
  {
    title: "Sleeve Length",
    description: "Measure from the shoulder seam down to where you want the cuff to end (typically wrist bone).",
  },
  {
    title: "Shirt / Jacket Length",
    description: "Measure from the base of the neck down to your desired shirt or jacket length.",
  },
  {
    title: "Waist",
    description: "Measure around your natural waistline, typically at the navel level.",
  },
  {
    title: "Hips",
    description: "Measure around the fullest part of your hips, keeping the tape horizontal.",
  },
  {
    title: "Inseam",
    description: "Measure from the crotch down the inside of the leg to the desired trouser length.",
  },
  {
    title: "Thigh",
    description: "Measure around the fullest part of your thigh, about 2 inches below the crotch.",
  },
  {
    title: "Rise",
    description: "Measure from the front waistband through the crotch to the back waistband.",
  },
];

export default function SizeGuidePage() {
  return (
    <div className="container-narrow py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Ruler className="h-10 w-10 text-forest mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold">Size Guide</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Accurate measurements ensure a perfect fit. Use a flexible measuring tape and measure
            over light clothing. All measurements should be in inches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {measurementGuides.map((guide) => (
            <Card key={guide.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-serif">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-forest text-beige">
          <CardContent className="p-6">
            <h2 className="font-serif text-xl font-bold mb-3">Tips for Best Results</h2>
            <ul className="space-y-2 text-sm text-beige/90">
              <li>• Stand naturally with feet shoulder-width apart</li>
              <li>• Have someone else take measurements when possible</li>
              <li>• Keep the measuring tape parallel to the floor</li>
              <li>• Don&apos;t pull the tape too tight — it should sit comfortably</li>
              <li>• Measure twice to confirm accuracy</li>
              <li>• Save your measurements as a profile for future orders</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
