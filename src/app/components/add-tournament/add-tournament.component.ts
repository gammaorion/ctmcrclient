import { Component, OnInit } from '@angular/core';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-add-tournament',
  templateUrl: './add-tournament.component.html',
  styleUrls: ['./add-tournament.component.css']
})
export class AddTournamentComponent implements OnInit {
  tournament: Tournament = {
    title: '',
    eventdate: new Date(),
    place: '',
    toursAmt: 3,
    tablesAmt: 3,
    comment: '',
    isComplete: false
  };
  submitted = false;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
  }

  saveTournament(): void {
    const data = {
      title: this.tournament.title,
      eventdate: this.tournament.eventdate,
      place: this.tournament.place,
      toursAmt: this.tournament.toursAmt,
      tablesAmt: this.tournament.tablesAmt,
      comment: this.tournament.comment
    };

    this.tournamentService.create(data)
      .subscribe(
        response => {
          console.log("Successfully created");
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newTournament(): void {
    this.submitted = false;
    this.tournament = {
      title: '',
      eventdate: new Date(),
      place: '',
      toursAmt: 3,
      tablesAmt: 3,
      comment: '',
      isComplete: false
    };
  }
}
