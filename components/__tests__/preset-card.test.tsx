import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PresetCard } from '../preset-card';
import { SoulPreset } from '@/store/soulStore';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Sparkles: (props: any) => React.createElement('svg', { 'data-testid': 'sparkles-icon', ...props }),
}));

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
  it('renders preset name, creature, and emoji', () => {
    const preset = makePreset();
    const { getByText } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    expect(getByText('Aria')).toBeTruthy();
    expect(getByText('Digital Phoenix')).toBeTruthy();
    expect(getByText('🔥')).toBeTruthy();
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

    // Click on the outermost card div
    fireEvent.click(container.firstChild!);
    expect(onSelect).toHaveBeenCalledWith(preset);
  });

  it('does not render sparkles icon when not selected', () => {
    const preset = makePreset();
    const { queryByTestId } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} isSelected={false} />
    );

    expect(queryByTestId('sparkles-icon')).toBeNull();
  });

  it('renders sparkles icon when selected', () => {
    const preset = makePreset();
    const { getByTestId } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} isSelected={true} />
    );

    expect(getByTestId('sparkles-icon')).toBeTruthy();
  });

  it('applies selected styling classes when isSelected', () => {
    const preset = makePreset();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} isSelected={true} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ring-2');
    expect(card.className).toContain('ring-accent');
  });

  it('applies default styling classes when not selected', () => {
    const preset = makePreset();
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} isSelected={false} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ring-1');
    expect(card.className).toContain('ring-border');
  });

  it('handles empty tags array', () => {
    const preset = makePreset({ tags: [] });
    const { getByText } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    expect(getByText('Aria')).toBeTruthy();
  });

  it('renders with different emoji', () => {
    const preset = makePreset({ emoji: '🐉' });
    const { getByText } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    expect(getByText('🐉')).toBeTruthy();
  });

  it('truncates long names via CSS class', () => {
    const preset = makePreset({ name: 'A Very Long Preset Name That Should Be Truncated' });
    const { container } = render(
      <PresetCard preset={preset} index={0} onSelect={jest.fn()} />
    );

    const nameEl = container.querySelector('.truncate');
    expect(nameEl).toBeTruthy();
  });
});
