import React from 'react';
import { render } from '@testing-library/react';
import { SoulPreview } from '../soul-preview';
import { SoulState } from '@/store/soulStore';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Soul Preview',
      description: 'Preview of your generated SOUL.md',
    };
    return translations[key] ?? key;
  },
}));

// Mock soulGenerator
jest.mock('@/lib/soulGenerator', () => ({
  generateSoulMD: jest.fn((soul: any) => `# Mock SOUL.md for ${soul.name}`),
}));

const makeSoul = (overrides: Record<string, any> = {}): SoulState['soul'] => ({
  name: 'TestBot',
  creature: 'AI',
  vibe: 'Friendly',
  emoji: '😊',
  coreTruths: {
    helpful: true,
    opinions: true,
    resourceful: true,
    trustworthy: true,
    respectful: true,
  },
  boundaries: {
    private: true,
    askBeforeActing: true,
    noHalfBaked: true,
    notVoiceProxy: true,
  },
  customCoreTruths: [],
  customBoundaries: [],
  vibeStyle: 'concise',
  continuity: false,
  humor: 50,
  formality: 50,
  emojiUsage: 30,
  verbosity: 70,
  consciousness: 80,
  questioning: 60,
  openness: 70,
  conscientiousness: 50,
  extraversion: 50,
  agreeableness: 50,
  neuroticism: 30,
  communicationMode: 'direct',
  knowledgeDomains: [],
  signaturePhrases: [],
  emotionalRange: 50,
  speechPatterns: {
    alliteration: false,
    rhymeTendency: 10,
    metaphorFrequency: 30,
    technicalJargon: 40,
    slangUsage: 20,
  },
  ...overrides,
});

describe('SoulPreview', () => {
  it('renders the preview title and description', () => {
    const { getByText } = render(<SoulPreview soul={makeSoul()} />);
    expect(getByText('Soul Preview')).toBeTruthy();
    expect(getByText('Preview of your generated SOUL.md')).toBeTruthy();
  });

  it('renders the generated markdown content', () => {
    const { getByText } = render(<SoulPreview soul={makeSoul({ name: 'Aria' })} />);
    expect(getByText('# Mock SOUL.md for Aria')).toBeTruthy();
  });

  it('calls generateSoulMD with the provided soul', () => {
    const { generateSoulMD } = require('@/lib/soulGenerator');
    const soul = makeSoul({ name: 'Nova', humor: 90 });
    render(<SoulPreview soul={soul} />);
    expect(generateSoulMD).toHaveBeenCalledWith(soul);
  });

  it('renders markdown inside a pre element', () => {
    const { container } = render(<SoulPreview soul={makeSoul()} />);
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
    expect(pre!.className).toContain('font-mono');
  });

  it('updates when soul changes', () => {
    const { getByText, rerender } = render(<SoulPreview soul={makeSoul({ name: 'First' })} />);
    expect(getByText('# Mock SOUL.md for First')).toBeTruthy();

    rerender(<SoulPreview soul={makeSoul({ name: 'Second' })} />);
    expect(getByText('# Mock SOUL.md for Second')).toBeTruthy();
  });

  it('renders with empty soul name', () => {
    const { container } = render(<SoulPreview soul={makeSoul({ name: '' })} />);
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
    expect(pre!.textContent).toContain('Mock SOUL.md for');
  });
});
