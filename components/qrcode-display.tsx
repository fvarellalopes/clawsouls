"use client";

import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

interface QRCodeDisplayProps {
  url: string;
  name?: string;
}

export function QRCodeDisplay({ url, name }: QRCodeDisplayProps) {
  const t = useTranslations("qrCode");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    QRCodeLib.toDataURL(url, { width: 200, margin: 2 }, (err, result) => {
      if (!err) setQrDataUrl(result);
    });
  }, [url]);

  if (!qrDataUrl) return <div className="animate-pulse bg-muted h-48 w-48 rounded-lg" />;

  return (
    <div className="flex flex-col items-center space-y-4" role="img" aria-label={t("qrCode")}>
      <img src={qrDataUrl} alt={t("qrCode")} className="border-2 border-accent rounded-lg p-2 bg-white" />
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          const a = document.createElement("a");
          a.href = qrDataUrl;
          a.download = `${name?.replace(/\s+/g, "_") || "clawsouls"}_qr.png`;
          a.click();
        }}
      >
        {t("downloadQr")}
      </Button>
    </div>
  );
}
