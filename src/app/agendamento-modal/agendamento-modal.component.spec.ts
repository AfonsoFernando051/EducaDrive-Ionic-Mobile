import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgendamentoModalComponent } from './agendamento-modal.component';

describe('AgendamentoModalComponent', () => {
  let component: AgendamentoModalComponent;
  let fixture: ComponentFixture<AgendamentoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AgendamentoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendamentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
