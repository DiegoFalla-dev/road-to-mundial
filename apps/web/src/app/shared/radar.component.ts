import { Component, Input, computed, signal } from '@angular/core';

export interface RadarSeries {
  readonly name: string;
  readonly color: string;
  readonly values: readonly number[]; // 0..100, alineado con labels
}

/** Gráfico radar en SVG puro (sin dependencias) para comparar perfiles 0–100. */
@Component({
  selector: 'rtm-radar',
  standalone: true,
  template: `
    <svg [attr.viewBox]="'0 0 ' + size + ' ' + size" class="radar" role="img"
      [attr.aria-label]="'Radar comparativo de ' + labels.length + ' dimensiones'">
      @for (ring of rings; track ring) {
        <polygon [attr.points]="ringPoints(ring)" class="grid-ring" />
      }
      @for (a of axes(); track a.label) {
        <line [attr.x1]="center" [attr.y1]="center" [attr.x2]="a.x" [attr.y2]="a.y" class="axis" />
        <text [attr.x]="a.lx" [attr.y]="a.ly" class="axis-label"
          [attr.text-anchor]="a.anchor">{{ a.label }}</text>
      }
      @for (s of polygons(); track s.name) {
        <polygon [attr.points]="s.points" [attr.fill]="s.color" fill-opacity="0.18"
          [attr.stroke]="s.color" stroke-width="2" />
      }
    </svg>
  `,
  styles: [
    `
      .radar {
        width: 100%;
        height: auto;
        max-width: 360px;
        display: block;
        margin: 0 auto;
      }
      .grid-ring {
        fill: none;
        stroke: var(--rtm-border);
        stroke-width: 1;
      }
      .axis {
        stroke: var(--rtm-border);
        stroke-width: 1;
      }
      .axis-label {
        fill: var(--rtm-text-muted);
        font-size: 9px;
        font-weight: 600;
      }
    `,
  ],
})
export class RadarComponent {
  @Input({ required: true }) labels: readonly string[] = [];
  @Input({ required: true }) set series(v: readonly RadarSeries[]) {
    this._series.set(v);
  }

  readonly size = 280;
  readonly center = 140;
  readonly radius = 96;
  readonly rings = [0.25, 0.5, 0.75, 1];
  private readonly _series = signal<readonly RadarSeries[]>([]);

  private point(index: number, ratio: number): { x: number; y: number } {
    const n = this.labels.length || 1;
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return {
      x: this.center + Math.cos(angle) * this.radius * ratio,
      y: this.center + Math.sin(angle) * this.radius * ratio,
    };
  }

  ringPoints(ratio: number): string {
    return this.labels
      .map((_, i) => {
        const p = this.point(i, ratio);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(' ');
  }

  axes = computed(() =>
    this.labels.map((label, i) => {
      const edge = this.point(i, 1);
      const lbl = this.point(i, 1.22);
      const anchor = lbl.x < this.center - 4 ? 'end' : lbl.x > this.center + 4 ? 'start' : 'middle';
      return { label, x: edge.x, y: edge.y, lx: lbl.x, ly: lbl.y, anchor };
    }),
  );

  polygons = computed(() =>
    this._series().map((s) => ({
      name: s.name,
      color: s.color,
      points: s.values
        .map((v, i) => {
          const p = this.point(i, Math.max(0, Math.min(100, v)) / 100);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        })
        .join(' '),
    })),
  );
}
