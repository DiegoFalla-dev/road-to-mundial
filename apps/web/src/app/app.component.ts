import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'rtm-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- TopNavBar -->
    <nav class="bg-surface-container border-b border-outline-variant fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16">
      <div class="flex items-center gap-stack-md w-1/3">
        <span class="text-[20px] font-bold text-on-surface">Elite Analytics</span>
      </div>
      <div class="flex-1 max-w-xl hidden md:flex">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            class="w-full bg-surface-container-highest border border-outline-variant text-on-surface rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-[14px]"
            placeholder="Buscar selecciones, jugadores o estadísticas..."
            type="text"
          />
        </div>
      </div>
      <div class="flex items-center gap-stack-sm w-1/3 justify-end">
        <button class="p-2 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full" aria-label="tema">
          <span class="material-symbols-outlined">dark_mode</span>
        </button>
        <div class="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant ml-2 flex items-center justify-center text-secondary">
          <span class="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>
    </nav>

    <!-- SideNavBar -->
    <aside class="bg-surface-container-low border-r border-outline-variant fixed left-0 top-16 h-[calc(100vh-64px)] w-60 flex flex-col p-stack-md z-40 hidden md:flex">
      <div class="mb-stack-lg flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant">
          <span class="material-symbols-outlined text-secondary">sports_soccer</span>
        </div>
        <div>
          <h2 class="text-[18px] font-semibold text-on-surface leading-tight">World Cup 2026</h2>
          <p class="text-on-surface-variant text-[12px]">Professional Suite</p>
        </div>
      </div>
      <nav class="flex-1 space-y-1">
        @for (item of nav; track item.label) {
          <a
            [routerLink]="item.link"
            routerLinkActive="bg-secondary-container text-on-secondary-container font-bold"
            [routerLinkActiveOptions]="{ exact: item.exact }"
            class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg transition-all"
          >
            <span class="material-symbols-outlined">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
      <div class="mt-auto space-y-stack-md pt-stack-md border-t border-outline-variant">
        <button class="w-full bg-secondary text-on-secondary text-[12px] tracking-wide py-2 px-4 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-[18px]">download</span> Exportar Reporte
        </button>
        <div class="space-y-1">
          <a class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg transition-all cursor-pointer">
            <span class="material-symbols-outlined">settings</span><span>Ajustes</span>
          </a>
          <a class="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-lg transition-all cursor-pointer">
            <span class="material-symbols-outlined">help</span><span>Soporte</span>
          </a>
        </div>
      </div>
    </aside>

    <!-- Main canvas -->
    <main class="md:ml-60 pt-16 min-h-screen bg-background">
      <div class="max-w-[1600px] mx-auto p-container-margin">
        <router-outlet />
      </div>
    </main>
  `,
})
export class AppComponent {
  readonly nav = [
    { label: 'Dashboard', icon: 'dashboard', link: '/', exact: true },
    { label: 'Match Center', icon: 'sports_soccer', link: '/partidos', exact: false },
    { label: 'Comparador', icon: 'compare_arrows', link: '/comparador', exact: false },
    { label: 'Selecciones', icon: 'groups', link: '/equipos', exact: false },
    { label: 'Estadísticas', icon: 'leaderboard', link: '/stats', exact: false },
    { label: 'AI Insights', icon: 'psychology', link: '/insights', exact: false },
  ];
}
