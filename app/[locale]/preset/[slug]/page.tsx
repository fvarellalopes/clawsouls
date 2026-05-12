import { redirect } from "next/navigation";

interface PresetPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PresetPage({ params }: PresetPageProps) {
  const { locale, slug } = await params;
  redirect(`/${locale}/editor?preset=${slug}`);
}
