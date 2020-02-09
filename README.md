<div align="center">
  <h2>ng-flat-form</h2>
  <br />
  JSON driven dynamic forms in a compact form UI for Angular. Package can be downloaded via npm <a href="https://www.npmjs.com/package/ng-flat-form">here</a>.
  <br />
  <br />

[![npm version](https://badge.fury.io/js/ng-flat-form.svg)](https://badge.fury.io/js/ng-flat-form)
[![Downloads](https://img.shields.io/npm/dt/ng-flat-form?style=flat-square)](https://www.npmjs.com/package/ng-flat-form)
</div>

---

# NgFlatForm

Angular 8+ static and dynamic forms library. Supports validation, async calls, and floating labels. Support for the following input types:
- text
- number
- password
- email
- textarea
- date
- select

## Getting started

#### 1. Install ng-flat-form
Download from npm [here](https://www.npmjs.com/package/ng-flat-form). Or install locally by running:
```bash
  npm install ng-flat-form --save
```

#### 2. Import the installed libraries
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgFlatFormModule } from 'ng-flat-form/lib/ng-flat-form.module';

import { AppComponent } from './app';

@NgModule({
  ...
  imports: [
    ...,
    NgFlatFormModule
  ],
})
export class AppModule {}
```

#### 3. Create a flat-form in in your template
**View Template**
```html
<div class="container">
  <ng-flat-form [form]="form"></ng-flat-form>
</div>
```

**Component**
```ts
  public form: FlatForm;

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = new FlatForm([
      new FlatFormControlGroup({
        title: '',
        description: '',
        controls: [
          new FlatFormControl({
            class: 'border-bottom half border-right',
            key: 'name',
            placeholder: 'Name',
            type: FlatFormControlType.INPUT_TEXT,
            required: true,
            showValidation: true,
            showLength: true,
          }),
          new FlatFormControl({
            class: 'border-bottom half',
            key: 'email',
            placeholder: 'Email',
            type: FlatFormControlType.INPUT_EMAIL,
            required: true,
            showValidation: true,
            manualValidation: true,
            showLength: true,
            onChange: this.handlePasswordChange,
            debounceTime: 1000,
          })
        ]);
      })
    ];
  }
```

#### 4. Subscribe to form changes

**Component**
```ts
  public form: FlatForm;

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
    this.handleFormChange();
  }

  private handleFormChange(): void {
    this.form.statusChanges.subscribe((event: any) => {
      console.log(this.form.value);
    });
  }
```

#### 5. Set form value
You can set the forms value in two ways: During initialization, by providing a value to the `value` property within `FlatFormControl`. 
Or by calling `setForm({..})` on the `FlatForm` instance.

**Component**
```ts
  public form: FlatForm;

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
    this.handleFormChange();
    this.setForm();
  }

  private setForm(): void {
    this.form.setValue({
      name: 'Ron Swanson',
      email: 'ron.swanson@pnr.giv'
    });
  }
```

## Properties
**FlatFormControl<T>**

| Property      | Type         | Required | Description |
| ------------- |-------------| -----| ----|
value           | T            | false | get/set the value of the control |
key | string | true | the object key associated with the form value, also the corresponding key for json driven forms |
placeholder | string | false | corresponds to the placeholder property of the <input /> element
required | boolean | false | flag for whether the required field validator is applied to the given control 
disabled | boolean | false | flag for whether the given control will render as disabled
type | FlatFormControlType | true | sets the control type (input, textarea, select)
maxLength | number | false | corresponds to the maxLength property of the <input /> element
minLength | number | false | corresponds to the minLength property of the <input /> element
max | number | false | corresponds to the max property of the <input /> element
min | number | false | corresponds to the min property of the <input /> element
loading | boolean | false | flag controlling the visibility of the loading icon |
hidden | boolean | false | corresponds to the hidden property of the <input /> element |
showLoadingOnChange | boolean | false | flag for whether the loading icon should be shown when onChange is called |
selectOptions | {key: string, value: string}[] = [] | false | array of key/value pairs to be used for select options |
rows | number | false | corresponds to the rows attribute of the <textarea /> element |
showValidation | boolean | false | flag for whether or not valid/invalid icons are shown while editing the given control |
manualValidation | boolean | false | disables automatic validation allowing for manual updating of the given controls state |
showLength | boolean | false | flat for whether or not dynamic character count is shown when maxLength is also defined |
onChange | (event: any, control: FlatFormControl<T>, controls: FlatFormControl<T>[]) => void | |
selectOptionsAsync | () => any | false | callback for retrieving select options dynamically |
selectOptionsMap | { keyProperty: string, valueProperty: string } | false | function for mapping selectOptionsAsync to key/value pairs as defined for selectOptions |
class | string | false | free form string for assigning custom classes to the given control |
state | string | false | represents the status of the given control at any time (valid, invalid) |
debounceTime | number | false | milliseconds delay between an input change event and the callback to onChange |

