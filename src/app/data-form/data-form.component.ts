import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup = new FormGroup({})

  constructor(
    private  formBuilder: FormBuilder,
    private httpClient: HttpClient
    ) { }

  ngOnInit(): void {

    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });*/

    this.formulario = this.formBuilder.group({
      nome: [null],
      email: [null]
    });
  }

  onSubmit() {
    console.log(this.formulario.value);

    this.httpClient.post(
      'https://httpbin.org/post',
      JSON.stringify(this.formulario.value))
    .pipe(map((res: any) => res))
        .subscribe(dados =>{
          console.log(dados);
          //reseta o form
          //this.formulario.reset();
          this.onReset();
        },
        (error: any) => alert('erro'));
  }

  onReset() {
    this.formulario.reset();
  }
}
