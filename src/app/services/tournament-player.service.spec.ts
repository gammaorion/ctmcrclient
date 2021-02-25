import { TestBed } from '@angular/core/testing';

import { TournamentPlayerService } from './tournament-player.service';

describe('TournamentPlayerService', () => {
  let service: TournamentPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
