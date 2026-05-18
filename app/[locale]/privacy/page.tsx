"use client";

import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("legal");

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--bg)_0%,var(--surface-dim)_50%,var(--bg)_100%)]">
      <div className="max-w-4xl mx-auto px-6 py-32">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-block mb-4 px-3 py-1 rounded-full border border-primary/50 text-primary text-[10px] font-mono tracking-[0.2em] uppercase">
            {t("badge")}
          </span>
          <h1 className="text-[36px] font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80 mb-4">
            {t("privacyTitle")}
          </h1>
          <p className="text-sm font-mono text-foreground/40">
            {t("lastUpdated")}: {t("privacyDate")}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-foreground/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              1. {t("privacySection1Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection1P1")}</p>
              <p>{t("privacySection1P2")}</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/60">
                <li>{t("privacySection1Li1")}</li>
                <li>{t("privacySection1Li2")}</li>
                <li>{t("privacySection1Li3")}</li>
              </ul>
              <p>{t("privacySection1P3")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              2. {t("privacySection2Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection2P1")}</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/60">
                <li>{t("privacySection2Li1")}</li>
                <li>{t("privacySection2Li2")}</li>
                <li>{t("privacySection2Li3")}</li>
                <li>{t("privacySection2Li4")}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              3. {t("privacySection3Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection3P1")}</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/60">
                <li>{t("privacySection3Li1")}</li>
                <li>{t("privacySection3Li2")}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              4. {t("privacySection4Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection4P1")}</p>
              <p>{t("privacySection4P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              5. {t("privacySection5Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection5P1")}</p>
              <p>{t("privacySection5P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              6. {t("privacySection6Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection6P1")}</p>
              <p>{t("privacySection6P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              7. {t("privacySection7Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection7P1")}</p>
              <p>{t("privacySection7P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-primary mb-4 tracking-wide">
              8. {t("privacySection8Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("privacySection8P1")}</p>
              <p><strong className="text-primary">{t("contact")}:</strong> clawsouls@proton.me</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
