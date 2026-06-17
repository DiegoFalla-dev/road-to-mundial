import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { MatchDetail, MatchView, TeamProfile } from '../../core/models';

@Component({
  selector: 'rtm-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly upcoming = signal<MatchView[]>([]);
  readonly featured = signal<MatchDetail | null>(null);
  readonly topTeams = signal<TeamProfile[]>([]);
  readonly loading = signal(true);

  /** Barras estáticas de tendencias xG (decorativas, como el diseño). */
  readonly xgBars = [
    { h: 40, v: '1.2', c: 'secondary' },
    { h: 60, v: '1.8', c: 'tertiary' },
    { h: 85, v: '2.5', c: 'secondary' },
    { h: 50, v: '1.5', c: 'tertiary' },
    { h: 70, v: '2.1', c: 'secondary' },
    { h: 90, v: '2.7', c: 'tertiary' },
  ];

  readonly feed = [
    { time: 'Hace 2 horas', color: 'secondary', text: 'Alerta: cambio de esquema detectado en entrenamientos de ESP (transición a 3-4-3).' },
    { time: 'Hace 5 horas', color: 'tertiary', text: 'Reporte de lesión: jugador clave de GER en duda; recalibrando métricas xG.' },
    { time: 'Ayer', color: 'outline-variant', text: 'Nuevo modelo predictivo de fatiga climática activo para sedes en México.' },
  ];

  readonly skeletons = Array.from({ length: 3 });

  /** Top selecciones por valoración, con un contador de "demanda" derivado. */
  readonly ranking = computed(() =>
    this.topTeams().map((t, i) => ({
      pos: i + 1,
      name: t.name,
      code: t.code,
      req: `+${12 - i * 2}k req`,
      hot: i < 2,
    })),
  );

  ngOnInit(): void {
    this.api.upcomingMatches(8).subscribe((m) => {
      this.upcoming.set(m);
      this.loading.set(false);
      if (m.length > 0) {
        this.api.matchDetail(m[0]!.id).subscribe((d) => this.featured.set(d));
      }
    });
    this.api.listTeams().subscribe((teams) => {
      this.topTeams.set([...teams].sort((a, b) => b.historicalRating - a.historicalRating).slice(0, 4));
    });
  }
}
