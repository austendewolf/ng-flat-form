import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {FlatFormControlGroup} from './flat-form-control-group';
import * as moment_ from 'moment';
const moment = moment_;
import {FlatFormControl} from './flat-form-control';
import {FlatFormControlType} from '../enums/FlatFormControlType';

export class FlatForm extends FormGroup {

  public controlGroups: FlatFormControlGroup[];

  constructor(
    controlGroups: FlatFormControlGroup[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null | {},
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | {}) {

    super(FlatForm.extractControls(controlGroups), validatorOrOpts);
    this.controlGroups = controlGroups;
  }

  get status(): string {
    const containsInvalid = Object.keys(this.controls).find(key => this.controls[key].invalid === true) != null;
    const containsValid = Object.keys(this.controls).find(key => this.controls[key].valid === true) != null;
    const containsUntouched = Object.keys(this.controls).find(key => this.controls[key].untouched === true) != null;
    const containsTouched = Object.keys(this.controls).find(key => this.controls[key].touched === true) != null;
    // const containsDirty = Object.keys(this.controls).find(property => this.controls[property].dirty === true) != null;
    // const containsPristine = Object.keys(this.controls).find(property => this.controls[property].pristine === true) != null;

    let state = 'untouched';
    if (containsUntouched && !containsTouched) {
      state = 'untouched';
    } else if (containsTouched && containsInvalid) {
      state = 'invalid';
    } else if (containsTouched && containsValid && !containsInvalid) {
      state = 'valid';
    }

    return state;
  }

  set status(status: string) {}

  public static extractControls(controlGroups: FlatFormControlGroup[]): {} {
    const controls: any = {};
    controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach(control => {
        controls[control.key] = FlatForm.toFormControl(control);
      });
    });
    return controls;
  }

  private static toFormControl(control: FlatFormControl<any>): FormControl {
    const validators = [];
    if (control.required) {
      validators.push(Validators.required);
    }
    if (control.type === FlatFormControlType.INPUT_EMAIL) {
      validators.push(Validators.email);
    }
    if (control.maxLength) {
      validators.push(Validators.maxLength(control.maxLength));
    }
    if (control.minLength) {
      validators.push(Validators.minLength(control.minLength));
    }
    if (control.max) {
      validators.push(Validators.max(control.max));
    }
    if (control.min) {
      validators.push(Validators.min(control.min));
    }

    return new FormControl({ value: control.value || '', disabled: control.disabled }, validators);
  }

  private static getNested(theObject: any, path: string, separator: string = '.'): any {
    try {
      return path
        .replace('[', separator)
        .replace(']', '')
        .split(separator)
        .reduce((obj: any, property: string): any => {
            return obj[property];
          }, theObject
      );
    } catch (err) {
      return undefined;
    }
  }

  public markAllAsDirty(): void {

  }

  public removeAllAsPristine(): void {

  }

  public setForm(object: any): void {
    const keys = this.getKeys(object, '-');
    keys.forEach((key: string) => {
      if (this.controls[key]) {
        let value = FlatForm.getNested(object, key, '-');
        if (value) {
          if (moment(value, moment.ISO_8601, true).isValid()) {
            value = new Date(value);
          }
          this.controls[key].setValue(value, {onlySelf: true});
          this.controls[key].markAsDirty();
          this.controls[key].markAsTouched();
        } else {
          this.controls[key].setValue(value, {onlySelf: true});
        }
      }
    });
    this.updateValueAndValidity({emitEvent: true});
  }

  private getKeys(object: any, separator: string, pre?: string, keys: string[] = []): string[] {
    Object.keys(object).forEach(key => {
      if (object[key] instanceof Object) {
        this.getKeys(object[key], separator, (pre ? pre + separator + key : key), keys);
      } else {
        keys.push(((pre ? pre + separator : '') + key));
      }
    });
    return keys;
  }
}
