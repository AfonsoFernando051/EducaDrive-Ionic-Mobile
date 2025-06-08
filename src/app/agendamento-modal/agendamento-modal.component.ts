import { Component, Input, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agendamento-modal',
  templateUrl: './agendamento-modal.component.html',
  styleUrls: ['./agendamento-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgendamentoModalComponent {
  @Input() date: string = '';
  @Input() alunoName: string = '';

  horario: string = '';
  status: string = 'confirmado';

  private modalCtrl = inject(ModalController);

  confirmar() {
    if (!this.horario) {
      alert('Selecione um horário!');
      return;
    }
    this.modalCtrl.dismiss(
      { horario: this.horario, status: this.status },
      'confirm'
    );
  }

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
