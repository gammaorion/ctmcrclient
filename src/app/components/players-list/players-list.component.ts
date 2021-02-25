import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
  players?: Player[];
  currentPlayer?: Player;
  currentIndex = -1;
  surname = '';

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.retrievePlayers();
  }

  retrievePlayers(): void {
    this.playerService.getAll()
      .subscribe(
        data => {
          this.players = data;
          this.players.sort(function(p1, p2) {
            let result = p1.surname > p2.surname;
            return result ? 1 : (p1.surname < p2.surname ? -1 : 0);
          });
          console.log("Successfully retrieved players");
        },
        error => {
          console.log(error);
        }
      );
  }

  refreshList(): void {
    this.retrievePlayers();
    this.currentPlayer = undefined;
    this.currentIndex = -1;
  }

  setActivePlayer(player: Player, index: number): void {
    this.currentPlayer = player;
    this.currentIndex = index;
  }
}
