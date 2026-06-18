import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { TeamProfile } from '../../core/models';

@Component({
  selector: 'rtm-teams-list',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  template: `
    <header class="mb-stack-lg">
      <h2 class="text-[32px] leading-[40px] font-bold text-on-surface mb-1">Selecciones</h2>
      <p class="text-[16px] text-on-surface-variant">Las 48 selecciones del Mundial 2026. Selecciona una para ver su perfil analítico.</p>
    </header>

    @if (sorted().length) {
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-gutter">
        @for (t of sorted(); track t.id) {
          <a [routerLink]="['/seleccion', t.id]"
            class="bg-surface-container border border-outline-variant rounded-xl p-card-padding hover:bg-surface-container-high hover:border-tertiary transition-colors flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center font-data-mono text-tertiary text-[12px] shrink-0">{{ t.code }}</div>
            <div class="min-w-0 flex-1">
              <div class="text-[14px] font-semibold text-on-surface truncate">{{ t.name }}</div>
              <div class="text-[12px] text-on-surface-variant">{{ t.confederation }}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="font-data-mono text-secondary">{{ t.historicalRating | number: '1.0-0' }}</div>
              <div class="text-[10px] text-on-surface-variant uppercase">Rating</div>
            </div>
          </a>
        }
      </div>
    } @else {
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-gutter">
        @for (s of skeletons; track $index) {
          <div class="h-[78px] bg-surface-container rounded-xl border border-outline-variant animate-pulse"></div>
        }
      </div>
    }
  `,
})
export class TeamsListComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly teams = signal<TeamProfile[]>([]);
  readonly skeletons = Array.from({ length: 12 });

  readonly sorted = computed(() =>
    [...this.teams()].sort((a, b) => b.historicalRating - a.historicalRating),
  );

  ngOnInit(): void {
    this.api.listTeams().subscribe((t) => this.teams.set(t));
  }
}
