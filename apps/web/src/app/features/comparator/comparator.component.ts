import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import type { ComparisonResult, TeamProfile } from '../../core/models';
import { RadarComponent, type RadarSeries } from '../../shared/radar.component';
import { KEY_PLAYERS, type KeyPlayer } from '../../core/key-players';

interface MetricBar {
  label: string;
  a: string;
  b: string;
  aPct: number;
}

@Component({
  selector: 'rtm-comparator',
  standalone: true,
  imports: [FormsModule, DecimalPipe, RadarComponent],
  templateUrl: './comparator.component.html',
})
export class ComparatorComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly teams = signal<TeamProfile[]>([]);
  readonly homeId = signal<string>('');
  readonly awayId = signal<string>('');
  readonly result = signal<ComparisonResult | null>(null);

  readonly radarLabels = ['Ataque', 'Posesión', 'Físico', 'Táctica', 'Defensa'];

  readonly radarSeries = computed<RadarSeries[]>(() => {
    const r = this.result();
    if (!r) return [];
    const pick = (b: any) => [b.offensive, b.opponentQuality, b.squad, b.tactical, b.defensive];
    return [
      { name: r.home.name, color: '#7bd0ff', values: pick(r.homeRating.breakdown) },
      { name: r.away.name, color: '#4ae176', values: pick(r.awayRating.breakdown) },
    ];
  });

  /** Métricas clave en barras divididas (izq = local cian, der = visitante verde). */
  readonly metrics = computed<MetricBar[]>(() => {
    const r = this.result();
    if (!r) return [];
    const p = r.prediction;
    const split = (a: number, b: number): number => {
      const t = a + b;
      return t <= 0 ? 50 : Math.round((a / t) * 100);
    };
    return [
      {
        label: 'Goles Esperados (xG)',
        a: p.expectedGoals.home.toFixed(1),
        b: p.expectedGoals.away.toFixed(1),
        aPct: split(p.expectedGoals.home, p.expectedGoals.away),
      },
      {
        label: 'Tiros a puerta / partido',
        a: r.home.offensive.avgShotsOnTarget.toFixed(1),
        b: r.away.offensive.avgShotsOnTarget.toFixed(1),
        aPct: split(r.home.offensive.avgShotsOnTarget, r.away.offensive.avgShotsOnTarget),
      },
      {
        label: 'Prob. Portería a Cero',
        a: `${p.markets.homeCleanSheet}%`,
        b: `${p.markets.awayCleanSheet}%`,
        aPct: split(p.markets.homeCleanSheet, p.markets.awayCleanSheet),
      },
      {
        label: 'Puntos Esperados (xPts)',
        a: p.markets.expectedPoints.home.toFixed(2),
        b: p.markets.expectedPoints.away.toFixed(2),
        aPct: split(p.markets.expectedPoints.home, p.markets.expectedPoints.away),
      },
    ];
  });

  readonly homePlayers = computed<KeyPlayer[]>(() => KEY_PLAYERS[this.homeId()] ?? []);
  readonly awayPlayers = computed<KeyPlayer[]>(() => KEY_PLAYERS[this.awayId()] ?? []);

  ngOnInit(): void {
    this.api.listTeams().subscribe((t) => {
      this.teams.set(t);
      if (t.length >= 2) {
        this.homeId.set(t.find((x) => x.id === 'arg')?.id ?? t[0]!.id);
        this.awayId.set(t.find((x) => x.id === 'fra')?.id ?? t[1]!.id);
        this.compare();
      }
    });
  }

  compare(): void {
    const h = this.homeId();
    const a = this.awayId();
    if (!h || !a || h === a) return;
    this.api.compare(h, a).subscribe((r) => this.result.set(r));
  }
}
