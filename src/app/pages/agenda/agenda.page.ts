import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonCard,
  IonCardContent,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../main';

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
    IonCardContent,
    IonSpinner
  ]
})
export class AgendaPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  name = '';
  email = '';
  photoURL = '';
  isLoading = false;

  agendaItems: { nome: string; hora: string; status: string; cor: string; imagem: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.role = params['role'] || 'aluno';
      this.name = params['name'] || 'Usuário';
      this.email = params['email'] || '';
      this.photoURL = params['photoURL'] || 'assets/photo/avatar.png';

      console.log('Dados recebidos:', this.role, this.name, this.email, this.photoURL);

      await this.loadAgendaItems();
    });
  }

  async loadAgendaItems() {
    this.isLoading = true;
    try {
      var q;
      var querySnapshot;
      if (this.role === 'aluno') {
       q = query(collection(db, 'user'), where('papel', '==', 'professor'));
      } else {
        q = query(collection(db, 'user'), where('papel', '==', 'aluno'));
      }
      querySnapshot = await getDocs(q);

      this.agendaItems = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          nome: data['nome'],
          hora: 'Disponível',
          status: 'Disponível',
          cor: 'success',
          imagem: data['imagem'] || 'assets/fotos/default.png'
        };
      });
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      alert('Erro ao carregar agenda. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
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
