import { Component, Input, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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
export class AgendamentoModalComponent implements OnInit {
  @Input() date: string = '';
  @Input() alunoName: string = '';
  @Input() professorId: string = ''; // RECEBE o professorId da agenda.page.ts

  horario: string = '';
  status: string = 'confirmado';
  disponibilidadeHorarios: string[] = [];

  private modalCtrl = inject(ModalController);

  async ngOnInit() {
    if (this.professorId && this.date) {
      const db = getFirestore();

      const diaSemana = this.getDiaSemana(this.date);

      const disponibilityRef = collection(db, 'disponibility');
      const q = query(disponibilityRef, where('uid', '==', this.professorId));
      console.log(q)
      console.log(this.professorId)

      const querySnapshot = await getDocs(q);

      const horarios: string[] = [];

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data() as any;
        const disponibility = data.disponibility;

        disponibility.forEach((slot: any) => {
          if (slot.dia === diaSemana) {
            const horariosSlot = this.gerarHorarios(slot.inicio, slot.fim);
            horarios.push(...horariosSlot);
          }
        });
      });

      this.disponibilidadeHorarios = horarios;
    }
  }

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

 getDiaSemana(dateStr: string): string {
  const data = new Date(dateStr); // Exemplo: '2025-06-10' → Date
  const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  return dias[data.getDay()];
}


  gerarHorarios(inicioStr: string, fimStr: string): string[] {
    const horarios: string[] = [];

    const inicio = this.strToMinutes(inicioStr);
    const fim = this.strToMinutes(fimStr);

    for (let t = inicio; t < fim; t += 60) { // incrementa de 1 em 1 hora
      const horaFormatada = this.minutesToStr(t);
      horarios.push(horaFormatada);
    }

    return horarios;
  }

  strToMinutes(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  minutesToStr(minutos: number): string {
    const h = Math.floor(minutos / 60).toString().padStart(2, '0');
    const m = (minutos % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }
}
