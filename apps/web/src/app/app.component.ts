import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'rtm-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="rtm-container bar">
        <a routerLink="/" class="brand">
          <span class="ball">⚽</span>
          <span class="brand-text">Road to <strong>Mundial 2026</strong></span>
        </a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
            >Dashboard</a
          >
          <a routerLink="/comparador" routerLinkActive="active">Comparador</a>
        </nav>
        <button
          class="theme-toggle"
          type="button"
          (click)="theme.toggle()"
          [attr.aria-label]="theme.theme() === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'"
        >
          {{ theme.theme() === 'dark' ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <main class="rtm-container content">
      <router-outlet />
    </main>

    <footer class="rtm-container footer rtm-muted">
      <p>
        Datos: estimaciones del proyecto inspiradas en
        <a href="https://www.flashscore.pe/" target="_blank" rel="noopener">Flashscore.pe</a> y
        registros históricos públicos. Las probabilidades son estimaciones estadísticas, no
        garantías.
      </p>
    </footer>
  `,
  styles: [
    `
      .topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        backdrop-filter: blur(10px);
        background: color-mix(in srgb, var(--rtm-bg) 82%, transparent);
        border-bottom: 1px solid var(--rtm-border);
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 20px;
        height: 64px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: 700;
      }
      .ball {
        font-size: 22px;
      }
      .brand-text strong {
        color: var(--rtm-primary);
      }
      .nav {
        display: flex;
        gap: 6px;
        margin-left: auto;
      }
      .nav a {
        padding: 8px 14px;
        border-radius: 10px;
        font-weight: 600;
        color: var(--rtm-text-muted);
      }
      .nav a.active,
      .nav a:hover {
        color: var(--rtm-text);
        background: var(--rtm-surface-2);
      }
      .theme-toggle {
        cursor: pointer;
        border: 1px solid var(--rtm-border);
        background: var(--rtm-surface-2);
        border-radius: 10px;
        width: 40px;
        height: 40px;
        font-size: 16px;
      }
      .content {
        padding-top: 24px;
        padding-bottom: 40px;
        min-height: calc(100vh - 64px - 80px);
      }
      .footer {
        padding: 18px 16px 30px;
        font-size: 13px;
        border-top: 1px solid var(--rtm-border);
      }
      @media (max-width: 560px) {
        .brand-text {
          display: none;
        }
      }
    `,
  ],
})
export class AppComponent {
  readonly theme = inject(ThemeService);
}
