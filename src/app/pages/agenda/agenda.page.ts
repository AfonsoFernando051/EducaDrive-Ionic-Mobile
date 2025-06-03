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
  IonSpinner,
  IonButton,
  IonIcon,
  IonDatetime
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../main';
import { UserService } from '../../services/user.service';

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
    IonSpinner,
    IonButton,
    IonIcon,
    IonDatetime
  ]
})
export class AgendaPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  name = '';
  email = '';
  photoURL = '';
  isLoading = false;

  showDatePicker = false;
  selectedDate: string | null = null;

  agendaItems: { nome: string; hora: string; status: string; cor: string; imagem: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const profile = await this.userService.loadUserProfileFromStorage();
    if (profile) {
      console.log('Dados do usuário carregados do storage:', profile);
      this.role = profile['role'] || 'aluno';
      this.name = profile['name'] || 'Usuário';
      this.email = profile['email'] || '';
      this.photoURL = profile['photoURL'] || 'assets/photo/avatar.png';
      this.loadAgendaItems();
    } else {
      console.warn('Nenhum perfil encontrado no storage (usuário não logado?)');
      this.router.navigate(['/login']);
    }
  }

  async loadAgendaItems() {
    this.isLoading = true;
    try {
      let q;
      if (this.role === 'aluno') {
        q = query(collection(db, 'user'), where('papel', '==', 'professor'));
      } else {
        q = query(collection(db, 'user'), where('papel', '==', 'aluno'));
      }
      const querySnapshot = await getDocs(q);

      this.agendaItems = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          nome: data['nome'],
          hora: this.selectedDate || 'Disponível',
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

  onDateSelected(event: any) {
    const rawDate = event.detail.value;
    const date = new Date(rawDate);
    this.selectedDate = date.toLocaleDateString('pt-BR');
    console.log('Data selecionada:', this.selectedDate);
    this.showDatePicker = false;
    this.loadAgendaItems();
  }
}
