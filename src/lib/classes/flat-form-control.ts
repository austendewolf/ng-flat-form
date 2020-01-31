import {FlatFormControlType} from '../enums/FlatFormControlType';

export class FlatFormControl<T> {
  value: T;
  key: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
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
  selectOptionsAsync: () => any;
  selectOptionsMap: { keyProperty: string, valueProperty: string };
  class: string;
  state: string;
  debounceTime: number;

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
    selectOptionsAsync?: () => any,
    selectOptionsMap?: { keyProperty: string, valueProperty: string },
    state?: string,
    debounceTime?: number,
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.placeholder = options.placeholder || '';
    this.required = !!options.required;
    this.disabled = !!options.disabled;
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
    this.selectOptionsAsync = options.selectOptionsAsync;
    this.selectOptionsMap = options.selectOptionsMap;
    this.state = options.state;
    this.debounceTime = options.debounceTime || 0;
  }
}
