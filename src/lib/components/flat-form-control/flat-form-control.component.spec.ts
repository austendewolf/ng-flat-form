import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatFormControlComponent } from './flat-form-control.component';

describe('FlatFormControlComponent', () => {
  let component: FlatFormControlComponent;
  let fixture: ComponentFixture<FlatFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatFormControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
