import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../main';
import { UserService } from '../../services/user.service';

interface User {
  uid: string;
  nome: string;
  papel: 'aluno' | 'professor';
  imagem?: string;
}

interface Aula {
  date: string;
  professorId: string;
  alunoId: string;
  status: string;
}

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
  uid = '';
  name = '';
  email = '';
  photoURL = '';
  isLoading = false;

  showDatePicker = false;
  selectedDate: string | null = null;

  agendaItems: {
    id: string;
    nome: string;
    status: string;
    cor: string;
    imagem: string;
  }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const profile = await this.userService.loadUserProfileFromStorage();
    if (profile) {
      this.uid = profile['uid'];
      this.role = profile['role'] || 'aluno';
      this.name = profile['name'] || 'Usuário';
      this.email = profile['email'] || '';
      this.photoURL = profile['photoURL'] || 'assets/photo/avatar.png';
    } else {
      console.warn('Nenhum perfil encontrado.');
      this.router.navigate(['/login']);
    }
  }

  onDateSelected(event: any) {
    const rawDate = event.detail.value;
    const date = new Date(rawDate);
    this.selectedDate = date.toISOString().split('T')[0];
    this.showDatePicker = false;
    this.loadAgendaItems();
  }

  async loadAgendaItems() {
    if (!this.selectedDate) {
      alert('Selecione uma data primeiro.');
      return;
    }

    this.isLoading = true;
    this.agendaItems = [];

    try {
      if (this.role === 'aluno') {
        // Aluno vê professores disponíveis
        const allProfQuery = query(collection(db, 'user'), where('papel', '==', 'professor'));
        const profSnap = await getDocs(allProfQuery);

        const bookedQuery = query(collection(db, 'agenda'),
          where('date', '==', this.selectedDate),
          where('status', '==', 'confirmado')
        );
        const bookedSnap = await getDocs(bookedQuery);
        const busyProfessores = new Set(bookedSnap.docs.map(d => (d.data() as Aula)['professorId']));

        profSnap.forEach(docSnap => {
          const data = docSnap.data() as User;
          if (!busyProfessores.has(docSnap.id)) {
            this.agendaItems.push({
              id: docSnap.id,
              nome: data['nome'],
              status: 'Disponível',
              cor: 'success',
              imagem: data['imagem'] || 'assets/fotos/default.png'
            });
          }
        });
      } else {
        // Professor vê suas aulas
        const aulasQuery = query(collection(db, 'agenda'),
          where('date', '==', this.selectedDate),
          where('professorId', '==', this.uid),
          where('status', '==', 'confirmado')
        );
        const aulasSnap = await getDocs(aulasQuery);

        for (const docSnap of aulasSnap.docs) {
          const aula = docSnap.data() as Aula;

          const alunoSnap = await getDocs(query(collection(db, 'user'), where('uid', '==', aula['alunoId'])));
          const aluno = alunoSnap.docs[0]?.data() as User;

          this.agendaItems.push({
            id: docSnap.id,
            nome: aluno?.['nome'] || 'Aluno',
            status: 'Marcada',
            cor: 'warning',
            imagem: aluno?.['imagem'] || 'assets/fotos/default.png'
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      alert('Erro ao carregar agenda.');
    } finally {
      this.isLoading = false;
    }
  }

  async marcarAula(professorId: string) {
    if (!this.selectedDate || !this.uid) return;

    try {
      await addDoc(collection(db, 'agenda'), {
        date: this.selectedDate,
        professorId: professorId,
        alunoId: this.uid,
        status: 'confirmado'
      });
      alert('Aula marcada!');
      this.loadAgendaItems();
    } catch (error) {
      console.error('Erro ao marcar aula:', error);
      alert('Erro ao marcar aula.');
    }
  }

  async cancelarAula(aulaId: string) {
    try {
      await deleteDoc(doc(db, 'agenda', aulaId));
      alert('Aula cancelada!');
      this.loadAgendaItems();
    } catch (error) {
      console.error('Erro ao cancelar aula:', error);
      alert('Erro ao cancelar aula.');
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
