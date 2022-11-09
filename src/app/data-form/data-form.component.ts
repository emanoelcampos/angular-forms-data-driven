import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, EMPTY, map, Observable, pipe, switchMap, tap } from 'rxjs';

import { VerificaEmailService } from './services/verifica-email.service';
import { FormValidations } from '../shared/form-validations';
import { Cargos } from '../shared/models/cargos';
import { Tecnologias } from '../shared/models/tecnologias';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from './../shared/models/estado-br';
import { ValidarEmailService } from './services/validar-email.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidades } from '../shared/models/cidades';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})

export class DataFormComponent extends BaseFormComponent implements OnInit {

  //formulario!: FormGroup;
  estados!: EstadoBr[];
  cidades!: Cidades[];
  //estados!: Observable<EstadoBr[]>;
  cargos!: Observable<Cargos[]>;
  tecnologias!: Observable<Tecnologias[]>;
  newsletterOp!: any[];

  frameworks = ['Angular', 'Spring', 'Vue', 'React'];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private dropDownService: DropdownService,
    private consultaCepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService,
    private validarEmailService: ValidarEmailService
  ) {
    super();
  }

  ngOnInit(): void {
    //this.verificaEmailService.verificarEmail('emanoel@email.com').subscribe();

    //this.estados = this.dropDownService.getEstadosBr();
    this.dropDownService.getEstadosBr()
    .subscribe(dados => this.estados = dados);

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
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmailService.validate.bind(this.validarEmailService)]],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],

      endereco: this.formBuilder.group({
        //cep: [null, [Validators.required, Validators.pattern(/^[0-9]{5}-[0-9]{3}$/)]],
        cep: [null, [Validators.required, FormValidations.cepValidator]],
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
      termos: [false, Validators.requiredTrue],

      frameworks: this.buildFrameworks()
    });

    this.formulario.get('endereco.cep')?.statusChanges
    .pipe(
      distinctUntilChanged(),
      tap(value => console.log('valor do CEP:', value)),
      switchMap(status => status === 'VALID' ?
      this.consultaCepService
      .consultaCep(this.formulario.get('endereco.cep')?.value)
      : EMPTY
      )
    )
    .subscribe(dados => dados ?  this.populaDadosForm(dados) : {});

    this.formulario.get('endereco.estado')?.valueChanges
    .pipe(
      tap(estado => console.log('Novo estado: ', estado)),
      map(estado => this.estados.filter(e => e.sigla === estado)),
      map((estados:any[]) => estados && estados.length > 0 ? estados[0].id : EMPTY),
      switchMap((estadoId: number) => this.dropDownService.getCidades(estadoId)),
      tap(console.log)
    )
      .subscribe(cidades => this.cidades = cidades);

    //this.dropDownService.getCidades(8).subscribe(console.log);
  }


  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false));

    return this.formBuilder.array(
      values,
      FormValidations.requiredMinCheckbox(1)
    );
  }

  get cep() {
    return this.formulario.get('cep');
  }

  get email() { return this.formulario.get('email')!; }

  submit() {
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v: any, i: any) => (v ? this.frameworks[i] : null))
        .filter((v: any) => v !== null),
    });

    console.log(valueSubmit);

    this.httpClient
        .post('https://httpbin.org/post', JSON.stringify({}))
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

  consultaCep() {
    let cep = this.formulario.get('endereco.cep')?.value;

    if (cep != null && cep !== '') {
      this.consultaCepService
        .consultaCep(cep)
        .subscribe((dados: any) => this.populaDadosForm(dados));
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
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 === obj2;
  }

  setarTecnologia() {
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript']);
  }

  // validarEmail(formControl: FormControl) {
  //   return this.verificaEmailService.verificarEmail(formControl.value)
  //     .pipe(map(emailExiste => emailExiste ? { emailInvalido: true} : null));
  // }

  getFrameworksControls() {
    return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
  }
}
