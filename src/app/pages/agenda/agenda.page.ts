import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

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
    IonCard,
    IonCardContent
  ]
})
export class AgendaPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  agendaItems: { nome: string; hora: string; status: string; cor: string; imagem: string }[] = [];

  constructor(private route: ActivatedRoute, private router: Router,  private authService: AuthService
) {}

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

  async logout() {
  try {
    await this.authService.logout();
    this.router.navigate(['/login']);
    alert('Você saiu com sucesso!');
  } catch (error: any) {
    alert('Erro ao sair: ' + error.message);
  }
}

}
