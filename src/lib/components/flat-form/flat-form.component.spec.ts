import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatFormComponent } from './flat-form.component';

describe('FlatFormComponent', () => {
  let component: FlatFormComponent;
  let fixture: ComponentFixture<FlatFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
