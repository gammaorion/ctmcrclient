import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionChartComponent } from './session-chart.component';

describe('SessionChartComponent', () => {
  let component: SessionChartComponent;
  let fixture: ComponentFixture<SessionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
