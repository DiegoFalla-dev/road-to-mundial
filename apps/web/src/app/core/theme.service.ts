import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

/** Gestiona el tema (dark/light) y lo persiste en el documento. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('dark');

  constructor() {
    const stored = this.readStored();
    const prefersLight =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: light)').matches;
    this.apply(stored ?? (prefersLight ? 'light' : 'dark'));
  }

  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    try {
      localStorage.setItem('rtm-theme', theme);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  private readStored(): Theme | null {
    try {
      const v = localStorage.getItem('rtm-theme');
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }
}
