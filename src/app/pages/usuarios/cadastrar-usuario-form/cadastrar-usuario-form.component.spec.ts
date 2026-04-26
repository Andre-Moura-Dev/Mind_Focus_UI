import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarUsuarioFormComponent } from './cadastrar-usuario-form.component';

describe('CadastrarUsuarioFormComponent', () => {
  let component: CadastrarUsuarioFormComponent;
  let fixture: ComponentFixture<CadastrarUsuarioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastrarUsuarioFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarUsuarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
