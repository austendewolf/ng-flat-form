import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FlatFormControl} from '../../classes/flat-form-control';
import {ValidationErrors} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FlatForm} from '../../classes/flat-form';
import {FlatFormControlType} from '../../enums/FlatFormControlType';
import {getNested, getPosition, padNumber} from '../../utilities/utils';
import * as moment_ from 'moment';

const moment = moment_;

@Component({
  selector: 'lib-flat-form-control',
  templateUrl: './flat-form-control.component.html',
  styleUrls: ['./flat-form-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FlatFormControlComponent implements OnInit {

  public FlatFormControlType = FlatFormControlType;
  @Input() form: FlatForm;
  @Input() controls: FlatFormControl<any>[];
  @Input() control: FlatFormControl<any>;
  @ViewChild('dateInput', {static: false}) dateInputRef: ElementRef;
  @ViewChild('yearSelect', {static: false}) yearSelectRef: ElementRef;
  @ViewChild('monthSelect', {static: false}) monthSelectRef: ElementRef;
  @ViewChild('daySelect', {static: false}) daySelectRef: ElementRef;
  protected controlUpdate: Subject<any> = new Subject();
  public inputFocus = false;
  public selectFocus = false;
  public displayDatePicker = false;
  public xCoordinate: number;
  public yCoordinate: number;
  public pickerWidth: number;
  public dateConfig: any;
  public dateStruct: {
    year: {display: string, value: number},
    month: {display: string, value: number},
    day: {display: string, value: number}
  } = {} as any;
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.dateStruct.year && this.dateStruct.year.value
      && this.dateStruct.month && this.dateStruct.month.value
      && this.dateStruct.day && this.dateStruct.day.value) {
      this.displayDatePicker = false;
    }
  }

  constructor() {}

  ngOnInit(): void {
    this.subscribeToControlEvents();
    if (this.control.type === FlatFormControlType.INPUT_DATE) {
      const m = moment();
      this.dateConfig = {
        years: this.getYears(),
        months: this.getMonths(),
        days: this.getDays(),
      };
    }

    if (this.control.type === FlatFormControlType.TEXTAREA) {
      this.control.class += ' auto-height';
    }

    if (this.control.selectOptionsAsync) {
      this.control.selectOptions = [];
      this.control.loading = true;
      this.control.selectOptionsAsync().then(response => {
        this.control.loading = false;
        response.map(x => this.control.selectOptions.push({
          key: getNested(x, this.control.selectOptionsMap.keyProperty, '.'),
          value: getNested(x, this.control.selectOptionsMap.valueProperty, '.')
        }));
      });
    }
  }

  private subscribeToControlEvents(): void {
    this.controlUpdate.asObservable()
      .pipe(debounceTime(this.control.debounceTime))
      .pipe(distinctUntilChanged())
      .subscribe(event => {
        if (this.control.onChange) {
          this.control.onChange(event.data, event.control, event.controls);
        }
      });
  }

  protected get isValid(): boolean {
    return this.form.controls[this.control.key].valid;
  }

  protected get status(): string {
    return this.form.controls[this.control.key].status;
  }

  protected get errors(): ValidationErrors {
    return this.form.controls[this.control.key].errors;
  }

  public get value(): any {
    return this.form.controls[this.control.key].value;
  }

  public get loading(): any {
    return this.form.controls[this.control.key].pending;
  }

  public onFocusDateInput(event: any) {
    const position = getPosition(this.dateInputRef.nativeElement);
    const width = this.dateInputRef.nativeElement.getBoundingClientRect().width;
    if (this.control.focus) {
      this.control.focus(event, this.control, this.controls);
    }

    this.xCoordinate = position.x;
    this.yCoordinate = position.y + 60;
    this.pickerWidth = width < 375 ? 375 : width;
    this.inputFocus = true;
    this.displayDatePicker = true;
    this.parseDate(this.control.value, this.control.dateParseFormats);
  }

  public onBlurDateInput(event: any) {
    this.inputFocus = false;
    if (this.control.blur) {
      this.control.blur(event, this.control, this.controls);
    }

    setTimeout(() => {
      if (!this.inputFocus && !this.selectFocus) {
        this.displayDatePicker = false;
      }
    }, 200);
  }

  public onFocusDatePicker() {
    this.selectFocus = true;
    this.displayDatePicker = true;
    this.parseDate(this.control.value, this.control.dateParseFormats);
  }

  public onBlurDatePicker() {
    this.selectFocus = false;
    setTimeout(() => {
      if (!this.inputFocus && !this.selectFocus) {
        this.displayDatePicker = false;
      }
    }, 200);
  }

  public toggleDatepicker = (): void => {
    if (this.displayDatePicker) {
      this.displayDatePicker = false;
    } else {
      this.displayDatePicker = true;
      this.parseDate(this.control.value, this.control.dateParseFormats);
      this.updateDatePicker(this.dateStruct);
    }
  }

  public onChange = (data: any, control: FlatFormControl<any>, controls: FlatFormControl<any>[]) => {
    control.state = 'invalid';

    if (this.control.showLoadingOnChange) {
      control.loading = true;
    }

    this.control.value = data;
    if (!this.control.manualValidation) {
      this.form.controls[control.key].updateValueAndValidity();
      this.control.state = this.getControlState(control);
    }

    if (this.control.type === FlatFormControlType.INPUT_DATE) {
      this.dateStruct = this.parseDate(data, control.dateParseFormats);
      this.updateDatePicker(this.dateStruct);
    }

    this.controlUpdate.next({data, control, controls});
  }

  public onSelectYear(year: number) {
    this.dateStruct.year = {
      display: String(year),
      value: year,
    };
  }

  public onSelectMonth(month: number) {
    this.dateStruct.month = {
      display: moment.months(Number(month)),
      value: Number(month) + 1,
    };
    this.dateConfig.days = this.getDays(this.dateStruct.year.value, Number(month) + 1);
  }

  public onSelectDay(day: number) {
    this.dateStruct.day = {
      display: String(day),
      value: day,
    };

    if (this.dateStruct.year.value && this.dateStruct.month.value) {
      const date = moment()
        .date(this.dateStruct.day.value)
        .month(this.dateStruct.month.value)
        .year(this.dateStruct.year.value)
        .format(this.control.dateOutputFormat);

      const patchValue = {};
      patchValue[this.control.key] = date;

      this.displayDatePicker = false;
      this.form.setValue(patchValue);
    }
  }

  public getControlState = (control: FlatFormControl<any>): string => {
    const formElement = this.form.controls[control.key];
    if (formElement) {
      if (formElement.pristine && !formElement.touched) {
        return 'pristine';
      }
      if (formElement.valid) {
        return 'valid';
      }
      if (formElement.invalid && formElement.dirty) {
        return 'invalid';
      }
    }
  }

  private getYears() {
    let counter = 0;
    const startYear = moment().year() - 100;
    const years = [];
    while (counter <= 150) {
      years.push({
        display: (startYear + counter),
        value: (startYear + counter)
      });
      counter++;
    }
    return years;
  }

  private getMonths() {
    let counter = 0;
    const months = [];
    while (counter <= 11) {
      const month = moment.months(counter);
      months.push({
        display: month,
        value: counter,
      });
      counter++;
    }
    return months;
  }

  private getDays(year?: number, month?: number) {
    let counter = 1;
    const daysInMonth = (year && month) ? moment(year + '-' + padNumber(month), 'YYYY-MM').daysInMonth() : 31;
    const days = [];
    while (counter <= daysInMonth) {
      days.push({
        display: counter,
        value: counter,
      });
      counter++;
    }
    return days;
  }

  private parseDate(dateInput: string, dateFormats: string[]): any {
    if (!dateInput) {
      return {
        year: {
          display: '',
          string: '',
        },
        month: {
          display: '',
          string: '',
        },
        day: {
          display: '',
          string: '',
        }
      };
    }

    const date = moment(dateInput, dateFormats);
    const dateStruct = {} as any;

    dateStruct.month = { value: date.month() + 1, display: String(date.month('M')) };
    dateStruct.day = { value: date.date(), display: String(date.date()) };
    dateStruct.year = { value: date.year(), display: String(date.year()) };

    return dateStruct;
  }

  private updateDatePicker(dateStruct: any) {
    if (this.dateStruct.month) {
      this.monthSelectRef.nativeElement.value = dateStruct.month.value - 1;
    }
    if (this.dateStruct.day) {
      this.daySelectRef.nativeElement.value = dateStruct.day.value;
    }
    if (this.dateStruct.year) {
      this.yearSelectRef.nativeElement.value = dateStruct.year.value;
    }
  }
}
