import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent
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
    IonButton,
    IonCard,
    IonCardContent
  ]
})
export class AgendaPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  agendaItems: { nome: string; hora: string; status: string; cor: string; imagem: string }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || 'aluno';

      this.agendaItems = this.role === 'professor'
        ? [
            {
              nome: 'Rafael Pereira',
              hora: '08:00',
              status: 'Confirmado',
              cor: 'success',
              imagem: 'assets/fotos/rafael.png'
            },
            {
              nome: 'João Pedro',
              hora: '09:00',
              status: 'A confirmar',
              cor: 'warning',
              imagem: 'assets/fotos/joao.png'
            }
          ]
        : [
            {
              nome: 'Cristiane Santos',
              hora: '08:00',
              status: 'Indisponível',
              cor: 'medium',
              imagem: 'assets/fotos/cristiane.png'
            },
            {
              nome: 'João Figueiredo',
              hora: '09:00',
              status: 'Disponível',
              cor: 'success',
              imagem: 'assets/fotos/joao-figueiredo.png'
            }
          ];
    });
  }
}
