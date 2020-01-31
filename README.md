<div align="center">
  <h2>@ng-flat-form</h2>
  <br />
  JSON driven dynamic forms in a compact form UI for Angular. Package can be downloaded via npm [here](https://www.npmjs.com/package/ng-flat-form).

  <br /><br />

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
View Template
```html
<div class="container">
  <lib-flat-form [form]="form"></lib-flat-form>
</div>
```

Component
```ts
  private initializeForm(): void {
    this.form = new FlatForm([
      new FlatFormControlGroup({
        title: '',
        description: '',
        controls: [
          new FlatFormControl({
            class: 'border-bottom',
            key: 'email',
            placeholder: 'Email',
            value: '',
            type: FlatFormControlType.INPUT_TEXT,
            required: true,
            showValidation: true,
            manualValidation: true,
            showLoadingOnChange: true,
            onChange: this.handleEmailChange,
            debounceTime: 1000
          }),
          new FlatFormControl({
            class: 'border-bottom half border-right',
            key: 'password',
            placeholder: 'Password',
            value: '',
            type: FlatFormControlType.INPUT_PASSWORD,
            required: true,
            showValidation: false,
            manualValidation: true,
            onChange: this.handlePasswordChange
          }),
          new FlatFormControl({
            class: 'border-bottom half',
            key: 'confirmPassword',
            placeholder: 'Confirm Password',
            value: '',
            type: FlatFormControlType.INPUT_PASSWORD,
            required: true,
            showValidation: false,
            manualValidation: true,
            onChange: this.handlePasswordChange
          })
        ]);
      })
    ];
  }
```
