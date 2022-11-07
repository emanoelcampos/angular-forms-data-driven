import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VerificaEmailService {

  constructor(private httpClient: HttpClient) { }

  verificarEmail(email: string) {
    return this.httpClient.get('assets/dados/verificarEmail.json')
    .pipe(
      map((dados: any) => dados.emails),
      tap(console.log),
      map((dados: any) => dados.filter((v:any) => v.email === email)),
      tap(console.log),
      map((dados:any) => dados.length > 0),
      tap(console.log)
    );
  }

}

