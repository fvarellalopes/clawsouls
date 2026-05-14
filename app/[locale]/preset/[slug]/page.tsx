import { notFound } from "next/navigation";
import { presets } from "@/data/presets";
import { PresetDetail } from "@/components/preset-detail";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const preset = presets.find(
    p => p.id === slug || p.name.toLowerCase().replace(/\s+/g, "-") === slug
  );
  if (!preset) return { title: "Preset Not Found" };
  return {
    title: `ClawSouls — ${preset.name}`,
    description: preset.description,
    openGraph: {
      title: preset.name,
      description: preset.description,
      images: [`/avatars/${preset.id}.webp`],
    },
  };
}

export default async function PresetPage({ params }: Props) {
  const { slug, locale } = await params;
  const preset = presets.find(
    p => p.id === slug || p.name.toLowerCase().replace(/\s+/g, "-") === slug
  );
  if (!preset) notFound();
  return <PresetDetail preset={preset} locale={locale} />;
}
