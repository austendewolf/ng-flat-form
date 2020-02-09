import {Component, Input, OnInit} from '@angular/core';
import {FlatForm} from '../../classes/flat-form';

@Component({
  selector: 'ng-flat-form',
  templateUrl: './flat-form.component.html',
  styleUrls: ['./flat-form.component.scss']
})
export class FlatFormComponent implements OnInit {

  @Input() public form: FlatForm;

  constructor() { }

  ngOnInit(): void {

  }
}
