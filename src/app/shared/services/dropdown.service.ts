import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Cargos } from '../models/cargos';
import { Cidades } from '../models/cidades';
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

  getCidades(idEstado: number) {
    return this.httpClient.get<Cidades[]>('assets/dados/cidades.json')
    .pipe(
      map((cidades: Cidades[]) => cidades.filter(c => c.estado == idEstado))
    )
  }

}
