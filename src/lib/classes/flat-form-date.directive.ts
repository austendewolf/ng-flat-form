/** an entered date must be marked as valid using moment */
import {AbstractControl, ValidatorFn} from '@angular/forms';
import * as moment_ from 'moment';
const moment = moment_;

export function flatFormDateValidator(key: string, formats: string[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control.pristine && control.untouched) {
      return null;
    }

    const isValid = moment(control.value, formats, true).isValid();
    const validationObject = {};
    if (!isValid) {
      validationObject[key] = {
        value: control.value,
      };
    }
    return isValid ? null : validationObject;
  };
}
