import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  ModalController
} from '@ionic/angular';

@Component({
  selector: 'app-agendamento-modal',
  templateUrl: './agendamento-modal.component.html',
  styleUrls: ['./agendamento-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption
  ]
})
export class AgendamentoModalComponent {
  @Input() date: string = '';
  @Input() alunoName: string = '';

  horario: string = '';
  status: string = 'confirmado';

  constructor(private modalCtrl: ModalController) {}

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
