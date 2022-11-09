import { FormArray, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent {

  formulario!: FormGroup;

  constructor() { }

  abstract submit():any;

  onSubmit() {
    if (this.formulario.valid) {
      this.onSubmit();
    } else {
      console.log('formulario invalido');
      this.formulario.markAllAsTouched();
      this.formulario.markAsDirty();
    }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  onReset() {
    this.formulario.reset();
  }

  verificarValidTouched(campo: string) {
    return (
      !this.formulario.get(campo)!.valid &&
      (this.formulario.get(campo)!.touched || this.formulario.get(campo)!.dirty)
    );
  }

  verificaRequired(campo: string) {
    return (
      this.formulario.get(campo)!.hasError('required') &&
      (this.formulario.get(campo)!.touched || this.formulario.get(campo)!.dirty)
    );
  }

  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email')!;
    if (campoEmail.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificarValidTouched(campo),
      'was-validated': this.verificarValidTouched(campo)
    };
  }



}
