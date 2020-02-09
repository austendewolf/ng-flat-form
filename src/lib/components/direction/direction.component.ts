import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ng-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss']
})
export class DirectionComponent implements OnInit {

  @Input() title: string;
  @Input() directions: string;
  @Input() count?: number;

  constructor() { }

  ngOnInit(): void {
  }
}
