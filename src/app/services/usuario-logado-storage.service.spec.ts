import { TestBed } from '@angular/core/testing';

import { UsuarioLogadoStorageService } from './usuario-logado-storage.service';

describe('UsuarioLogadoStorageService', () => {
  let service: UsuarioLogadoStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioLogadoStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
