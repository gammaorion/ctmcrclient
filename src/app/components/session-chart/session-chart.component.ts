import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

import { Session } from 'src/app/models/session.model';
import { Tournament } from 'src/app/models/tournament.model';
import { TournamentService } from 'src/app/services/tournament.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-session-chart',
  templateUrl: './session-chart.component.html',
  styleUrls: ['./session-chart.component.css']
})
export class SessionChartComponent implements OnInit {
  currentTournament?: Tournament;
  sessionsArray?: Array<any>;
  sessionsMap?: any;   // it must be a 2D map (tour, table)
  tournamentId?: any;

  tables = 0;
  tours = 0;

  sessionForm?: any;

  loadComplete = false;

  constructor(
    private tournamentService: TournamentService,
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.params.id;
    this.initialRetrieve();
  }

  initialRetrieve(): void {
    this.tournamentService.get(this.tournamentId)
      .subscribe(
        data => {
          this.currentTournament = data;
          this.tables = this.currentTournament.tablesAmt;
          this.tours = this.currentTournament.toursAmt;
          console.log("Tournament got for the chart, loading sessions");
          this.retrieveSessions();
        },
        err => {
          console.log(err);
        }
      );
  }

  retrieveSessions(): void {
    this.sessionService.getByTournament(this.tournamentId)
      .subscribe(
        data => {
          this.sessionsArray = data;

          const resultMap = [];

          for (let i = 0; i < this.tours; ++i) {
            let currentTour = [];
            for (let j = 0; j < this.tables; ++j) {
              let emptySession: Session = {
                id: '',
                tournamentId: this.tournamentId,
                tourNumber: i + 1,
                tableNumber: j + 1,
                dealsPlayed: 0
              };
              currentTour.push(emptySession);
            }

            resultMap.push(currentTour);
          }

          for (let i = 0; i < this.sessionsArray.length; ++i) {
            let currentSession = this.sessionsArray[i];
            resultMap[currentSession.tourNumber - 1][currentSession.tableNumber - 1] = currentSession;
          }

          this.sessionsMap = resultMap;

          console.log("Sessions loaded successfully");

          this.prepareSessionsForShow();

          this.loadComplete = true;
        },
        err => {
          console.log(err);
        }
      );
  }

  getSessionMapForm(): FormArray {
    return this.sessionForm.get('sessionmap') as FormArray;
  }

  prepareSessionsForShow(): void {
    this.sessionForm = new FormGroup({
      'sessionmap' : new FormArray([])
    });

    for (let i = 0; i < this.tours; ++i) {
      let tourForm = new FormArray([]);

      for (let j = 0; j < this.tables; ++j) {
        let currentSession = this.sessionsMap[i][j];
        tourForm.controls.push(currentSession);
      }

      this.getSessionMapForm().controls.push(tourForm);
    }
  }
};
