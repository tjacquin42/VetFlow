import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    // Clean up before each test
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('initializes with system preference when no saved theme', () => {
    // Mock matchMedia to return dark mode preference
    window.matchMedia = (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { result } = renderHook(() => useDarkMode());

    // Wait for initial effect to run
    act(() => {
      // Initial state is null before effect runs
    });

    expect(result.current.isDark).toBe(true);
  });

  it('initializes with saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useDarkMode());

    act(() => {
      // Wait for effects
    });

    expect(result.current.isDark).toBe(true);
  });

  it('applies dark class to html element when dark mode is enabled', () => {
    localStorage.setItem('theme', 'dark');

    renderHook(() => useDarkMode());

    act(() => {
      // Wait for effects
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from html element when light mode is enabled', () => {
    localStorage.setItem('theme', 'light');

    renderHook(() => useDarkMode());

    act(() => {
      // Wait for effects
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles dark mode and saves to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles from dark to light mode', () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('can toggle multiple times', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle(); // to dark
    });
    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggle(); // to light
    });
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggle(); // to dark again
    });
    expect(result.current.isDark).toBe(true);
  });
});
