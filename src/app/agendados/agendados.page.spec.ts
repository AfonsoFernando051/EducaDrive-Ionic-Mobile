import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendadosPage } from './agendados.page';

describe('AgendadosPage', () => {
  let component: AgendadosPage;
  let fixture: ComponentFixture<AgendadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
