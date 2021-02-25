import { Component, OnInit } from '@angular/core';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-tournaments-list',
  templateUrl: './tournaments-list.component.html',
  styleUrls: ['./tournaments-list.component.css']
})
export class TournamentsListComponent implements OnInit {
  tournaments?: Tournament[];
  currentTournament?: Tournament;
  currentIndex = -1;
  title = '';

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
    this.retrieveTournaments();
  }

  retrieveTournaments(): void {
    this.tournamentService.getAll()
      .subscribe(
        data => {
          this.tournaments = data;
          console.log("Successfully retrieved tournaments");
        },
        error => {
          console.log(error);
        }
      );
  }

  refreshList(): void {
    this.retrieveTournaments();
    this.currentTournament = undefined;
    this.currentIndex = -1;
  }

  setActiveTournament(tournament: Tournament, index: number): void {
    this.currentTournament = tournament;
    this.currentIndex = index;
  }

  // removeall? searchTitle?
}
