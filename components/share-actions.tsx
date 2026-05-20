"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Share2, Check, ArrowRight, Smartphone, Copy, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { QRCodeDisplay } from "@/components/qrcode-display";

interface ShareActionsProps {
  shareUrl?: string;
  dataParam: string;
}

// Social media share URLs
const getShareUrls = (url: string, text: string) => ({
  x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  messenger: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=0&redirect_uri=${encodeURIComponent(url)}`,
  email: `mailto:?subject=${encodeURIComponent("Check out this AI personality on ClawSouls!")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  sms: `sms:?body=${encodeURIComponent(`${text}\n${url}`)}`,
});

// Social media icons (SVG components)
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.13 3.26L19.752 8.1l-6.561 6.863z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const SMSIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" />
  </svg>
);

const QRCodeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
  </svg>
);

export function ShareActions({ shareUrl: propShareUrl, dataParam }: ShareActionsProps) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = propShareUrl || (typeof window !== "undefined"
    ? `${window.location.origin}/share?data=${dataParam}`
    : `/share?data=${dataParam}`);

  const shareText = "Check out this AI personality on ClawSouls!";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "ClawSouls — AI Personality",
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // User cancelled or share failed — fallback to copy
      handleCopy();
    }
  };

  const shareUrls = getShareUrls(shareUrl, shareText);

  const socialButtons = [
    { name: "X", icon: <XIcon />, url: shareUrls.x, color: "bg-black hover:bg-gray-800" },
    { name: "WhatsApp", icon: <WhatsAppIcon />, url: shareUrls.whatsapp, color: "bg-green-600 hover:bg-green-700" },
    { name: "Telegram", icon: <TelegramIcon />, url: shareUrls.telegram, color: "bg-blue-500 hover:bg-blue-600" },
    { name: "Facebook", icon: <FacebookIcon />, url: shareUrls.facebook, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Messenger", icon: <MessengerIcon />, url: shareUrls.messenger, color: "bg-blue-500 hover:bg-blue-600" },
    { name: "Instagram", icon: <InstagramIcon />, url: "#", color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600", onClick: () => { handleCopy(); alert(t("instagramCopied")); } },
    { name: "Email", icon: <EmailIcon />, url: shareUrls.email, color: "bg-gray-600 hover:bg-gray-700" },
    { name: "SMS", icon: <SMSIcon />, url: shareUrls.sms, color: "bg-green-500 hover:bg-green-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Copy Link Section */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-2xl font-semibold mb-4">{t("copyShareLink")}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("copyShareLinkDesc")}
        </p>
        <div className="flex space-x-2">
          <label htmlFor="share-url-input" className="sr-only">Share URL</label>
          <Input id="share-url-input" readOnly value={shareUrl} className="flex-1" aria-label="Share URL" />
          <Button onClick={handleCopy} variant={copied ? "default" : "outline"}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t("copied")}
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {t("copy")}
              </>
            )}
          </Button>
        </div>
        {canNativeShare && (
          <Button onClick={handleNativeShare} variant="outline" className="w-full mt-3">
            <Smartphone className="mr-2 h-4 w-4" />
            {t("shareVia")}
          </Button>
        )}
      </div>

      {/* Social Media Share Buttons */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-2xl font-semibold mb-4">{t("shareOnSocial")}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("shareOnSocialDesc")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {socialButtons.map((btn) => (
            <Button
              key={btn.name}
              asChild={!btn.onClick}
              variant="outline"
              className={`${btn.color} text-white border-0`}
              onClick={btn.onClick}
            >
              {btn.onClick ? (
                <span className="flex items-center justify-center gap-2">
                  {btn.icon}
                  <span className="text-xs">{btn.name}</span>
                </span>
              ) : (
                <a href={btn.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  {btn.icon}
                  <span className="text-xs">{btn.name}</span>
                </a>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">{t("qrCode")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("qrCodeDesc")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQR(!showQR)}
          >
            <QRCodeIcon />
            <span className="ml-2">{showQR ? t("hideQR") : t("showQR")}</span>
          </Button>
        </div>
        {showQR && (
          <div className="flex justify-center pt-4">
            <QRCodeDisplay url={shareUrl} name="ClawSouls" />
          </div>
        )}
      </div>

      {/* Open in Editor */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-2xl font-semibold mb-4">{t("loadInEditor")}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("loadInEditorDesc")}
        </p>
        <Button asChild className="w-full">
          <Link href={`/editor?data=${dataParam}`}>
            {t("openInEditor")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
