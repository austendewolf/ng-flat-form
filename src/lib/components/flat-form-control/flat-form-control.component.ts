import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FlatFormControl} from '../../classes/flat-form-control';
import {ValidationErrors} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FlatForm} from '../../classes/flat-form';
import {FlatFormControlType} from '../../enums/FlatFormControlType';
import {UtilityService} from '../../services/utility.service';
// import {AppModalContext} from '../../../../../../src/app/classes/modalContext.model';
// import {ModalService} from '../../../../../../src/app/services/modal.service';
// import {DatePickerComponent} from '../../../../../../src/app/components/date-picker/date-picker.component';

@Component({
  selector: 'ng-flat-form-control',
  templateUrl: './flat-form-control.component.html',
  styleUrls: ['./flat-form-control.component.scss']
})
export class FlatFormControlComponent implements OnInit, AfterViewInit {

  public FlatFormControlType = FlatFormControlType;
  @Input() form: FlatForm;
  @Input() controls: FlatFormControl<any>[];
  @Input() control: FlatFormControl<any>;
  @ViewChild('datePicker', {static: false}) datePickerRef: ElementRef;
  protected controlUpdate: Subject<any> = new Subject();

  constructor(private utilityService: UtilityService,
              // private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.subscribeToControlEvents();
    if (this.control.type === FlatFormControlType.TEXTAREA) {
      this.control.class += ' auto-height';
    }
    if (this.control.selectOptionsAsync) {
      this.control.selectOptions = [];
      this.control.loading = true;
      this.control.selectOptionsAsync().then(response => {
        this.control.loading = false;
        response.map(x => this.control.selectOptions.push({
          key: this.utilityService.getNested(x, this.control.selectOptionsMap.keyProperty, '.'),
          value: this.utilityService.getNested(x, this.control.selectOptionsMap.valueProperty, '.')
        }));
      });
    }
  }

  ngAfterViewInit(): void {

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

  public toggleDatepicker = (): void => {
    // if (!this.control.disabled) {
    //   // (this.datePickerRef as any).toggle();
    //   this.modalService.create<AppModalContext>(DatePickerComponent, {
    //     params: {
    //       entity: {},
    //       description: 'Are you sure you want to delete the Company: ? This cannot be undone.',
    //     },
    //     componentClasses: 'center'
    //   });
    // }
  }

  public onChange = (data: any, control: FlatFormControl<any>, controls: FlatFormControl<any>[]) => {
    control.state = 'invalid';
    this.control.value = data;
    if (this.control.showLoadingOnChange) {
      control.loading = true;
    }
    if (!this.control.manualValidation) {
      this.control.state = this.getControlState(control);
    }
    this.controlUpdate.next({data, control, controls});
  }

  public getControlState = (control: FlatFormControl<any>): string => {
    const formElement = this.form.controls[control.key];
    if (formElement) {
      if (formElement.pristine) {
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
}
