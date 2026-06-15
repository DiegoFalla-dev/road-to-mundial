import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { MatchDetail } from '../../core/models';
import { ProbabilityBarComponent } from '../../shared/probability-bar.component';

@Component({
  selector: 'rtm-match',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, ProbabilityBarComponent],
  template: `
    @if (data(); as d) {
      <a routerLink="/" class="back rtm-muted">← Volver</a>
      <section class="rtm-card head rtm-fade-in">
        <div class="meta rtm-muted">
          <span class="rtm-badge">Grupo {{ d.match.groupName }}</span>
          <span>{{ d.match.kickoff | date: 'EEEE d MMM · HH:mm' }}</span>
        </div>
        <div class="teams">
          <a class="team" [routerLink]="['/seleccion', d.match.homeTeamId]">
            <b class="code">{{ d.match.homeTeamCode }}</b>
            <span>{{ d.match.homeTeamName }}</span>
          </a>
          <div class="center">
            @if (d.match.status === 'FINISHED') {
              <span class="final">{{ d.match.homeScore }} - {{ d.match.awayScore }}</span>
            } @else {
              <span class="vs">VS</span>
            }
          </div>
          <a class="team right" [routerLink]="['/seleccion', d.match.awayTeamId]">
            <b class="code">{{ d.match.awayTeamCode }}</b>
            <span>{{ d.match.awayTeamName }}</span>
          </a>
        </div>
        <div class="venue rtm-muted">{{ d.match.venue }}</div>
      </section>

      <section class="rtm-card pad rtm-fade-in">
        <h2>Probabilidades estimadas</h2>
        <rtm-probability-bar
          [p]="d.prediction.probabilities"
          [homeLabel]="d.match.homeTeamName"
          [awayLabel]="d.match.awayTeamName"
        />
        <div class="grid-info">
          <div><span class="rtm-muted">Confianza</span><b [class]="'c-' + d.prediction.confidence.toLowerCase()">{{ d.prediction.confidence }}</b></div>
          <div><span class="rtm-muted">Goles esperados</span><b>{{ d.prediction.expectedGoals.home }} – {{ d.prediction.expectedGoals.away }}</b></div>
          <div><span class="rtm-muted">Rating local</span><b>{{ d.prediction.homeRating.composite | number: '1.0-0' }}</b></div>
          <div><span class="rtm-muted">Rating visitante</span><b>{{ d.prediction.awayRating.composite | number: '1.0-0' }}</b></div>
        </div>
      </section>

      <div class="two">
        <section class="rtm-card pad">
          <h3>Factores clave</h3>
          <ul class="pos">
            @for (f of d.prediction.factorsFor; track f) { <li>{{ f }}</li> }
          </ul>
          @if (d.prediction.factorsAgainst.length) {
            <ul class="neg">
              @for (f of d.prediction.factorsAgainst; track f) { <li>{{ f }}</li> }
            </ul>
          }
        </section>
        <section class="rtm-card pad">
          <h3>Riesgos</h3>
          <ul class="risk">
            @for (r of d.prediction.risks; track r) { <li>{{ r }}</li> }
          </ul>
        </section>
      </div>

      <section class="rtm-card pad">
        <h3>Conclusión automática</h3>
        <p>{{ conclusion(d) }}</p>
        <p class="disclaimer rtm-muted">⚠️ {{ d.prediction.disclaimer }}</p>
      </section>
    } @else {
      <div class="rtm-card pad"><div class="rtm-skeleton" style="height: 320px"></div></div>
    }
  `,
  styleUrl: './match.component.scss',
})
export class MatchComponent implements OnInit {
  private readonly api = inject(ApiService);
  @Input({ required: true }) id!: string;
  readonly data = signal<MatchDetail | null>(null);

  ngOnInit(): void {
    this.api.matchDetail(this.id).subscribe((d) => this.data.set(d));
  }

  conclusion(d: MatchDetail): string {
    const p = d.prediction.probabilities;
    const top = Math.max(p.homeWin, p.draw, p.awayWin);
    const who =
      top === p.homeWin ? d.match.homeTeamName : top === p.awayWin ? d.match.awayTeamName : null;
    if (!who) {
      return `El modelo no encuentra un favorito claro: el empate es el escenario más probable (${p.draw}%). Encuentro muy abierto.`;
    }
    return `El modelo favorece a ${who} con un ${top}% de probabilidad, con un nivel de confianza ${d.prediction.confidence.toLowerCase()}. Resultado más probable orientado a ${d.prediction.expectedGoals.home} – ${d.prediction.expectedGoals.away}.`;
  }
}
