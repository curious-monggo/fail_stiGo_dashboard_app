import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsItemComponent } from './students-item.component';

describe('StudentsItemComponent', () => {
  let component: StudentsItemComponent;
  let fixture: ComponentFixture<StudentsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
