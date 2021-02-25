import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css']
})
export class PlayerDetailsComponent implements OnInit {
  currentPlayer: Player = {
    surname: '',
    firstname: '',
    patronymic: '',
    living: '',
    comment: ''
  };
  message = '';

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.message = '';
    this.getPlayer(this.route.snapshot.params.id);
  }

  getPlayer(id: string): void {
    this.playerService.get(id)
      .subscribe(
        data => {
          this.currentPlayer = data;
          console.log("Successfully retrieved a player");
        },
        error => {
          console.log(error);
        }
      );
  }

  updatePlayer(): void {
    this.playerService.update(this.currentPlayer.id, this.currentPlayer)
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
}
