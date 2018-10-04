import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsCardComponent } from './programs-card.component';

describe('ProgramsCardComponent', () => {
  let component: ProgramsCardComponent;
  let fixture: ComponentFixture<ProgramsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
