import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    IonButton
  ]
})
export class AgendaPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  agendaItems: { nome: string; hora: string; status: string; cor: string }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || 'aluno';
  
      this.agendaItems = this.role === 'professor'
        ? [
            { nome: 'Rafael Pereira', hora: '08:00', status: 'Confirmado', cor: 'success' },
            { nome: 'João Pedro', hora: '09:00', status: 'A confirmar', cor: 'warning' },
          ]
        : [
            { nome: 'Cristiane Santos', hora: '08:00', status: 'Indisponível', cor: 'medium' },
            { nome: 'João Figueiredo', hora: '09:00', status: 'Disponível', cor: 'success' },
          ];
    });
  }
  
  }

 


