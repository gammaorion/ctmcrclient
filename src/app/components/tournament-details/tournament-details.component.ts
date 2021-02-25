import { Component, OnInit } from '@angular/core';
import { TournamentService } from 'src/app/services/tournament.service';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from 'src/app/models/tournament.model';

@Component({
  selector: 'app-tournament-details',
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.css']
})
export class TournamentDetailsComponent implements OnInit {
  currentTournament: Tournament = {
    title: '',
    eventdate: new Date(),
    place: '',
    toursAmt: 3,
    tablesAmt: 3,
    comment: '',
    isComplete: false
  };
  message = '';

  constructor(
    private tournamentService: TournamentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.message = '';
    this.getTournament(this.route.snapshot.params.id);
  }

  getTournament(id: string): void {
    this.tournamentService.get(id)
      .subscribe(
        data => {
          this.currentTournament = data;
          console.log("Successfully retrieved a tournament");
        },
        error => {
          console.log(error);
        }
      );
  }

  updateTournament(): void {
    this.tournamentService.update(this.currentTournament.id, this.currentTournament)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message;
        },
        error => {
          console.log(error);
        }
      );
  }

  updateComplete(status: boolean): void {
    const data = {
      isComplete: status
    };

    this.tournamentService.update(this.currentTournament.id, data)
      .subscribe(
        response => {
          this.currentTournament.isComplete = status;
          console.log("Updated completion status");
          this.message = response.message;
        },
        error => {
          console.log(error);
        }
      );
  }
}
