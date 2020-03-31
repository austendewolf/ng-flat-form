import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {FlatFormControlGroup} from './flat-form-control-group';
import {FlatFormControl} from './flat-form-control';
import {FlatFormControlType} from '../enums/FlatFormControlType';
import {getNested} from '../utilities/utils';
import * as moment_ from 'moment';
const moment = moment_;

export class FlatForm extends FormGroup {
  public autoComplete = true;
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

  private static extractControls(controlGroups: FlatFormControlGroup[]): {} {
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

  public setValue(object: any): void {
    const controls = {};
    this.controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach(control => {
        controls[control.key] = control;
      });
    });
    const keys = this.getKeys(object, '-');
    keys.forEach((key: string) => {
      if (this.controls[key]) {
        let value = getNested(object, key, '-');

        if (controls[key].type === FlatFormControlType.INPUT_DATE) {
          const parsedDate = moment(value, controls[key].dateInputFormat);
          value = parsedDate.format(controls[key].dateOutputFormat);
        }

        if (value) {
          this.controls[key].markAsDirty();
          this.controls[key].markAsTouched();
        }

        this.controls[key].setValue(value);
      }
    });
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
