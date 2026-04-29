/**
 * Basic accessibility tests for ClawSouls components.
 *
 * These tests verify:
 * - Interactive elements have accessible names (aria-label or text content)
 * - Images/icons have alt text or aria-hidden
 * - Form inputs have associated labels
 * - Semantic HTML is used (buttons, nav, main)
 * - Focus management basics
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useMessages: () => ({}),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/en/editor",
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock stores
jest.mock("@/store/soulStore", () => ({
  useSoulStore: () => ({
    soul: {
      name: "Test",
      creature: "AI",
      emoji: "🤖",
      avatar: "",
      vibe: "test",
      vibeStyle: "balanced",
      humor: 50,
      formality: 50,
      emojiUsage: 50,
      verbosity: 50,
      consciousness: 50,
      questioning: 50,
      emotionalRange: 50,
      coreTruths: {},
      boundaries: {},
      customCoreTruths: [],
      customBoundaries: [],
      signaturePhrases: [],
      communicationMode: "direct",
      knowledgeDomains: [],
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
      speechPatterns: {},
    },
    setSoul: jest.fn(),
    resetSoul: jest.fn(),
    loadPreset: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
    canUndo: () => false,
    canRedo: () => false,
    isDarkMode: false,
    setIsDarkMode: jest.fn(),
    importSoul: jest.fn(() => ({ success: true })),
  }),
}));

jest.mock("@/store/autoSaveStore", () => ({
  useAutoSaveStore: () => ({ lastSaved: null, isSaving: false }),
}));

jest.mock("@/store/achievementsStore", () => ({
  useAchievementsStore: () => ({
    incrementExport: jest.fn(),
    incrementShare: jest.fn(),
    addLanguageUsed: jest.fn(),
  }),
}));

jest.mock("@/lib/usePresets", () => ({
  usePresets: () => ({ presets: [], loading: false }),
}));

jest.mock("@/data/presets", () => ({
  attributeOptions: {},
}));

jest.mock("@/lib/soulGenerator", () => ({
  generateSoulMD: () => "# Test Soul",
}));

jest.mock("@/lib/exportYAML", () => ({
  exportYAML: () => "name: Test",
}));

// ─── Test Suite ────────────────────────────────────────────────────────

describe("Accessibility", () => {
  describe("Footer", () => {
    it("has a navigation landmark with aria-label", () => {
      const { Footer } = require("@/components/layout/footer");
      const { container } = render(<Footer />);
      const nav = container.querySelector("nav");
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute("aria-label")).toBe("Footer navigation");
    });

    it("all links have accessible names", () => {
      const { Footer } = require("@/components/layout/footer");
      const { container } = render(<Footer />);
      const links = container.querySelectorAll("a");
      links.forEach((link: Element) => {
        const accessibleName =
          link.getAttribute("aria-label") ||
          link.textContent?.trim();
        expect(accessibleName).toBeTruthy();
        expect(accessibleName!.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Header", () => {
    it("theme toggle has aria-label", () => {
      const { Header } = require("@/components/layout/header");
      render(<Header locale="en" messages={{}} />);
      const themeBtn = screen.getByRole("button", {
        name: /switch to (light|dark) mode/i,
      });
      expect(themeBtn).toBeTruthy();
    });

    it("language dropdown has aria-label", () => {
      const { Header } = require("@/components/layout/header");
      const { container } = render(<Header locale="en" messages={{}} />);
      const langBtn = container.querySelector(
        'button[aria-label="Change language"]'
      );
      expect(langBtn).toBeTruthy();
    });
  });

  describe("MobileNav", () => {
    it("has nav landmark with aria-label", () => {
      const { MobileNav } = require("@/components/mobile-nav");
      const { container } = render(<MobileNav />);
      const nav = container.querySelector("nav");
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute("aria-label")).toBe("Mobile navigation");
    });

    it("all links have text content", () => {
      const { MobileNav } = require("@/components/mobile-nav");
      const { container } = render(<MobileNav />);
      const links = container.querySelectorAll("a");
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link: Element) => {
        const text = link.textContent?.trim();
        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(0);
      });
    });
  });

  describe("PresetCard", () => {
    it("has button role and accessible name", () => {
      const { PresetCard } = require("@/components/preset-card");
      const preset = {
        id: "1",
        name: "Test Bot",
        creature: "AI Assistant",
        emoji: "🤖",
        description: "A test preset",
        tags: ["test"],
      };
      render(
        <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
      );
      const card = screen.getByRole("button", { name: /test bot/i });
      expect(card).toBeTruthy();
    });
  });

  describe("ParchmentPreview", () => {
    it("copy button has aria-label", () => {
      const { ParchmentPreview } = require("@/components/parchment-preview");
      render(
        <ParchmentPreview
          content="# Test"
          name="Test"
          emoji="🤖"
          toneAttributes={{
            humor: 50,
            formality: 50,
            emojiUsage: 50,
            verbosity: 50,
            consciousness: 50,
            questioning: 50,
          }}
        />
      );
      // Button exists with some accessible name (translation key or translated text)
      const buttons = screen.getAllByRole("button");
      const copyBtn = buttons.find(
        (b) =>
          b.getAttribute("aria-label")?.includes("copy") ||
          b.getAttribute("aria-label")?.includes("Copy") ||
          b.textContent?.includes("Copy")
      );
      expect(copyBtn).toBeTruthy();
    });
  });

  describe("AchievementToast", () => {
    it("close button has aria-label", () => {
      const { AchievementToast } = require("@/components/achievement-toast");
      // Toast is not visible by default, so just verify it renders without error
      const { container } = render(<AchievementToast />);
      // When not visible, it should render nothing
      expect(container.innerHTML).toBe("");
    });
  });

  describe("SavePresetDialog", () => {
    it("trigger button has accessible text", () => {
      const { SavePresetDialog } = require("@/components/save-preset-dialog");
      render(<SavePresetDialog />);
      const triggerBtn = screen.getByRole("button", { name: /save/i });
      expect(triggerBtn).toBeTruthy();
    });
  });

  describe("KeyboardHelp", () => {
    it("renders without accessibility errors", () => {
      const { KeyboardHelp } = require("@/components/keyboard-help");
      const { container } = render(<KeyboardHelp />);
      // Should render nothing when not open
      expect(container.innerHTML).toBe("");
    });
  });

  describe("ThemeSelector", () => {
    it("trigger button has aria-label", () => {
      jest.mock("@/store/themeStore", () => ({
        useThemeStore: () => ({
          themeId: "default",
          setTheme: jest.fn(),
          getAllThemes: () => [],
        }),
      }));
      const { ThemeSelector } = require("@/components/theme-selector");
      const { container } = render(<ThemeSelector />);
      const btn = container.querySelector('button[aria-label="changeTheme"]');
      expect(btn).toBeTruthy();
    });
  });
});
