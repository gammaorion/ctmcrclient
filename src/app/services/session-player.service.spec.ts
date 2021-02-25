import { TestBed } from '@angular/core/testing';

import { SessionPlayerService } from './session-player.service';

describe('SessionPlayerService', () => {
  let service: SessionPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
