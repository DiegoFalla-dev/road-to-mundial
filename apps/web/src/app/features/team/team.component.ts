import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { MatchResult, TeamProfileView } from '../../core/models';
import { KEY_PLAYERS, type KeyPlayer } from '../../core/key-players';

interface PhaseStat {
  label: string;
  value: string;
  pct: number;
}

@Component({
  selector: 'rtm-team',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './team.component.html',
})
export class TeamComponent implements OnInit {
  private readonly api = inject(ApiService);
  @Input({ required: true }) id!: string;
  readonly team = signal<TeamProfileView | null>(null);

  readonly recent = computed<MatchResult[]>(() => {
    const t = this.team();
    return t ? [...t.form[5].sequence] : [];
  });

  readonly players = computed<readonly KeyPlayer[]>(() => KEY_PLAYERS[this.id] ?? []);

  /** Jugadores destacados ordenados por valoración (desc). */
  readonly topPlayers = computed<readonly KeyPlayer[]>(() =>
    [...this.players()].sort((a, b) => b.rating - a.rating),
  );

  private clamp(n: number): number {
    return Math.max(2, Math.min(100, Math.round(n)));
  }

  readonly attackStats = computed<PhaseStat[]>(() => {
    const t = this.team();
    if (!t) return [];
    const o = t.offensive;
    return [
      { label: 'Goles anotados / partido', value: o.avgGoalsScored.toFixed(2), pct: this.clamp((o.avgGoalsScored / 3) * 100) },
      { label: 'Tiros a puerta / partido', value: o.avgShotsOnTarget.toFixed(1), pct: this.clamp((o.avgShotsOnTarget / 8) * 100) },
      { label: 'Efectividad ofensiva', value: `${Math.round(o.conversionRate * 100)}%`, pct: this.clamp(o.conversionRate * 100) },
    ];
  });

  readonly defenseStats = computed<PhaseStat[]>(() => {
    const t = this.team();
    if (!t) return [];
    const d = t.defensive;
    return [
      { label: 'Goles recibidos / partido', value: d.avgGoalsConceded.toFixed(2), pct: this.clamp((1 - d.avgGoalsConceded / 3) * 100) },
      { label: 'Porterías a cero (últimos 10)', value: `${d.cleanSheets}`, pct: this.clamp((d.cleanSheets / 10) * 100) },
      { label: 'Remates recibidos / partido', value: d.avgShotsConceded.toFixed(1), pct: this.clamp((1 - d.avgShotsConceded / 15) * 100) },
    ];
  });

  ngOnInit(): void {
    this.api.getTeam(this.id).subscribe((t) => this.team.set(t));
  }
}
