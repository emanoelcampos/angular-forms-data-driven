import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultaCepService {

  constructor(private httpClient: HttpClient) {}

  consultaCep(cep: string){

    cep = cep.replace(/\D/g, ''); //Nova variável "cep" somente com dígitos.
    if (cep !== '') { //Verifica se campo cep possui valor informado.
      let validacep = /^[0-9]{8}$/; //Expressão regular para validar o CEP.
      if (validacep.test(cep)) { //Valida o formato do CEP.
        return this.httpClient
          .get(`https://viacep.com.br/ws/${cep}/json/`);
      }
    } return of({})
  }
}
