import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TournamentsListComponent } from './components/tournaments-list/tournaments-list.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';
import { AddTournamentComponent } from './components/add-tournament/add-tournament.component';
import { AddPlayerComponent } from './components/add-player/add-player.component';
import { PlayerDetailsComponent } from './components/player-details/player-details.component';
import { PlayersListComponent } from './components/players-list/players-list.component';
import { TournamentPlayersAssignComponent } from './components/tournament-players-assign/tournament-players-assign.component';
import { SessionChartComponent } from './components/session-chart/session-chart.component';
import { ProtocolComponent } from './components/protocol/protocol.component';

@NgModule({
  declarations: [
    AppComponent,
    TournamentsListComponent,
    TournamentDetailsComponent,
    AddTournamentComponent,
    AddPlayerComponent,
    PlayerDetailsComponent,
    PlayersListComponent,
    TournamentPlayersAssignComponent,
    SessionChartComponent,
    ProtocolComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
