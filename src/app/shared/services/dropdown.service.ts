import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Cargos } from '../models/cargos';
import { Tecnologias } from '../models/tecnologias';
import { EstadoBr } from './../models/estado-br';

@Injectable()
export class DropdownService {

  constructor(private httpClient: HttpClient) { }

  getEstadosBr() {
    return this.httpClient.get<EstadoBr[]>('assets/dados/estadosbr.json');
  }

  getCargos() {
    return this.httpClient.get<Cargos[]>('assets/dados/cargos.json');
  }

  getTecnologias(){
    return this.httpClient.get<Tecnologias[]>('assets/dados/tecnologias.json');
  }

  getNewsletter() {
    return [
      {
        valor: 's',
        descricao: 'Sim'
      },
      {
        valor: 'n',
        descricao: 'Não'
      }
    ]
  }
}
