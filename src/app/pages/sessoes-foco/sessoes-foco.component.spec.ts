import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessoesFocoComponent } from './sessoes-foco.component';

describe('SessoesFocoComponent', () => {
  let component: SessoesFocoComponent;
  let fixture: ComponentFixture<SessoesFocoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessoesFocoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessoesFocoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
