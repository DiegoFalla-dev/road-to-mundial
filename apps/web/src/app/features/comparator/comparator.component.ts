import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { BREAKDOWN_LABELS } from '../../core/models';
import type { ComparisonResult, ScoreBreakdown, TeamProfile } from '../../core/models';
import { ProbabilityBarComponent } from '../../shared/probability-bar.component';
import { StatBarComponent } from '../../shared/stat-bar.component';
import { RadarComponent, type RadarSeries } from '../../shared/radar.component';

@Component({
  selector: 'rtm-comparator',
  standalone: true,
  imports: [DecimalPipe, FormsModule, ProbabilityBarComponent, StatBarComponent, RadarComponent],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.scss',
})
export class ComparatorComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly teams = signal<TeamProfile[]>([]);
  readonly homeId = signal<string>('');
  readonly awayId = signal<string>('');
  readonly result = signal<ComparisonResult | null>(null);
  readonly loading = signal(false);

  readonly radarLabels = (Object.keys(BREAKDOWN_LABELS) as (keyof ScoreBreakdown)[]).map(
    (k) => BREAKDOWN_LABELS[k],
  );

  readonly radarSeries = computed<RadarSeries[]>(() => {
    const r = this.result();
    if (!r) return [];
    const keys = Object.keys(BREAKDOWN_LABELS) as (keyof ScoreBreakdown)[];
    return [
      { name: r.home.name, color: '#16a34a', values: keys.map((k) => r.homeRating.breakdown[k]) },
      { name: r.away.name, color: '#6366f1', values: keys.map((k) => r.awayRating.breakdown[k]) },
    ];
  });

  /** Filas de desglose numérico del modelo (8 dimensiones) lado a lado. */
  readonly breakdownRows = computed(() => {
    const r = this.result();
    if (!r) return [];
    const keys = Object.keys(BREAKDOWN_LABELS) as (keyof ScoreBreakdown)[];
    return keys.map((k) => ({
      label: BREAKDOWN_LABELS[k],
      home: Math.round(r.homeRating.breakdown[k]),
      away: Math.round(r.awayRating.breakdown[k]),
    }));
  });

  ngOnInit(): void {
    this.api.listTeams().subscribe((t) => {
      this.teams.set(t);
      if (t.length >= 2) {
        this.homeId.set(t.find((x) => x.id === 'arg')?.id ?? t[0]!.id);
        this.awayId.set(t.find((x) => x.id === 'bra')?.id ?? t[1]!.id);
        this.compare();
      }
    });
  }

  compare(): void {
    const h = this.homeId();
    const a = this.awayId();
    if (!h || !a || h === a) return;
    this.loading.set(true);
    this.api.compare(h, a).subscribe({
      next: (r) => {
        this.result.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
