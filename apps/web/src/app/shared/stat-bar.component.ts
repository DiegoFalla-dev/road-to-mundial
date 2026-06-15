import { Component, Input, computed, signal } from '@angular/core';

/** Barra comparativa simétrica de una métrica entre dos equipos. */
@Component({
  selector: 'rtm-stat-bar',
  standalone: true,
  template: `
    <div class="row">
      <span class="val left" [class.win]="homeWins()">{{ format(home) }}</span>
      <div class="track">
        <div class="fill home" [style.width.%]="homePct()"></div>
        <div class="fill away" [style.width.%]="awayPct()"></div>
      </div>
      <span class="val right" [class.win]="!homeWins()">{{ format(away) }}</span>
    </div>
    <div class="label rtm-muted">{{ label }}</div>
  `,
  styles: [
    `
      .row {
        display: grid;
        grid-template-columns: 56px 1fr 56px;
        align-items: center;
        gap: 10px;
      }
      .track {
        display: flex;
        height: 8px;
        background: var(--rtm-surface-2);
        border-radius: 999px;
        overflow: hidden;
      }
      .fill {
        height: 100%;
        transition: width 0.5s ease;
      }
      .fill.home {
        background: var(--rtm-primary);
        border-radius: 999px 0 0 999px;
        margin-left: auto;
      }
      .fill.away {
        background: #6366f1;
        border-radius: 0 999px 999px 0;
      }
      .val {
        font-weight: 700;
        font-size: 14px;
      }
      .val.left {
        text-align: right;
      }
      .val.win {
        color: var(--rtm-primary);
      }
      .val.right.win {
        color: #818cf8;
      }
      .label {
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        margin: 4px 0 12px;
      }
    `,
  ],
})
export class StatBarComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) home = 0;
  @Input({ required: true }) away = 0;
  /** Si true, un valor menor es mejor (ej. goles recibidos). */
  @Input() lowerIsBetter = false;
  @Input() decimals = 2;

  private readonly _ = signal(0);

  homePct = computed(() => {
    const total = this.home + this.away;
    return total <= 0 ? 50 : (this.home / total) * 100;
  });
  awayPct = computed(() => 100 - this.homePct());

  homeWins(): boolean {
    return this.lowerIsBetter ? this.home <= this.away : this.home >= this.away;
  }

  format(v: number): string {
    return Number.isInteger(v) ? String(v) : v.toFixed(this.decimals);
  }
}
