import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { BREAKDOWN_LABELS } from '../../core/models';
import type { MatchResult, ScoreBreakdown, TeamProfileView } from '../../core/models';

@Component({
  selector: 'rtm-team',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  template: `
    @if (team(); as t) {
      <a routerLink="/" class="back rtm-muted">← Volver</a>
      <section class="rtm-card head rtm-fade-in">
        <div class="crest">{{ t.code }}</div>
        <div class="info">
          <h1>{{ t.name }}</h1>
          <div class="tags">
            <span class="rtm-badge">{{ t.confederation }}</span>
            @if (t.formation) { <span class="rtm-badge">Sistema {{ t.formation }}</span> }
            <span class="rtm-badge">Rating {{ t.historicalRating }}</span>
          </div>
        </div>
      </section>

      <section class="rtm-card pad rtm-fade-in">
        <h2>Valoración del modelo</h2>
        <div class="rating-head">
          <b class="big">{{ t.rating.composite | number: '1.0-0' }}</b>
          <span class="rtm-muted">Puntaje compuesto (0–100)</span>
        </div>
        <div class="bd">
          @for (b of breakdownRows(); track b.label) {
            <div class="bd-row">
              <span>{{ b.label }}</span>
              <div class="bd-track"><div class="bd-fill" [style.width.%]="b.value"></div></div>
              <b>{{ b.value }}</b>
            </div>
          }
        </div>
        <div class="trends">
          @if (t.trends.currentStreak; as st) {
            <span class="rtm-badge">Racha actual: {{ st.count }}{{ st.type }}</span>
          }
          <span class="rtm-badge">Sin perder: {{ t.trends.unbeatenRun }}</span>
          <span class="rtm-badge">Puntos/partido: {{ t.trends.pointsPerGame }}</span>
          <span class="rtm-badge">% victorias: {{ t.trends.winRate }}%</span>
        </div>
      </section>

      <section class="rtm-card pad rtm-fade-in">
        <h2>Forma reciente (últimos 5)</h2>
        <div class="form-chips">
          @for (r of recent(); track $index) {
            <span class="chip" [class]="r.toLowerCase()">{{ r }}</span>
          }
        </div>
        <div class="record rtm-muted">
          {{ t.form[5].wins }}V · {{ t.form[5].draws }}E · {{ t.form[5].losses }}D ·
          {{ t.form[5].goalsFor }}:{{ t.form[5].goalsAgainst }} goles
        </div>
      </section>

      <div class="two">
        <section class="rtm-card pad">
          <h2>Estadísticas</h2>
          <div class="stat"><span>Goles anotados / partido</span><b>{{ t.offensive.avgGoalsScored | number: '1.2-2' }}</b></div>
          <div class="stat"><span>Goles recibidos / partido</span><b>{{ t.defensive.avgGoalsConceded | number: '1.2-2' }}</b></div>
          <div class="stat"><span>Tiros / partido</span><b>{{ t.offensive.avgShots | number: '1.1-1' }}</b></div>
          <div class="stat"><span>Tiros a puerta / partido</span><b>{{ t.offensive.avgShotsOnTarget | number: '1.1-1' }}</b></div>
          <div class="stat"><span>Efectividad ofensiva</span><b>{{ t.offensive.conversionRate * 100 | number: '1.0-0' }}%</b></div>
          <div class="stat"><span>Porterías a cero (10)</span><b>{{ t.defensive.cleanSheets }}</b></div>
          <div class="stat"><span>Diferencia de goles (10)</span><b>{{ t.goalDifference > 0 ? '+' : '' }}{{ t.goalDifference }}</b></div>
        </section>

        <section class="rtm-card pad">
          <h2>Evolución del rendimiento</h2>
          <p class="rtm-muted small">Puntos por partido en cada ventana de análisis.</p>
          @for (w of windows; track w) {
            <div class="evo">
              <span>Últimos {{ w }}</span>
              <div class="track"><div class="fill" [style.width.%]="ppgPct(w)"></div></div>
              <b>{{ ppg(w) | number: '1.2-2' }}</b>
            </div>
          }
          <div class="squad rtm-muted">
            Plantilla: {{ t.squad.keyPlayersAvailable }}/{{ t.squad.totalKeyPlayers }} disponibles
            @if (t.squad.injured) { · {{ t.squad.injured }} lesionado(s) }
            @if (t.squad.suspended) { · {{ t.squad.suspended }} sancionado(s) }
          </div>
        </section>
      </div>
    } @else {
      <div class="rtm-card pad"><div class="rtm-skeleton" style="height: 280px"></div></div>
    }
  `,
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  private readonly api = inject(ApiService);
  @Input({ required: true }) id!: string;
  readonly team = signal<TeamProfileView | null>(null);
  readonly windows: (5 | 10 | 15)[] = [5, 10, 15];

  readonly recent = computed<MatchResult[]>(() => {
    const t = this.team();
    return t ? [...t.form[5].sequence] : [];
  });

  /** Desglose del rating (8 dimensiones, 0–100) para el perfil. */
  readonly breakdownRows = computed(() => {
    const t = this.team();
    if (!t) return [];
    const keys = Object.keys(BREAKDOWN_LABELS) as (keyof ScoreBreakdown)[];
    return keys.map((k) => ({ label: BREAKDOWN_LABELS[k], value: Math.round(t.rating.breakdown[k]) }));
  });

  ngOnInit(): void {
    this.api.getTeam(this.id).subscribe((t) => this.team.set(t));
  }

  ppg(w: 5 | 10 | 15): number {
    const t = this.team();
    if (!t) return 0;
    const f = t.form[w];
    return f.played ? (f.wins * 3 + f.draws) / f.played : 0;
  }
  ppgPct(w: 5 | 10 | 15): number {
    return (this.ppg(w) / 3) * 100;
  }
}
