import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormDebugComponent } from './form-debug/form-debug.component';
import { DropdownService } from './services/dropdown.service';
import { VerificaEmailService } from '../data-form/services/verifica-email.service';
import { CampoControlErroComponent } from './campo-control-erro/campo-control-erro.component';



@NgModule({
  declarations: [
    FormDebugComponent,
    CampoControlErroComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    FormDebugComponent,
    CampoControlErroComponent
  ],
  providers: [DropdownService, VerificaEmailService]
})
export class SharedModule { }
