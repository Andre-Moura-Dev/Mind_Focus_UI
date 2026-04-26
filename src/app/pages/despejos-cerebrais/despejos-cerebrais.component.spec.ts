import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespejosCerebraisComponent } from './despejos-cerebrais.component';

describe('DespejosCerebraisComponent', () => {
  let component: DespejosCerebraisComponent;
  let fixture: ComponentFixture<DespejosCerebraisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DespejosCerebraisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DespejosCerebraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
