import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatFormControlLabelComponent } from './flat-form-control-label.component';

describe('FormControlLabelComponent', () => {
  let component: FlatFormControlLabelComponent;
  let fixture: ComponentFixture<FlatFormControlLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatFormControlLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatFormControlLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
