import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWindowSize } from './useWindowSize';

describe('useWindowSize Custom Hook', () => {
  it('should return initial window sizes', () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current.width).toBe(window.innerWidth);
    expect(result.current.height).toBe(window.innerHeight);
  });

  it('should update sizes on window resize events', () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      // Simulate viewport size modifications
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(600);
  });
});
