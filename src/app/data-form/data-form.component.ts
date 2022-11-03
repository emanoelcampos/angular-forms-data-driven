import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { Cargos } from '../shared/models/cargos';
import { Tecnologias } from '../shared/models/tecnologias';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from './../shared/models/estado-br';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})

export class DataFormComponent implements OnInit {

  formulario!: FormGroup;
  //estados!: EstadoBr[];
  estados!: Observable<EstadoBr[]>;
  cargos!: Observable<Cargos[]>;
  tecnologias!: Observable<Tecnologias[]>;
  newsletterOp!: any[];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private dropDownService: DropdownService,
    private consultaCepService: ConsultaCepService
  ) {}


  ngOnInit(): void {

    this.estados = this.dropDownService.getEstadosBr();

    this.cargos = this.dropDownService.getCargos();

    this.tecnologias = this.dropDownService.getTecnologias();

    this.newsletterOp = this.dropDownService.getNewsletter();

    /*this.dropDownService.getEstadosBr().subscribe((dados) => {
      this.estados = dados;
      console.log(dados);
    });*/

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
        estado: [null, Validators.required],
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [false, Validators.requiredTrue]
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
      console.log('formulario invalido');
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

    if (cep != null && cep !== '') {
      this.consultaCepService
        .consultaCep(cep)
        .subscribe((dados:any) => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados: any) {
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', descricao: 'Dev Pl' };
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1: Cargos, obj2: Cargos) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  setarTecnologia() {
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript']);
  }

}
