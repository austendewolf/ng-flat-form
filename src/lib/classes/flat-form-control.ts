import {FlatFormControlType} from '../enums/FlatFormControlType';
import {FormControl, Validators} from '@angular/forms';
import {flatFormDateValidator} from './flat-form-date.directive';

export class FlatFormControl<T> extends FormControl {
  value: T;
  key: string;
  placeholder: string;
  required: boolean;
  // disabled: boolean;
  type: FlatFormControlType;
  maxLength: number;
  minLength: number;
  max: number;
  min: number;
  loading: boolean;
  hidden: boolean;
  showLoadingOnChange: boolean;
  selectOptions: {key: string, value: string}[] = [];
  rows: number;
  showValidation: boolean;
  manualValidation: boolean;
  showLength: boolean;
  onChange: (event: any, control: FlatFormControl<T>, controls: FlatFormControl<T>[]) => void;
  focus: (event: any, control: FlatFormControl<T>, controls: FlatFormControl<T>[]) => void;
  blur: (event: any, control: FlatFormControl<T>, controls: FlatFormControl<T>[]) => void;
  selectOptionsAsync: () => any;
  selectOptionsMap: { keyProperty: string, valueProperty: string };
  class: string;
  state: string;
  debounceTime: number;
  autoComplete: boolean;
  dateParseFormats: string[];
  dateOutputFormat: string;

  constructor(options: {
    value?: T,
    key?: string,
    placeholder?: string,
    required?: boolean,
    disabled?: boolean;
    type?: FlatFormControlType,
    inputType?: string,
    maxLength?: number,
    minLength?: number,
    max?: number,
    min?: number,
    loading?: boolean,
    hidden?: boolean,
    showLoadingOnChange?: boolean,
    selectOptions?: {key: string, value: string}[],
    rows?: number,
    showValidation?: boolean,
    manualValidation?: boolean,
    showLength?: boolean,
    class?: string,
    title?: string,
    description?: string,
    onChange?: (event: any, control: FlatFormControl<T>, controls: FlatFormControl<T>[]) => void,
    focus?: (event: any, control: FlatFormControl<T>, controls: FlatFormControl<T>[]) => void,
    blur?: (event: any, control: FlatFormControl<T>, controls: FlatFormControl<T>[]) => void,
    selectOptionsAsync?: () => any,
    selectOptionsMap?: { keyProperty: string, valueProperty: string },
    state?: string,
    debounceTime?: number,
    autoComplete?: boolean,
    dateParseFormats?: string[],
    dateOutputFormat?: string
  } = {}) {
    super({ value: options.value || '', disabled: !!options.disabled }, FlatFormControl.getValidators(options as FlatFormControl<T>));

    this.value = options.value;
    this.key = options.key || '';
    this.placeholder = options.placeholder || '';
    this.required = !!options.required;
    // this.disabled = !!options.disabled;
    this.type = options.type || FlatFormControlType.INPUT_TEXT;
    this.maxLength = options.maxLength;
    this.minLength = options.minLength;
    this.max = options.max;
    this.min = options.min;
    this.loading = options.loading;
    this.hidden = options.hidden;
    this.showLoadingOnChange = options.showLoadingOnChange,
    this.selectOptions = options.selectOptions || [];
    this.rows = options.rows;
    this.showValidation = options.showValidation;
    this.manualValidation = options.manualValidation;
    this.showLength = options.showLength;
    this.class = options.class || '';
    this.onChange = options.onChange;
    this.focus = options.focus;
    this.blur = options.blur;
    this.selectOptionsAsync = options.selectOptionsAsync;
    this.selectOptionsMap = options.selectOptionsMap;
    this.state = options.state;
    this.debounceTime = options.debounceTime || 0;
    this.autoComplete = options.autoComplete !== false;
    this.dateParseFormats = options.dateParseFormats || [];
    this.dateOutputFormat = options.dateOutputFormat;
  }

  private static getValidators(control: FlatFormControl<any>): any[] {
    const validators = [];
    if (control.required) {
      validators.push(Validators.required);
    }
    if (control.type === FlatFormControlType.INPUT_EMAIL) {
      validators.push(Validators.email);
    }
    if (control.type === FlatFormControlType.INPUT_DATE) {
      validators.push(flatFormDateValidator(control.key, control.dateParseFormats));
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

    return validators;
  }
}
