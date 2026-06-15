import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { GroupStandings } from '../../core/models';

@Component({
  selector: 'rtm-standings',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Grupos · Mundial 2026</h1>
    <p class="rtm-muted note">
      Dos primeros de cada grupo y los 8 mejores terceros avanzan. La tabla se actualiza con cada
      resultado.
    </p>

    @if (loading()) {
      <div class="grid">
        @for (s of skeletons; track $index) {
          <div class="rtm-card pad"><div class="rtm-skeleton" style="height: 200px"></div></div>
        }
      </div>
    } @else {
      <div class="grid">
        @for (g of groups(); track g.group) {
          <section class="rtm-card pad rtm-fade-in">
            <h2>Grupo {{ g.group }}</h2>
            <table>
              <thead>
                <tr>
                  <th class="l">#</th>
                  <th class="l">Selección</th>
                  <th>PJ</th>
                  <th>DG</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                @for (r of g.rows; track r.teamId) {
                  <tr [class.qualify]="r.rank <= 2">
                    <td class="l rank">{{ r.rank }}</td>
                    <td class="l">
                      <a [routerLink]="['/seleccion', r.teamId]"
                        ><b class="code">{{ r.code }}</b> {{ r.name }}</a
                      >
                    </td>
                    <td>{{ r.played }}</td>
                    <td>{{ r.goalDiff > 0 ? '+' : '' }}{{ r.goalDiff }}</td>
                    <td class="pts">{{ r.points }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </section>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      h1 {
        font-size: 24px;
        margin: 0 0 6px;
      }
      .note {
        font-size: 13px;
        margin: 0 0 20px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }
      .pad {
        padding: 18px;
      }
      h2 {
        font-size: 16px;
        margin: 0 0 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      th,
      td {
        text-align: center;
        padding: 8px 6px;
        border-bottom: 1px solid var(--rtm-border);
      }
      th {
        font-size: 11px;
        color: var(--rtm-text-muted);
        text-transform: uppercase;
      }
      .l {
        text-align: left;
      }
      .rank {
        color: var(--rtm-text-muted);
        width: 22px;
      }
      .code {
        color: var(--rtm-primary);
        font-weight: 800;
        margin-right: 4px;
      }
      .pts {
        font-weight: 800;
      }
      tr.qualify td {
        background: color-mix(in srgb, var(--rtm-primary) 12%, transparent);
      }
      tbody tr:last-child td {
        border-bottom: none;
      }
    `,
  ],
})
export class StandingsComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly groups = signal<GroupStandings[]>([]);
  readonly loading = signal(true);
  readonly skeletons = Array.from({ length: 12 });

  ngOnInit(): void {
    this.api.standings().subscribe({
      next: (g) => {
        this.groups.set(g);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
