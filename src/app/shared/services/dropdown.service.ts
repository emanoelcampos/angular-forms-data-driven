import { EstadoBr } from './../models/estado-br';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cargos } from '../models/cargos';

@Injectable()
export class DropdownService {

  constructor(private httpClient: HttpClient) { }

  getEstadosBr() {
    return this.httpClient.get<EstadoBr[]>('assets/dados/estadosbr.json');
  }

  getCargos() {
    return this.httpClient.get<Cargos[]>('assets/dados/cargos.json');
  }
}
