import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PresetCard } from '../preset-card';
import { SoulPreset } from '@/store/soulStore';

// Mock lucide-react (not used directly but kept for future use)
jest.mock('lucide-react', () => ({}));

const makePreset = (overrides: Partial<SoulPreset> = {}): SoulPreset => ({
  id: 'test-1',
  name: 'Aria',
  creature: 'Digital Phoenix',
  vibe: 'Warm and curious',
  emoji: '🔥',
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
  vibeStyle: 'expressive',
  description: 'A warm, curious AI that loves to explore ideas.',
  tags: ['creative', 'warm', 'curious'],
  source: 'character',
  ...overrides,
});

describe('PresetCard', () => {
  it('renders preset name', () => {
    const preset = makePreset();
    const { getByText } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    expect(getByText('Aria')).toBeTruthy();
  });

  it('sets accessible name via aria-label', () => {
    const preset = makePreset();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toContain('Aria');
    expect(button?.getAttribute('aria-label')).toContain('Digital Phoenix');
  });

  it('renders description text', () => {
    const preset = makePreset();
    const { getByText } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    expect(getByText(/warm, curious AI/)).toBeTruthy();
  });

  it('renders tags (up to 3)', () => {
    const preset = makePreset({ tags: ['alpha', 'beta', 'gamma', 'delta'] });
    const { getByText, queryByText } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    expect(getByText('alpha')).toBeTruthy();
    expect(getByText('beta')).toBeTruthy();
    expect(getByText('gamma')).toBeTruthy();
    // 4th tag should not be rendered
    expect(queryByText('delta')).toBeNull();
  });

  it('calls onSelect with the preset when clicked', () => {
    const preset = makePreset();
    const onSelect = jest.fn();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={onSelect} />
    );

    // Click on the outermost card button
    fireEvent.click(container.firstChild!);
    expect(onSelect).toHaveBeenCalledWith(preset);
  });

  it('renders as a button element', () => {
    const preset = makePreset();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.getAttribute('type')).toBe('button');
  });

  it('sets aria-pressed when selected', () => {
    const preset = makePreset();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} isSelected={true} />
    );

    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-pressed')).toBe('true');
  });

  it('applies selected styling classes when isSelected', () => {
    const preset = makePreset();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} isSelected={true} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-primary-container/60');
  });

  it('applies default styling classes when not selected', () => {
    const preset = makePreset();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} isSelected={false} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-border');
  });

  it('renders ARCH code derived from index', () => {
    const preset = makePreset();
    const { getByText } = render(
      <PresetCard preset={preset} index={2} onSelect={jest.fn()} />
    );

    expect(getByText('ARCH-03')).toBeTruthy();
  });

  it('renders version badge from vibeStyle', () => {
    const preset = makePreset({ vibeStyle: 'concise' });
    const { getByText } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    expect(getByText('vconcise')).toBeTruthy();
  });
});
