import { TestBed } from '@angular/core/testing';

import { ValidarEmailService } from './validar-email.service';

describe('ValidarEmailService', () => {
  let service: ValidarEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidarEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
