import { Component, Input } from '@angular/core';
import type { OutcomeProbabilities } from '@rtm/core';

/** Barra 1X2 estilo casa de análisis: local / empate / visitante. */
@Component({
  selector: 'rtm-probability-bar',
  standalone: true,
  template: `
    <div class="wrap">
      <div class="bar" role="img" [attr.aria-label]="aria()">
        <span class="seg home" [style.width.%]="p.homeWin">{{ p.homeWin }}%</span>
        <span class="seg draw" [style.width.%]="p.draw">{{ p.draw }}%</span>
        <span class="seg away" [style.width.%]="p.awayWin">{{ p.awayWin }}%</span>
      </div>
      <div class="legend rtm-muted">
        <span>{{ homeLabel }} (1)</span>
        <span>Empate (X)</span>
        <span>{{ awayLabel }} (2)</span>
      </div>
    </div>
  `,
  styles: [
    `
      .bar {
        display: flex;
        height: 34px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid var(--rtm-border);
      }
      .seg {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 700;
        font-size: 13px;
        min-width: 0;
        transition: width 0.5s ease;
        white-space: nowrap;
        overflow: hidden;
      }
      .home {
        background: var(--rtm-primary);
      }
      .draw {
        background: #64748b;
      }
      .away {
        background: #6366f1;
      }
      .legend {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-top: 6px;
        font-weight: 600;
      }
    `,
  ],
})
export class ProbabilityBarComponent {
  @Input({ required: true }) p!: OutcomeProbabilities;
  @Input() homeLabel = 'Local';
  @Input() awayLabel = 'Visitante';

  aria(): string {
    return `Local ${this.p.homeWin}%, empate ${this.p.draw}%, visitante ${this.p.awayWin}%`;
  }
}
