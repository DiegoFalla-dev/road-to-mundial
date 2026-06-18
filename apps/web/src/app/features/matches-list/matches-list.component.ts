import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { MatchView } from '../../core/models';

@Component({
  selector: 'rtm-matches-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <header class="mb-stack-lg">
      <h2 class="text-[32px] leading-[40px] font-bold text-on-surface mb-1">Match Center</h2>
      <p class="text-[16px] text-on-surface-variant">Próximos encuentros del Mundial 2026. Abre un partido para ver el análisis y las probabilidades.</p>
    </header>

    @if (upcoming().length) {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        @for (m of upcoming(); track m.id) {
          <a [routerLink]="['/partido', m.id]"
            class="bg-surface-container border border-outline-variant rounded-xl p-card-padding hover:bg-surface-container-high hover:border-tertiary transition-colors block">
            <div class="flex justify-between items-center text-[12px] text-on-surface-variant mb-3">
              <span>Grupo {{ m.groupName }}@if (m.kickoff) { · {{ m.kickoff | date: 'd MMM · HH:mm' }} }</span>
              <span class="bg-surface-container-highest px-2 py-1 rounded text-primary">Por jugar</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center font-data-mono text-[11px] text-tertiary">{{ m.homeTeamCode }}</div>
                <span class="text-[12px] font-semibold text-on-surface truncate max-w-full">{{ m.homeTeamName }}</span>
              </div>
              <div class="text-on-surface-variant font-data-mono px-2">vs</div>
              <div class="flex flex-col items-center gap-2 flex-1">
                <div class="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center font-data-mono text-[11px] text-error">{{ m.awayTeamCode }}</div>
                <span class="text-[12px] font-semibold text-on-surface truncate max-w-full">{{ m.awayTeamName }}</span>
              </div>
            </div>
          </a>
        }
      </div>
    } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        @for (s of skeletons; track $index) {
          <div class="h-[130px] bg-surface-container rounded-xl border border-outline-variant animate-pulse"></div>
        }
      </div>
    }
  `,
})
export class MatchesListComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly upcoming = signal<MatchView[]>([]);
  readonly skeletons = Array.from({ length: 6 });

  ngOnInit(): void {
    this.api.upcomingMatches(24).subscribe((m) => this.upcoming.set(m));
  }
}
