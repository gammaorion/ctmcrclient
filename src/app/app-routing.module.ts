import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentsListComponent } from 'src/app/components/tournaments-list/tournaments-list.component';
import { TournamentDetailsComponent } from 'src/app/components/tournament-details/tournament-details.component';
import { AddTournamentComponent } from 'src/app/components/add-tournament/add-tournament.component';
import { PlayersListComponent } from 'src/app/components/players-list/players-list.component';
import { PlayerDetailsComponent } from 'src/app/components/player-details/player-details.component';
import { AddPlayerComponent } from 'src/app/components/add-player/add-player.component';
import { TournamentPlayersAssignComponent } from 'src/app/components/tournament-players-assign/tournament-players-assign.component';
import { SessionChartComponent } from 'src/app/components/session-chart/session-chart.component';
import { ProtocolComponent } from 'src/app/components/protocol/protocol.component';

const routes: Routes = [
  { path: '', redirectTo: 'tournaments', pathMatch: 'full' },
  { path: 'tournaments', component: TournamentsListComponent },
  { path: 'tournaments/:id', component: TournamentDetailsComponent },
  { path: 'addtournament', component: AddTournamentComponent },
  { path: 'players', component: PlayersListComponent },
  { path: 'players/:id', component: PlayerDetailsComponent },
  { path: 'addplayer', component: AddPlayerComponent },
  { path: 'assignplayers/:id', component: TournamentPlayersAssignComponent },
  { path: 'sessionchart/:id', component: SessionChartComponent },
  { path: 'newprotocol/:tournament/:tour/:table', component: ProtocolComponent },
  { path: 'protocol/:id', component: ProtocolComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
