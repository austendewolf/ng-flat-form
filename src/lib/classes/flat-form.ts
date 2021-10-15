import {FormGroup} from '@angular/forms';
import {FlatFormControlGroup} from './flat-form-control-group';
import {FlatFormControl} from './flat-form-control';
import {FlatFormControlType} from '../enums/FlatFormControlType';
import {getNested} from '../utilities/utils';
import * as moment_ from 'moment';

const moment = moment_;

export class FlatForm {

  public formGroup: FormGroup;
  public controlGroups: FlatFormControlGroup[] = [];
  public disabled;

  constructor(controlGroups: FlatFormControlGroup[], options: { disabled: boolean } = { disabled: false }) {

    this.controlGroups = controlGroups;
    this.formGroup = new FormGroup(this.controls);
    this.disabled = options.disabled;
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

  get errors(): any {
    const errors = [];

    this.controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach(control => {
        if (control.errors) {
          Object.keys(control.errors).forEach((errorKey: string) => {
            if (errorKey !== 'required') {
              errors.push({
                field: errorKey,
                value: control.value,
                status: control.status
              });
            }
          });
        }
      });
    });

    return errors;
  }

  get controls(): any {
    const controls = {};

    this.controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach(control => {
        controls[control.key] = control;
      });
    });

    return controls;
  }

  public setValue = (
    object: any,
    options?: { emitEvent?: boolean, onlySelf?: boolean, emitViewToModelChange?: boolean, emitModelToViewChange?: boolean }
  ): void => {
    const keys = this.getKeys(object, '-');
    keys.forEach((key: string) => {
      const control = this.controls[key];
      if (control) {
        let value = getNested(object, key, '-');

        if (control.type === FlatFormControlType.INPUT_DATE && value) {
          const parsedDate = moment(value, control.dateParseFormats);
          value = parsedDate.format(control.dateOutputFormat);
        }

        if (value) {
          control.markAsDirty();
          control.markAsTouched();
        }

        control.setValue(value, options);
      }
    });
  }

  // tslint:disable-next-line:max-line-length
  public reset = (formState?: any, options?: { emitEvent?: boolean, onlySelf?: boolean, emitViewToModelChange?: boolean, emitModelToViewChange?: boolean }): void => {
      this.controlGroups.forEach(controlGroup => {
        controlGroup.controls.forEach((control: FlatFormControl<any>) => {
          if (control.type === FlatFormControlType.INPUT_DATE) {
            console.log('before reset control');
          }
          control.reset(formState, options);
        });
      });
  }

  // tslint:disable-next-line:max-line-length
  public enable = (options?: { emitEvent?: boolean, onlySelf?: boolean, emitViewToModelChange?: boolean, emitModelToViewChange?: boolean }): void => {
    this.controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach((control: FlatFormControl<any>) => {
        control.enable(options);
      });
    });
  }

  // tslint:disable-next-line:max-line-length
  public disable = (options?: { emitEvent?: boolean, onlySelf?: boolean, emitViewToModelChange?: boolean, emitModelToViewChange?: boolean }): void => {
    this.controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach((control: FlatFormControl<any>) => {
        control.disable(options);
      });
    });
  }

  // tslint:disable-next-line:max-line-length
  public updateValueAndValidity = (options?: { emitEvent?: boolean, onlySelf?: boolean, emitViewToModelChange?: boolean, emitModelToViewChange?: boolean }): void => {
    this.controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach((control: FlatFormControl<any>) => {
        control.updateValueAndValidity(options);
      });
    });
  }

  public getRawValue = (): any => {
    const rawValue = {};
    this.controlGroups.forEach(controlGroup => {
      controlGroup.controls.forEach((control: FlatFormControl<any>) => {
        rawValue[control.key] = control.value;
      });
    });

    return rawValue;
  }

  private getKeys = (object: any, separator: string, pre?: string, keys: string[] = []): string[] => {
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
