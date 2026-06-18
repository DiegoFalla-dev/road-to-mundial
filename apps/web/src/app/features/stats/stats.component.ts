import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { TeamProfile } from '../../core/models';

interface StatRow {
  id: string;
  code: string;
  name: string;
  confederation: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  rating: number;
}

interface ScatterPoint {
  code: string;
  name: string;
  attack: number;
  defense: number;
  left: number;
  top: number;
  tone: 'secondary' | 'tertiary' | 'outline' | 'error';
}

interface TrendItem {
  code: string;
  name: string;
  value: number;
}

@Component({
  selector: 'rtm-stats',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly teams = signal<TeamProfile[]>([]);
  readonly confFilter = signal<string>('Todas');

  readonly confederations = computed<string[]>(() => {
    const set = new Set(this.teams().map((t) => t.confederation));
    return ['Todas', ...[...set].sort()];
  });

  readonly rows = computed<StatRow[]>(() => {
    const conf = this.confFilter();
    return this.teams()
      .filter((t) => conf === 'Todas' || t.confederation === conf)
      .map((t) => {
        const f = t.form[10];
        return {
          id: t.id,
          code: t.code,
          name: t.name,
          confederation: t.confederation,
          played: f.played,
          wins: f.wins,
          draws: f.draws,
          losses: f.losses,
          goalsFor: f.goalsFor,
          goalsAgainst: f.goalsAgainst,
          goalDiff: f.goalsFor - f.goalsAgainst,
          rating: Math.round(t.historicalRating),
        };
      })
      .sort((a, b) => b.rating - a.rating);
  });

  /** Mejor ataque (goles anotados por partido), top 5. */
  readonly trending = computed<TrendItem[]>(() =>
    [...this.teams()]
      .sort((a, b) => b.offensive.avgGoalsScored - a.offensive.avgGoalsScored)
      .slice(0, 5)
      .map((t) => ({ code: t.code, name: t.name, value: t.offensive.avgGoalsScored })),
  );

  /** Scatter eficiencia: x = goles anotados/partido, y = goles recibidos/partido. */
  readonly scatter = computed<ScatterPoint[]>(() => {
    const ts = this.teams();
    if (!ts.length) return [];
    const atk = ts.map((t) => t.offensive.avgGoalsScored);
    const def = ts.map((t) => t.defensive.avgGoalsConceded);
    const minA = Math.min(...atk), maxA = Math.max(...atk);
    const minD = Math.min(...def), maxD = Math.max(...def);
    const spanA = maxA - minA || 1;
    const spanD = maxD - minD || 1;
    return ts.map((t) => {
      const a = t.offensive.avgGoalsScored;
      const d = t.defensive.avgGoalsConceded;
      const left = 5 + ((a - minA) / spanA) * 90; // más ataque = derecha
      const top = 5 + ((d - minD) / spanD) * 90; // menos goles recibidos = arriba
      const eff = a - d;
      const tone: ScatterPoint['tone'] =
        eff >= 0.6 ? 'secondary' : eff >= 0.1 ? 'tertiary' : eff >= -0.4 ? 'outline' : 'error';
      return { code: t.code, name: t.name, attack: a, defense: d, left, top, tone };
    });
  });

  ngOnInit(): void {
    this.api.listTeams().subscribe((t) => this.teams.set(t));
  }
}
