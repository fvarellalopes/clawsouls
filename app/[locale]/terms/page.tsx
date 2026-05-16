"use client";

import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("legal");

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--bg,#09090b)_0%,var(--surface-dim,#131315)_50%,var(--bg,#09090b)_100%)]">
      <div className="max-w-4xl mx-auto px-6 py-32">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-block mb-4 px-3 py-1 rounded-full border border-yellow-400/50 text-yellow-400 text-[10px] font-mono tracking-[0.2em] uppercase">
            {t("badge")}
          </span>
          <h1 className="text-[36px] font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 mb-4">
            {t("termsTitle")}
          </h1>
          <p className="text-sm font-mono text-foreground/40">
            {t("lastUpdated")}: {t("termsDate")}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-foreground/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              1. {t("section1Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section1P1")}</p>
              <p>{t("section1P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              2. {t("section2Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section2P1")}</p>
              <p>{t("section2P2")}</p>
              <p>{t("section2P3")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              3. {t("section3Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section3P1")}</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/60">
                <li>{t("section3Li1")}</li>
                <li>{t("section3Li2")}</li>
                <li>{t("section3Li3")}</li>
                <li>{t("section3Li4")}</li>
                <li>{t("section3Li5")}</li>
              </ul>
              <p>{t("section3P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              4. {t("section4Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section4P1")}</p>
              <p>{t("section4P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              5. {t("section5Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section5P1")}</p>
              <p>{t("section5P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              6. {t("section6Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section6P1")}</p>
              <p>{t("section6P2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              7. {t("section7Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section7P1")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-display text-yellow-400 mb-4 tracking-wide">
              8. {t("section8Title")}
            </h2>
            <div className="space-y-3">
              <p>{t("section8P1")}</p>
              <p>{t("section8P2")}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
