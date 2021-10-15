import { NgModule } from '@angular/core';
import {FlatFormControlComponent} from './components/flat-form-control/flat-form-control.component';
import {FlatFormComponent} from './components/flat-form/flat-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UtilityService} from './services/utility.service';
import {BrowserModule} from '@angular/platform-browser';
import {DirectionComponent} from './components/direction/direction.component';

@NgModule({
  declarations: [
    FlatFormControlComponent,
    FlatFormComponent,
    DirectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    UtilityService,
  ],
  exports: [
    FlatFormControlComponent,
    FlatFormComponent,
    DirectionComponent,
  ]
})
export class NgFlatFormModule { }
