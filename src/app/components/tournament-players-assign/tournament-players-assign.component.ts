import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Observable, forkJoin } from 'rxjs';

import { FormGroup, FormArray, FormControl } from '@angular/forms';

import { Tournament } from 'src/app/models/tournament.model';
import { Player } from 'src/app/models/player.model';
import { TournamentPlayer } from 'src/app/models/tournament-player.model';
import { TournamentService } from 'src/app/services/tournament.service';
import { PlayerService } from 'src/app/services/player.service';
import { TournamentPlayerService } from 'src/app/services/tournament-player.service';

@Component({
  selector: 'app-tournament-players-assign',
  templateUrl: './tournament-players-assign.component.html',
  styleUrls: ['./tournament-players-assign.component.css']
})
export class TournamentPlayersAssignComponent implements OnInit {
  allPlayers?: Player[];   // all players known
  currentTournament?: Tournament;
  tournPlayers?: TournamentPlayer[];  // bound with numbers
  newTournPlayers?: TournamentPlayer[];
  tournamentId?: any;

  playersForm = new FormGroup({
    players: new FormArray([])
  });

  tournamentPlayersGot = false;
  tournamentGot = false;
  allPlayersGot = false;

  loadComplete = false;
  message = '';

  constructor(
    private tournamentPlayersService: TournamentPlayerService,
    private tournamentService: TournamentService,
    private playerService: PlayerService,
    private route: ActivatedRoute
  ) {  }

  // all methods work asynchronously and change their respective vars
  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.params.id;
    this.tournamentPlayersGot = false;
    this.tournamentGot = false;
    this.allPlayersGot = false;
    this.loadComplete = false;

    this.retrieveTournamentPlayers();
    this.retrievePlayersList();
    this.retrieveTournament();
  }

  retrievePlayersList(): void {
    this.playerService.getAll()
      .subscribe(
        data => {
          this.allPlayers = data;
          this.allPlayers.sort(function(p1, p2) {
            let result = p1.surname > p2.surname;
            return result ? 1 : (p1.surname < p2.surname ? -1 : 0);
          });
          console.log("Successfully retrieved players for TPA");

          this.allPlayersGot = true;
          this.checkFullLoad();
        }
      );
  }

  retrieveTournament(): void {
    this.tournamentService.get(this.tournamentId)
      .subscribe(
        data => {
          this.currentTournament = data;

          console.log("Successfully retrieved a tournament for TPA");

          this.tournamentGot = true;
          this.checkFullLoad();
        },
        error => {
          console.log(error);
        }
      );
  }

  retrieveTournamentPlayers(): void {
    this.tournamentPlayersService.getForTournament(this.tournamentId)
      .subscribe(
        data => {
          this.tournPlayers = data;
          console.log("Got tournament players for TPA");

          this.tournamentPlayersGot = true;
          this.checkFullLoad();
        },
        error => {
          console.log(error);
        }
      );
  }

  groupPlayers(): FormArray {
    return this.playersForm.get('players') as FormArray;
  }

  checkFullLoad(): void {
    if (this.tournamentPlayersGot &&
      this.tournamentGot &&
      this.allPlayersGot) {
        console.log("Fully loaded data, completing");

        this.preparePlayersForShow();

        this.loadComplete = true;
      }
  }

  preparePlayersForShow(): void {
    this.playersForm = new FormGroup({
        players: new FormArray([])
      });

    for (let i = 0; i < this.currentTournament.tablesAmt * 4; ++i) {
      let savedPlayer = this.tournPlayers.find(el => { return el.playerNumber == i + 1; });
      let val = savedPlayer ? savedPlayer.playerId : '';
      this.groupPlayers().push(new FormGroup({ gplayer: new FormControl(val) }));
    }
  }

  savePlayersForTournament(): void {
    const groupArr = this.groupPlayers().controls;
    const groupLen = groupArr.length;
    const testArr = [];

    for (let i = 0; i < groupLen; ++i) {
      let elem = groupArr[i];
      let val = elem.get('gplayer').value;

      if (val.length < 1) {
        this.message = `Number ${i+1} has no player!`;
        return;
      }

      if (testArr.indexOf(val) != -1) {
        this.message = `Number ${i+1} repeats!`;
        return;
      }

      testArr[i] = val;
    }

    this.newTournPlayers = [];

    for (let i = 0; i < this.currentTournament.tablesAmt * 4; ++i) {
      this.newTournPlayers.push({
        tournamentId: this.currentTournament.id,
        playerId: testArr[i],
        playerNumber: i + 1
      });
    }

    this.tournamentPlayersService.deleteForTournament(
      this.currentTournament.id
    ).subscribe(
      data => {
        console.log(data);
        this.doSaveNewPlayers();
      },
      err => {
        this.message = err;
        console.log(err);
      }
    );
  }

  doSaveNewPlayers(): void {
    this.tournamentPlayersService.bulkCreate(
      this.newTournPlayers
    ).subscribe(
      data => {
        this.tournPlayers = this.newTournPlayers;

        this.loadComplete = false;
        this.preparePlayersForShow();
        this.loadComplete = true;
        this.message = "Saved successfully!";
      },
      err => {
        this.message = err;
        console.log(err);
      }
    );
  }
}
