import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';

import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from './../shared/models/estado-br';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;
  estados!: EstadoBr[];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private dropDownService: DropdownService
  ) {}

  ngOnInit(): void {

    this.dropDownService.getEstadosBr()
    .subscribe(dados => {this.estados = dados; console.log(dados)});

    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),

      endereco: new FormGroup({
        cep: new FormControl(null),
        numero: new FormControl(null),
        complemento: new FormControl(null),
        rua: new FormControl(null),
        bairro: new FormControl(null),
        cidade: new FormControl(null),
        estado: new FormControl(null),
      })
    });*/

    this.formulario = this.formBuilder.group({
      //nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }

  onSubmit() {
    console.log(this.formulario);

    if (this.formulario.valid) {
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
    } else {
      console.log('formulario invalido')
      this.formulario.markAllAsTouched();
      this.formulario.markAsDirty();
    }
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

  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email')!;
    if (campoEmail.errors) {
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }

  aplicaCssErro(campo: string) {
    return { 'was-validated': this.verificarValidTouched(campo) };
  }

  consultaCep() {
    let cep = this.formulario.get('endereco.cep')?.value;

    cep = cep.replace(/\D/g, ''); //Nova variável "cep" somente com dígitos.

    if (cep != "" || null) { //Verifica se campo cep possui valor informado.
      var validacep = /^[0-9]{8}$/; //Expressão regular para validar o CEP.
       if(validacep.test(cep)) { //Valida o formato do CEP.

        this.resetaDadosForm();

        this.httpClient.get(`https://viacep.com.br/ws/${cep}/json/`)
        .pipe(map((dados: any) => dados))
        .subscribe(dados => this.populaDadosForm(dados));
       }
    }
  }

  populaDadosForm(dados: any) {
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }
}
