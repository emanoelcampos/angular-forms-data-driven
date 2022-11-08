import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

export class FormValidations {

 static requiredMinCheckbox(min: number) {
    return (formArray: AbstractControl)  => {
      const totalChecked = (<FormArray>formArray).controls.filter(v => v.value).length;
      return totalChecked >= min ? null : { required: true };
    }
  }

  static cepValidator(control: AbstractControl) {
    const cep = control.value;
    if (cep && cep !== '') {
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalido: true };
    }
    return null;
  }

  static equalsTo(otherField: string) {
    const validator = (formControl: FormControl) => {
      if (otherField == null) {
        throw new Error('É necessário informar um campo.');
      }

      if (!formControl.root || !(<FormGroup>formControl.root).controls) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);

      if (!field) {
        throw new Error('É necessário informar um campo válido.');
      }

      if (field.value !== formControl.value) {
        return { equalsTo: otherField};
      }

      return null;
    };
    return validator;
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {
    const config: { [key: string]: any } = {
      'required':`${fieldName} é obrigatório.`,
      'minlength': `${fieldName} precisa no mínimo ${validatorValue.requiredLength} caracteres.`,
      "cepInvalido": 'CEP inválido.'
    };

    return config[validatorName];
  }
}
