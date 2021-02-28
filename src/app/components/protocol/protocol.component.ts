import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormGroup, FormArray, FormControl } from '@angular/forms';

// import { Tournament } from 'src/app/models/tournament.model';
import { Player } from 'src/app/models/player.model';
import { TournamentPlayer } from 'src/app/models/tournament-player.model';
import { Session } from 'src/app/models/session.model';
import { SessionPlayer } from 'src/app/models/session-player.model';
import { Deal } from 'src/app/models/deal.model';
// import { TournamentService } from 'src/app/services/tournament.service';
import { PlayerService } from 'src/app/services/player.service';
import { TournamentPlayerService } from 'src/app/services/tournament-player.service';
import { SessionService } from 'src/app/services/session.service';
import { SessionPlayerService } from 'src/app/services/session-player.service';
import { DealService } from 'src/app/services/deal.service';

import { articles } from 'src/share/article.dictionary';
import { dealresults } from 'src/share/dealresult.dictionary';

@Component({
  selector: 'app-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.css']
})
export class ProtocolComponent implements OnInit {
  currentSession?: Session;   // comes from DB
  sessionPlayers: {};   // from DB: sessionPlayers table
  sessionDeals?: Deal[]; // comes from DB, each deal has deal players in it
  tourPlayers?: Player[];  // comes from DB: full list of tournament players
  tableNumber?: number;
  tourNumber?: number;
  tournamentId?: any;
  sessionId?: any;
  tournamentTitle?: string;

  sessionForm?: FormGroup;  // upper selectors (players for session)

  numberedPlayers?: Array<any>;  // for select players (list of all tournament players)
  playerNumbers?: Array<any>;   // for deal winner and feeder selections
  playersMap?: any;    // to find wind by player ID
  playersPoints?: Array<any>;
  playersTourPoints?: any;
  dealActions?: FormGroup;  // left selectors (hand value - winner - feeder)

  loadComplete = false;

  constructor(
    private sessionService: SessionService,
    private dealService: DealService,
    private route: ActivatedRoute,
    private tournamentPlayerService: TournamentPlayerService,
    private sessionPlayerService: SessionPlayerService,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.params.tournament) {
      this.createNewSession();
    } else {
      this.sessionId = this.route.snapshot.params.id;
      this.loadExistingSession();
    }
  }

  createNewSession(): void {
    const params = this.route.snapshot.params;

    this.sessionService.create({
      tournamentId: params.tournament,
      tableNumber: params.table,
      tourNumber: params.tour
    }).subscribe(
        data => {
          this.currentSession = data;

          this.tableNumber = this.currentSession.tableNumber;
          this.tourNumber = this.currentSession.tourNumber;

          this.loadTournamentPlayers();
        },
        err => {
          console.log(err);
        }
      );
  }

  loadExistingSession(): void {
    this.sessionService.getOne(this.sessionId)
      .subscribe(
        data => {
          this.currentSession = data;

          this.tableNumber = this.currentSession.tableNumber;
          this.tourNumber = this.currentSession.tourNumber;

          this.loadTournamentPlayers();
        },
        err => {
          console.log(err);
        }
      );
  }

  loadTournamentPlayers(): void {
    this.tournamentPlayerService.getPlayersForTournament(
      this.currentSession.tournamentId
    ).subscribe(
      data => {
        this.tourPlayers = data;

        // tournament name can be found in linked object "teournaments"
        //  for any player in the array

        this.tournamentTitle = this.tourPlayers[0].tournaments[0].title;

        this.loadSessionPlayers();
      },
      err => {
        console.log(err);
      }
    );
  }

  loadSessionPlayers(): void {
    this.sessionPlayerService.getBySession(
      this.currentSession.id
    ).subscribe(
      data => {
        if (data && data.length > 0) {
          this.sessionPlayers = {};

          for (let i = 0; i < data.length; ++i) {
            this.sessionPlayers[data[i].wind] = data[i];
          }
        } else {
          this.sessionPlayers = {
            "EAST": {
              wind: "EAST",
              sessionId: this.currentSession.id,
              playerId: 0,
              tourPts: 0,
              gamePts: 0
            },
            "SOUTH": {
              wind: "SOUTH",
              sessionId: this.currentSession.id,
              playerId: 0,
              tourPts: 0,
              gamePts: 0
            },
            "WEST": {
              wind: "WEST",
              sessionId: this.currentSession.id,
              playerId: 0,
              tourPts: 0,
              gamePts: 0
            },
            "NORTH": {
              wind: "NORTH",
              sessionId: this.currentSession.id,
              playerId: 0,
              tourPts: 0,
              gamePts: 0
            }
          };
        }

        this.loadFullDeals();
      },
      err => {
        console.log(err);
      }
    );
  }

  loadFullDeals(): void {
    this.dealService.getFullBySession(
      this.currentSession.id
    ).subscribe(
      data => {
        this.sessionDeals = data;

        this.prepareForms();
      },
      err => {
        console.log(err);
      }
    );
  }

  prepareForms(): void {
    this.makeTourPlayersNumberedList();  // for sessionForm (top selectors)
    this.makePlayerNumbersList();   // for dealActions (left selectors)
    this.makePlayersPointsArray();  // simplified for showing
    this.makeDealActionsForm();   // left part of the protocol

    // only players' selection - they affect DealActions
    this.sessionForm = new FormGroup({
      playerEast : new FormControl(this.sessionPlayers['EAST'].playerId),
      playerSouth: new FormControl(this.sessionPlayers['SOUTH'].playerId),
      playerWest : new FormControl(this.sessionPlayers['WEST'].playerId),
      playerNorth: new FormControl(this.sessionPlayers['NORTH'].playerId)
    });

    // this.fillDealsForShow();   // replaced with makePlayersPointsArray

    this.loadComplete = true;
  }

  makeTourPlayersNumberedList(): void {
    const numberedPlayers = [];

    for (let i = 0; i < this.tourPlayers.length; ++i) {
      numberedPlayers.push({
        id: this.tourPlayers[i].id,
        "number": this.tourPlayers[i].tournaments[0].tournamentPlayer.playerNumber,
        "value": `${this.tourPlayers[i].tournaments[0].tournamentPlayer.playerNumber} - ${this.tourPlayers[i].surname} ${this.tourPlayers[i].firstname}`
      });
    }

    numberedPlayers.sort((el1, el2) => { return el1["number"] > el2["number"] ? 1 : (el1["number"] < el2["number"] ? -1 : 0); });

    this.numberedPlayers = numberedPlayers;
  }

  makePlayerNumbersList(): void {
    const playerNumbers = [];
    const playersMap = {};

    for (let i in this.sessionPlayers) {
      let playerNum = 0;

      for (let j = 0; j < this.numberedPlayers.length; ++j) {
        if (this.numberedPlayers[j].id === this.sessionPlayers[i].playerId) {
          playerNum = this.numberedPlayers[j].number;
          break;
        }
      }

      playerNumbers.push({
        id: this.sessionPlayers[i].playerId,
        num: playerNum
      });

      playersMap[this.sessionPlayers[i].playerId] = i;
    }

    playerNumbers.sort((el1, el2) => { return el1.num > el2.num ? 1 : (el1.num < el2.num ? -1 : 0); });

    this.playerNumbers = playerNumbers;
    this.playersMap = playersMap;
  }

  /**
   * preparing chart for central part
   */
  makePlayersPointsArray(): void {
    this.playersPoints = [];

    // assuming that after sort deals will start from 1 and without gaps
    this.sessionDeals.sort((el1, el2) => { return el1.dealNumber > el2.dealNumber ? 1 : (el1.dealNumber < el2.dealNumber ? -1 : 0); });

    const cumulativeSums = {
      "EAST": 0,
      "SOUTH": 0,
      "WEST": 0,
      "NORTH": 0
    };

    const usualPointsArticles = [articles.DISCARDWIN, articles.SELFWIN,
      articles.DISCARDFEED, articles.PASSIVELOSS,
      articles.SELFLOSS];
    const penaltyPointsArticles = [articles.LOWPTSPENALTY,
      articles.LOWPTSPENALTYPLUS, articles.NOSTRUCTPENALTY,
      articles.NOSTRUCTPENALTYPLUS, articles.REFEREEPENALTY];

    for (let i = 0; i < 16; ++i) {
      let rowElem = {
        "EAST": {
          dealPoints: 0,
          dealCode: articles.UNDEF,
          cumulativePoints: cumulativeSums.EAST,
          penalty: 0,
          penaltyCode: 0,  // later
          comment: ''
        },
        "SOUTH": {
          dealPoints: 0,
          dealCode: articles.UNDEF,
          cumulativePoints: cumulativeSums.SOUTH,
          penalty: 0,
          penaltyCode: 0,  // later
          comment: ''
        },
        "WEST": {
          dealPoints: 0,
          dealCode: articles.UNDEF,
          cumulativePoints: cumulativeSums.WEST,
          penalty: 0,
          penaltyCode: 0,  // later
          comment: ''
        },
        "NORTH": {
          dealPoints: 0,
          dealCode: articles.UNDEF,
          cumulativePoints: cumulativeSums.NORTH,
          penalty: 0,
          penaltyCode: 0,  // later
          comment: ''
        },
        dealComment: ''
      };

      if (this.sessionDeals.length > i) {
        for (let j = 0; j < this.sessionDeals[i].players.length; ++j) {
          let currentWind = this.playersMap[this.sessionDeals[i].players[j].id];
          let currentArticle = this.sessionDeals[i].players[j].dealPlayer.article;

          if (usualPointsArticles.indexOf(currentArticle) != -1) {
            rowElem[currentWind].dealPoints = this.sessionDeals[i].players[j].dealPlayer.gamePoints;
            rowElem[currentWind].dealCode = currentArticle;
            rowElem[currentWind].cumulativePoints += this.sessionDeals[i].players[j].dealPlayer.gamePoints;

            if (this.sessionDeals[i].players[j].dealPlayer.comment) {
              rowElem[currentWind].comment = this.sessionDeals[i].players[j].dealPlayer.comment;
            }

            cumulativeSums[currentWind] += this.sessionDeals[i].players[j].dealPlayer.gamePoints;
          } else if (penaltyPointsArticles.indexOf(currentArticle) != -1) {
            rowElem[currentWind].penaltyCode = currentArticle;
            rowElem[currentWind].penalty = this.sessionDeals[i].players[j].dealPlayer.gamePoints;
            rowElem[currentWind].cumulativePoints += this.sessionDeals[i].players[j].dealPlayer.gamePoints;

            if (this.sessionDeals[i].players[j].dealPlayer.comment) {
              rowElem[currentWind].comment = this.sessionDeals[i].players[j].dealPlayer.comment;
            }

            cumulativeSums[currentWind] += this.sessionDeals[i].players[j].dealPlayer.gamePoints;
          }
        }

        if (this.sessionDeals[i].dealComment) {
          rowElem.dealComment = this.sessionDeals[i].dealComment;
        }
      }

      this.playersPoints.push(rowElem);
    }

    this.calculateTourPoints();
  }

  calculateTourPoints(): void {
    const ptsArr = [
      {
        wind: 'EAST',
        gamePts: this.playersPoints[15].EAST.cumulativePoints,
        tourPts: 0
      },
      {
        wind: 'SOUTH',
        gamePts: this.playersPoints[15].SOUTH.cumulativePoints,
        tourPts: 0
      },
      {
        wind: 'WEST',
        gamePts: this.playersPoints[15].WEST.cumulativePoints,
        tourPts: 0
      },
      {
        wind: 'NORTH',
        gamePts: this.playersPoints[15].NORTH.cumulativePoints,
        tourPts: 0
      }
    ];

    ptsArr.sort((el1, el2) => { return el1.gamePts > el2.gamePts ? 1 : (el1.gamePts < el2.gamePts ? -1 : 0); });

    if (ptsArr[0].gamePts == ptsArr[1].gamePts) {
      if (ptsArr[0].gamePts == ptsArr[2].gamePts) {
        if (ptsArr[0].gamePts == ptsArr[3].gamePts) {
          for (let i = 0; i < 4; ++i) {
            ptsArr[i].tourPts = 1.75;
          }
        } else {
          for (let i = 0; i < 3; ++i) {
            ptsArr[i].tourPts = 1.75;
          }

          ptsArr[3].tourPts = 4;
        }
      } else {
        ptsArr[0].tourPts = 0.5;
        ptsArr[1].tourPts = 0.5;

        if (ptsArr[2].gamePts == ptsArr[3].gamePts) {
          ptsArr[2].tourPts = 3;
          ptsArr[3].tourPts = 3;
        } else {
          ptsArr[2].tourPts = 2;
          ptsArr[3].tourPts = 4;
        }
      }
    } else {
      ptsArr[0].tourPts = 0;

      if (ptsArr[1].gamePts == ptsArr[2].gamePts) {
        if (ptsArr[1].gamePts == ptsArr[3].gamePts) {
          for (let i = 1; i < 4; ++i) {
            ptsArr[i].tourPts = 2.3333;
          }
        } else {
          ptsArr[1].tourPts = 1.5;
          ptsArr[2].tourPts = 1.5;
          ptsArr[3].tourPts = 4;
        }
      } else {
        ptsArr[1].tourPts = 1;

        if (ptsArr[2].gamePts == ptsArr[3].gamePts) {
          ptsArr[2].tourPts = 3;
          ptsArr[3].tourPts = 3;
        } else {
          ptsArr[2].tourPts = 2;
          ptsArr[3].tourPts = 4;
        }
      }
    }

    this.playersTourPoints = {};

    for (let i = 0; i < 4; ++i) {
      this.playersTourPoints[ptsArr[i].wind] = ptsArr[i].tourPts;
    }
  }

  get dealActionsArray(): FormArray {
    return this.dealActions.get('actions') as FormArray;
  }

  /**
   * preparing controls for the left part
   *  (from DB data)
   */
  makeDealActionsForm(): void {
    this.dealActions = new FormGroup({
      actions: new FormArray([])
    });

    for (let i = 0; i < 16; ++i) {
      let handPoints: any = '';
      let dealWinner = -1;
      let dealFeeder = -1;

      if (this.sessionDeals.length > i) {
        for (let j = 0; j < this.sessionDeals[i].players.length; ++j) {
          let currentWind = this.playersMap[this.sessionDeals[i].players[j].id];

          let currentArticle = this.sessionDeals[i].players[j].dealPlayer.article;
          if (currentArticle == articles.DISCARDWIN ||
            currentArticle == articles.SELFWIN) {
            dealWinner = this.sessionDeals[i].players[j].id;
          } else if (currentArticle == articles.DISCARDFEED) {
            dealFeeder = this.sessionDeals[i].players[j].id;
          }
        }

        handPoints = this.sessionDeals[i].handPoints;
      }

      // todo: add validators
      let oneDealControls = new FormGroup({
        handPoints: new FormControl(handPoints),
        dealWinner: new FormControl(dealWinner),
        dealFeeder: new FormControl(dealFeeder)
      });

      this.dealActionsArray.push(oneDealControls);
    }
  }

  findPlayerById(playerId): Player {
    let result: Player = null;

    for (let i = 0; i < this.tourPlayers.length; ++i) {
      if (this.tourPlayers[i].id == playerId) {
        result = this.tourPlayers[i];
        break;
      }
    }

    return result;
  }

  //// Events

  changeSessionPlayer(e): void {
    const nameWinds = {
      "player-east": "EAST",
      "player-south": "SOUTH",
      "player-west": "WEST",
      "player-north": "NORTH"
    };

    const newPlayerId = e.target.value;
    const changingWind = nameWinds[e.target.name];

    const oldPlayerId = this.sessionPlayers[changingWind].playerId;
    const newNumberedPlayer = this.numberedPlayers.find(elem => elem.id == newPlayerId);
    delete this.playersMap[oldPlayerId];
    this.playersMap[newNumberedPlayer.id] = changingWind;

    const oldNumberIndex = this.playerNumbers.findIndex(elem => elem.id == oldPlayerId);

    this.playerNumbers.splice(oldNumberIndex, 1);

    this.playerNumbers.push({
      id: newNumberedPlayer.id,
      num: newNumberedPlayer.number
    });

    this.playerNumbers.sort((el1, el2) => { return el1.num > el2.num ? 1 : (el1.num < el2.num ? -1 : 0); });

    this.sessionPlayers[changingWind].playerId = newNumberedPlayer.id;

    const actions = this.dealActionsArray;

    for (let i = 0; i < actions.length; ++i) {
      if (actions.controls[i].get('dealWinner').value == oldPlayerId) {
        actions.controls[i].get('dealWinner').setValue(newNumberedPlayer.id);
      } else if (actions.controls[i].get('dealFeeder').value == oldPlayerId) {
        actions.controls[i].get('dealFeeder').setValue(newNumberedPlayer.id);
      }
    }
  }

  changeDealPoints(e): void {
    const dealForm = this.dealActionsArray.at(e.target.dealindex);
    if (dealForm.get('dealWinner').value != -1) {
      this.updatePlayersPoints(e.target.dealindex);
    }
    // console.log("new value is " + e.target.value);
    // console.log("deal pts = " + dealForm.get('handPoints').value + ", deal winner = " + dealForm.get('dealWinner').value);
  }

  changeDealWinner(e): void {
    const dealForm = this.dealActionsArray.at(e.target.dealindex);
    if (+dealForm.get('handPoints').value !== NaN) {
      this.updatePlayersPoints(e.target.dealindex);
    }
    // debugger;
    // console.log("new value is " + e.target.value);

  }

  changeDealFeeder(e): void {
    const dealForm = this.dealActionsArray.at(e.target.dealindex);
    if (dealForm.get('dealWinner').value != -1 &&
        +dealForm.get('handPoints').value !== NaN) {
      this.updatePlayersPoints(e.target.dealindex);
    }
    // debugger;
    // console.log("new value is " + e.target.value);

  }

  updatePlayersPoints(dealIndex: number): void {
    // debugger;
    const dealForm = this.dealActionsArray.at(dealIndex);

    const handPoints = +dealForm.get('handPoints').value;
    const dealWinner = dealForm.get('dealWinner').value;
    const dealFeeder = dealForm.get('dealFeeder').value;
    const pointsRow = this.playersPoints[dealIndex];
    const allWinds = ['EAST', 'SOUTH', 'WEST', 'NORTH'];

    if (dealWinner == -1) {
      console.log("clean line");
      for (let i = 0; i < allWinds.length; ++i) {
        pointsRow[allWinds[i]].dealPoints = 0;
        pointsRow[allWinds[i]].dealCode = handPoints === 0 ? articles.DRAW : articles.UNDEF;
      }
    } else {
      if (handPoints == NaN || handPoints == 0) {
        for (let i = 0; i < allWinds.length; ++i) {
          pointsRow[allWinds[i]].dealPoints = 0;
          pointsRow[allWinds[i]].dealCode = handPoints === 0 ? articles.DRAW : articles.UNDEF;
        }
      } else {
        const winnerWind = this.playersMap[dealWinner];
        if (dealFeeder == -1) {
          for (let i = 0; i < allWinds.length; ++i) {
            if (allWinds[i] == winnerWind) {
              pointsRow[allWinds[i]].dealPoints = 3 * (handPoints + 8);
              pointsRow[allWinds[i]].dealCode = articles.SELFWIN;
            } else {
              pointsRow[allWinds[i]].dealPoints = -handPoints - 8;
              pointsRow[allWinds[i]].dealCode = articles.SELFLOSS;
            }
          }

          console.log("self calc for " + winnerWind);
        } else {
          const feederWind = this.playersMap[dealFeeder];

          for (let i = 0; i < allWinds.length; ++i) {
            if (allWinds[i] == winnerWind) {
              pointsRow[allWinds[i]].dealPoints = handPoints + 24;
              pointsRow[allWinds[i]].dealCode = articles.DISCARDWIN;
            } else if (allWinds[i] == feederWind) {
              pointsRow[allWinds[i]].dealPoints = -handPoints - 8;
              pointsRow[allWinds[i]].dealCode = articles.DISCARDFEED;
            } else {
              pointsRow[allWinds[i]].dealPoints = -8;
              pointsRow[allWinds[i]].dealCode = articles.PASSIVELOSS;
            }
          }
          console.log("feed calc for " + winnerWind);
        }
      }
    }

    this.playersPoints[0].EAST.cumulativePoints = this.playersPoints[0].EAST.dealPoints;
    this.playersPoints[0].SOUTH.cumulativePoints = this.playersPoints[0].SOUTH.dealPoints;
    this.playersPoints[0].WEST.cumulativePoints = this.playersPoints[0].WEST.dealPoints;
    this.playersPoints[0].NORTH.cumulativePoints = this.playersPoints[0].NORTH.dealPoints;

    for (let i = 1; i < this.playersPoints.length; ++i) {
      this.playersPoints[i].EAST.cumulativePoints = this.playersPoints[i].EAST.dealPoints + this.playersPoints[i-1].EAST.cumulativePoints;
      this.playersPoints[i].SOUTH.cumulativePoints = this.playersPoints[i].SOUTH.dealPoints + this.playersPoints[i-1].SOUTH.cumulativePoints;
      this.playersPoints[i].WEST.cumulativePoints = this.playersPoints[i].WEST.dealPoints + this.playersPoints[i-1].WEST.cumulativePoints;
      this.playersPoints[i].NORTH.cumulativePoints = this.playersPoints[i].NORTH.dealPoints + this.playersPoints[i-1].NORTH.cumulativePoints;
    }

    this.calculateTourPoints();
  }

  /*
  fillDealsForShow(): void {
    // const result = [];
    const dealsArray = this.sessionDealsForm();

    this.sessionDeals.sort((el1, el2) => { return el1.dealNumber > el2.dealNumber ? 1 : (el1.dealNumber < el2.dealNumber ? -1 : 0); });

    const cumulativeSums = {
      "EAST": 0,
      "SOUTH": 0,
      "WEST": 0,
      "NORTH": 0
    };

    for (let i = 0; i < 16; ++i) {   // this.sessionDeals.length
      let dealWinner = -1;
      let dealFeeder = -1;
      let dealPts = {};
      let cumulPts = {};
      let dealNumber = i + 1;
      let dealPoints: any = '';

      if (this.sessionDeals.length > i) {
        dealNumber = this.sessionDeals[i].dealNumber;
        dealPoints = this.sessionDeals[i].handPoints;
        for (let j = 0; j < this.sessionDeals[i].players.length; ++j) {
          let currentWind = this.playersMap[this.sessionDeals[i].players[j].id];
          dealPts[currentWind] = new FormControl(this.sessionDeals[i].players[j].dealPlayer.gamePoints);
          cumulativeSums[currentWind] += this.sessionDeals[i].players[j].dealPlayer.gamePoints;
          cumulPts[currentWind] = new FormControl(cumulativeSums[currentWind]);

          let currentArticle = this.sessionDeals[i].players[j].dealPlayer.article;
          if (currentArticle == articles.DISCARDWIN ||
            currentArticle == articles.SELFWIN) {
            dealWinner = this.sessionDeals[i].players[j].id;
          } else if (currentArticle == articles.DISCARDFEED) {
            dealFeeder = this.sessionDeals[i].players[j].id;
          }
        }
      } else {
        dealPts = {
          "EAST": new FormControl(0),
          "SOUTH": new FormControl(0),
          "WEST": new FormControl(0),
          "NORTH": new FormControl(0)
        };

        cumulPts = {
          "EAST": new FormControl(cumulativeSums["EAST"]),
          "SOUTH": new FormControl(cumulativeSums["SOUTH"]),
          "WEST": new FormControl(cumulativeSums["WEST"]),
          "NORTH": new FormControl(cumulativeSums["NORTH"])
        };
      }

      dealsArray.push(new FormGroup({
        dealNumber: new FormControl(dealNumber),
        dealPoints: new FormControl(dealPoints),
        dealWinner: new FormControl(dealWinner),
        dealFeeder: new FormControl(dealFeeder),
        playersPoints: new FormGroup(dealPts),
        cumulativePoints: new FormGroup(cumulPts)
      }));
    }
  } */

  /**
   * saving protocol data: players (into sessionPlayers),
   *   deals (into sessionDeals) and points by players (dealPlayers)
   * so, we need 3 arrays with connected data
   * arrays are created and sent to back-end
   */
  saveProtocol(): void {
    console.log("Save protocol clicked");

    const nameWinds = {
      "playerEast": "EAST",
      "playerSouth": "SOUTH",
      "playerWest": "WEST",
      "playerNorth": "NORTH"
    };

    // part 1 of 3: collect players for this session
    //  from the drop lists on the top - this.sessionForm
    //  sessionPlayers: playerId, sessionId, wind (no points for now)
    const sessionPlayersUpdate = [];

    for (let cWind in nameWinds) {
      let sessionPlayer = {
        playerId: this.sessionForm.get(cWind).value,
        sessionId: this.currentSession.id,
        wind: nameWinds[cWind],
        gamePoints: this.playersPoints[15][nameWinds[cWind]].cumulativePoints,
        tourPoints: this.playersTourPoints[nameWinds[cWind]]
      };

      sessionPlayersUpdate.push(sessionPlayer);
    }

    // part 2 of 3: collect deal actions for this session
    //  from input and drop lists on the left - this.dealActionsArray
    //  deals: sessionId, dealNumber, result (code), handPoints (dealComment will be later)
    const dealActionsUpdate = [];

    for (let i = 0; i < 16; ++i) {
      const dealPoints = this.dealActionsArray.at(i).get('handPoints').value;

      if (dealPoints === '') {
        let restIsEmpty = true;
        for (let j = i + 1; j < 16; ++j) {
          if (this.dealActionsArray.at(j).get('handPoints').value !== '') {
            restIsEmpty = false;
            break;
          }
        }

        if (restIsEmpty) {
          break;
        }

        dealActionsUpdate.push({
          handPoints: 0,
          result: dealresults.DRAW,
          dealNumber: i + 1,
          sessionId: this.currentSession.id,
          players: []
        });
      } else if (dealPoints == 0) {
        dealActionsUpdate.push({
          handPoints: 0,
          result: dealresults.DRAW,
          dealNumber: i + 1,
          sessionId: this.currentSession.id,
          players: []
        });
      } else {
        const dealFeeder = this.dealActionsArray.at(i).get('dealFeeder').value;

        dealActionsUpdate.push({
          handPoints: +dealPoints,
          result: dealFeeder === -1 ? dealresults.SELFWIN : dealresults.DISCARDWIN,
          dealNumber: i + 1,
          sessionId: this.currentSession.id,
          players: []
        });
      }
    }

    // part 3 of 3: add players' info to deal actions
    //  it can be taken from the chart this.playersPoints
    //  (later cells will contain penalties and comments)
    //  dealPlayers: playerId, gamePoints, article (dealId will be determined at the back-end)

    // debugger;


    for (let i = 0; i < 16; ++i) {
      if (dealActionsUpdate.length <= i) {
        break;
      }

      let dealAction = dealActionsUpdate[i];

      // todo: there will be many records later (penalties)
      for (let cWind in nameWinds) {
        let dealPlayer = {
          article: dealAction.result == dealresults.DRAW ? articles.DRAW : this.playersPoints[i][nameWinds[cWind]].dealCode,
          gamePoints: this.playersPoints[i][nameWinds[cWind]].dealPoints,
          comment: this.playersPoints[i][nameWinds[cWind]].comment,
          playerId: this.sessionForm.get(cWind).value
        };

        dealAction.players.push(dealPlayer);
      }
    }

    console.log("information collected");

    const protocolData = {
      sessionPlayers: sessionPlayersUpdate,
      dealActions: dealActionsUpdate
    };

    this.sessionService.saveProtocol(this.currentSession.id, protocolData)
      .subscribe(
        data => {


          this.sessionForm.markAsPristine();
          this.dealActions.markAsPristine();

          console.log("Saved all well");
        },
        err => {
          console.log("Error: " + (err.message || "unknown"));
        }
      );
  }

}
