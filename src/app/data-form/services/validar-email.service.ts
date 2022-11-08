import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, FormControl, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { VerificaEmailService } from './verifica-email.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarEmailService implements AsyncValidator {

  constructor(private verificaEmailService: VerificaEmailService) { }

  validate(formControl: AbstractControl): Observable<ValidationErrors | null> {
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map((emailExiste:any) => emailExiste ? { emailInvalido: true} : null));
  }
}
