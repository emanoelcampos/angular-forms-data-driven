import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });*/

    this.formulario = this.formBuilder.group({
      //nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      cep: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null],
      rua: [null, Validators.required],
      bairro: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required]
    });
  }

  onSubmit() {
    console.log(this.formulario);

    this.httpClient
      .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .pipe(map((res: any) => res))
      .subscribe(
        //(dados =>{console.log(dados);
        //   this.onReset();},
        // (error: any) => alert('erro'));
        {
          next: (dados) => {
            console.log(dados), this.onReset();
          },
          error: (erro) => alert('An error occurred'),
        }
      );
  }
  onReset() {
    this.formulario.reset();
  }

  verificarValidTouched(campo: string) {
    return (
      !this.formulario.controls[campo].valid &&
      this.formulario.controls[campo].touched
    );
  }

  verificaEmailInvalido() {
    let campoEmail = this.formulario.controls['email'];
    if (campoEmail.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo: string) {
    return { 'was-validated': this.verificarValidTouched(campo) };
  }
}
