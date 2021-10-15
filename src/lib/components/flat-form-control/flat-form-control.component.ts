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
import {Event} from '@angular/router';
import {DateStruct} from '../../interfaces/date-struct.interface';
import {DomPosition} from '../../interfaces/dom-position.interface';
import {flatFormDateValidator} from '../../classes/flat-form-date.directive';

const moment = moment_;

@Component({
  selector: 'lib-flat-form-control',
  templateUrl: './flat-form-control.component.html',
  styleUrls: ['./flat-form-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FlatFormControlComponent implements OnInit {

  @Input() form: FlatForm;
  @Input() control: FlatFormControl<any>;
  @ViewChild('dateInput', {static: false}) dateInputRef: ElementRef;
  @ViewChild('yearSelect', {static: false}) yearSelectRef: ElementRef;
  @ViewChild('monthSelect', {static: false}) monthSelectRef: ElementRef;
  @ViewChild('daySelect', {static: false}) daySelectRef: ElementRef;
  public FlatFormControlType = FlatFormControlType;
  public inputFocus = false;
  public selectFocus = false;
  public displayDatePicker = false;
  public dateConfig: any;
  public position: DomPosition = {};
  public dateStruct: DateStruct = {};
  private controlUpdate: Subject<any> = new Subject();
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.displayDatePicker) {
      this.displayDatePicker = false;
    }
  }

  constructor() {}

  ngOnInit(): void {
    this.subscribeToControlEvents();

    if (this.control.type === FlatFormControlType.INPUT_DATE) {
      this.dateConfig = {
        years: this.getYears(),
        months: this.getMonths(),
        days: this.getDays(),
      };
    }

    if (this.control.type === FlatFormControlType.TEXTAREA) {
      this.control.class += ' auto-height';
    }

    if (this.control.type === FlatFormControlType.SELECT && this.control.selectOptionsAsync) {
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
          this.control.onChange(event.data, event.control);
        }
      });
  }

  public handleOnChange = (data: any, control: FlatFormControl<any>) => {
    if (this.control.showLoadingOnChange) {
      control.loading = true;
    }

    this.control.value = data;
    if (!this.control.manualValidation) {
      this.form.controls[control.key].updateValueAndValidity();
    }

    if (this.control.type === FlatFormControlType.INPUT_DATE) {
      this.parseDate(data, control.dateParseFormats);
      this.setDateValue(this.dateStruct);
    }

    this.controlUpdate.next({data, control});
  }

  public handleOnFocusDateInput(event: any) {
    this.position = {
      ...getPosition(this.dateInputRef.nativeElement),
      left: 0,
      bottom: 60,
    };

    if (this.control.class.indexOf('dropdown-menu-right') !== -1) {
      this.position.left = this.position.left - (375 - this.position.width);
    }

    if (this.control.focus) {
      this.control.focus(event, this.control);
    }

    this.inputFocus = true;
    this.displayDatePicker = true;
    this.parseDate(this.control.value, this.control.dateParseFormats);
    this.setDateValue(this.dateStruct, false);
  }

  public handleOnBlurDateInput(event: any) {
    this.inputFocus = false;
    if (this.control.blur) {
      this.control.blur(event, this.control);
    }

    setTimeout(() => {
      if (!this.inputFocus && !this.selectFocus) {
        this.displayDatePicker = false;
      }
    }, 200);
  }

  public handleOnClickDatePickerIcon = ($event: any): void => {
    if (this.displayDatePicker) {
      this.displayDatePicker = false;
    } else {
      this.handleOnFocusDateInput($event);
    }
  }

  public handleOnFocusDatePicker() {
    this.selectFocus = true;
    this.displayDatePicker = true;
    this.parseDate(this.control.value, this.control.dateParseFormats);
  }

  public handleOnBlurDatePicker() {
    this.selectFocus = false;
    setTimeout(() => {
      if (!this.inputFocus && !this.selectFocus) {
        this.displayDatePicker = false;
        this.dateStruct = {};
        this.monthSelectRef.nativeElement.value = '';
        this.daySelectRef.nativeElement.value = '';
        this.yearSelectRef.nativeElement.value = '';
      }
    }, 100);
  }

  public handleOnSelectMonth = ($event: any): void => {
    const month = $event.target.value;

    this.dateStruct.month = {
      display: moment.months(Number(month)),
      value: Number(month),
    };

    this.dateConfig.days = this.getDays(this.dateStruct.year ? this.dateStruct.year.value : moment().year(), Number(month));

    this.setDateValue(this.dateStruct);
  }

  public handleOnSelectDay = ($event: any): void => {
    const day = $event.target.value;

    this.dateStruct.day = {
      display: String(day),
      value: day,
    };

    this.setDateValue(this.dateStruct);
  }

  public handleOnSelectYear = ($event: any): void => {
    const year = $event.target.value;

    this.dateStruct.year = {
      display: String(year),
      value: year,
    };

    this.setDateValue(this.dateStruct);
  }

  public handleOnClickToday = ($event: MouseEvent): void => {
    this.control.setValue(moment().format(this.control.dateOutputFormat));
    this.control.markAsDirty();
    this.control.markAsTouched();
  }

  public handleOnClickClearDatePicker = ($event: MouseEvent): void => {
    this.dateStruct = {};
    this.monthSelectRef.nativeElement.value = '';
    this.daySelectRef.nativeElement.value = '';
    this.yearSelectRef.nativeElement.value = '';
    this.control.reset();
  }

  private parseDate = (dateInput: string | undefined, dateFormats: string[]): void => {
    if (!dateInput) {
      return;
    }

    const date = moment(dateInput, dateFormats);

    this.dateStruct.month = { value: date.month(), display: String(date.month('M')) };
    this.dateStruct.day = { value: date.date(), display: String(date.date()) };
    this.dateStruct.year = { value: date.year(), display: String(date.year()) };
  }

  private setDateValue = (dateStruct: any, hideDatePickerOnParse: boolean = true): void => {
    if (dateStruct.month) {
      this.monthSelectRef.nativeElement.value = dateStruct.month.value;
    }
    if (dateStruct.day) {
      this.daySelectRef.nativeElement.value = dateStruct.day.value;
    }
    if (dateStruct.year) {
      this.yearSelectRef.nativeElement.value = dateStruct.year.value;
    }

    if (this.dateStruct.day
      && this.dateStruct.day.value
      && this.dateStruct.month
      && this.dateStruct.month.value
      && this.dateStruct.year
      && this.dateStruct.year.value) {

      const date = moment()
        .date(this.dateStruct.day.value)
        .month(this.dateStruct.month.value)
        .year(this.dateStruct.year.value)
        .format(this.control.dateOutputFormat);

      if (hideDatePickerOnParse) {
        this.displayDatePicker = false;
        this.dateStruct = {};
        this.monthSelectRef.nativeElement.value = '';
        this.daySelectRef.nativeElement.value = '';
        this.yearSelectRef.nativeElement.value = '';
      }

      const patchValue = {};
      patchValue[this.control.key] = date;

      this.form.setValue(patchValue, { emitViewToModelChange: false });

      if (this.control.onChange) {
        this.control.onChange(date, this.control);
      }
    }
  }

  private getYears = (): any => {
    let counter = 0;
    const startYear = moment().year();
    const years = [];
    while (counter <= 50) {
      years.push({
        display: (startYear - counter),
        value: (startYear - counter)
      });
      counter++;
    }
    return years;
  }

  private getMonths = (): any => {
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

  private getDays = (year?: number, month?: number): any => {
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
}
