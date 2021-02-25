import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentPlayersAssignComponent } from './tournament-players-assign.component';

describe('TournamentPlayersAssignComponent', () => {
  let component: TournamentPlayersAssignComponent;
  let fixture: ComponentFixture<TournamentPlayersAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentPlayersAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentPlayersAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
