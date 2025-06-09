import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardContent, IonSpinner, IonDatetime, IonButton } from '@ionic/angular/standalone';

import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from 'src/main';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Aula {
  date: string;
  horario?: string;
  professorId: string;
  alunoId: string;
  status: string;
}

@Component({
  selector: 'app-agendados',
  templateUrl: './agendados.page.html',
  styleUrls: ['./agendados.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardContent, IonSpinner, IonDatetime, IonButton,
    CommonModule, FormsModule
  ]
})
export class AgendadosPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  uid = '';
  agendados: Aula[] = [];
  isLoading = false;
  name = '';
  photoURL = '';
  selectedDate: string | null = null;
  showDatePicker = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const profile = await this.userService.loadUserProfileFromStorage();
    if (profile) {
      this.uid = profile['uid'];
      this.role = profile['role'] || 'aluno';
      this.name = profile['name'] || 'Usuário';
      this.photoURL = profile['photoURL'] || 'assets/photo/avatar.png';
    }
    this.loadAgendados();
  }

  async loadAgendados() {
    this.isLoading = true;
    this.agendados = [];

    try {
      let aulaQuery;

      if (this.role === 'aluno') {
        aulaQuery = query(
          collection(db, 'agenda'),
          where('alunoId', '==', this.uid),
          where('status', '==', 'confirmado')
        );
      } else {
        aulaQuery = query(
          collection(db, 'agenda'),
          where('professorId', '==', this.uid),
          where('status', '==', 'confirmado')
        );
      }

      const aulasSnap = await getDocs(aulaQuery);

      let aulas = aulasSnap.docs.map(doc => doc.data() as Aula);

      // Filtro por data se selecionada
      if (this.selectedDate) {
        aulas = aulas.filter(aula => aula.date === this.selectedDate);
      }

      this.agendados = aulas;
    } catch (error) {
      console.error('Erro ao carregar aulas agendadas:', error);
      alert('Erro ao carregar aulas agendadas.');
    } finally {
      this.isLoading = false;
    }
  }

  onDateSelected(event: any) {
    const rawDate = event.detail.value;
    const date = new Date(rawDate);
    this.selectedDate = date.toISOString().split('T')[0];
    this.showDatePicker = false;
    this.loadAgendados();
  }

  clearDateFilter() {
    this.selectedDate = null;
    this.loadAgendados();
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
