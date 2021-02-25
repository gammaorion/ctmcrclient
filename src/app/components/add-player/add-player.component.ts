import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit {
  player: Player = {
    surname: '',
    firstname: '',
    patronymic: '',
    living: '',
    comment: ''
  };
  submitted = false;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
  }

  savePlayer(): void {
    const data = {
      surname: this.player.surname,
      firstname: this.player.firstname,
      patronymic: this.player.patronymic,
      living: this.player.living,
      comment: this.player.comment
    };

    this.playerService.create(data)
      .subscribe(
        response => {
          console.log("Successfully created");
          this.submitted = true;
        },
        error => {
          console.log(error);
        }
      );
  }

  newPlayer(): void {
    this.submitted = false;
    this.player = {
      surname: '',
      firstname: '',
      patronymic: '',
      living: '',
      comment: ''
    };
  }
}
