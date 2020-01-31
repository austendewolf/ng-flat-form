import {FlatFormControl} from './flat-form-control';

export class FlatFormControlGroup {
  title: string;
  description: string;
  disableStyles?: boolean;
  controls: FlatFormControl<any>[];

  constructor(options: {
    title?: string,
    description?: string,
    disableStyles?: boolean,
    controls: FlatFormControl<any>[]
  }) {
    this.title = options.title || '';
    this.description = options.description || '';
    this.disableStyles = options.disableStyles;
    this.controls = options.controls || [];
  }
}
