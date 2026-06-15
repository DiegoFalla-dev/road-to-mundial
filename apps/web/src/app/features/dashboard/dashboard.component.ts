import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { MatchView, TeamProfile } from '../../core/models';

@Component({
  selector: 'rtm-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly loading = signal(true);
  readonly upcoming = signal<MatchView[]>([]);
  readonly finished = signal<MatchView[]>([]);
  readonly featured = signal<TeamProfile[]>([]);

  ngOnInit(): void {
    this.api.upcomingMatches(6).subscribe((m) => this.upcoming.set(m));
    this.api.finishedMatches(4).subscribe((m) => this.finished.set(m));
    this.api.listTeams().subscribe((teams) => {
      const top = [...teams].sort((a, b) => b.historicalRating - a.historicalRating).slice(0, 6);
      this.featured.set(top);
      this.loading.set(false);
    });
  }

  skeletons = Array.from({ length: 6 });
}
