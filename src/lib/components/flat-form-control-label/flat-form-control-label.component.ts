import {Component, Input, OnInit} from '@angular/core';
import {FlatFormControlComponent} from '../flat-form-control/flat-form-control.component';

@Component({
  selector: 'ng-form-control-label',
  templateUrl: './flat-form-control-label.component.html',
  styleUrls: ['./flat-form-control-label.component.scss']
})
export class FlatFormControlLabelComponent implements OnInit {

  @Input() controlContainer: FlatFormControlComponent;

  constructor() { }

  ngOnInit() {
  }

}
