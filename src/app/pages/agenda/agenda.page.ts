import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonCard,
  IonCardContent,
  IonButton,
  IonDatetime,
  IonCardHeader,
  ModalController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../main';
import { UserService } from '../../services/user.service';
import { AgendamentoModalComponent } from 'src/app/agendamento-modal/agendamento-modal.component';

interface User {
  userID: string;
  nome: string;
  papel: 'aluno' | 'professor';
  imagem?: string;
}

interface Aula {
  date: string;
  horarioInicio?: string;
  horarioFim?: string;
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
    FormsModule,
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    IonCard,
    IonCardContent,
    IonButton,
    IonDatetime,
    IonCardHeader
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgendaPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  uid = '';
  name = '';
  email = '';
  photoURL = '';
  isLoading = false;

  showDatePicker = false;
  selectedDate: string = new Date().toISOString().split('T')[0];

  agendaItems: {
    id: string;
    nome: string;
    status: string;
    cor: string;
    imagem: string;
    horarioInicio?: string;
    horarioFim?: string;
  }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    const profile = await this.userService.loadUserProfileFromStorage();
    if (profile) {
      this.uid = profile['uid'];
      this.role = profile['role'] || 'aluno';
      this.name = profile['name'] || 'Usuário';
      this.email = profile['email'] || '';
      this.photoURL = profile['photoURL'] || 'assets/photo/avatar.png';
      this.loadAgendaItems();
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
        const bookedQuery = query(collection(db, 'agenda'),
          where('date', '==', this.selectedDate),
          where('status', '==', 'confirmado')
        );
        const bookedSnap = await getDocs(bookedQuery);
        const busyProfessores = new Set(bookedSnap.docs.map(d => (d.data() as Aula)['professorId']));

        const allProfQuery = query(collection(db, 'user'), where('papel', '==', 'professor'));
        const profSnap = await getDocs(allProfQuery);

        profSnap.forEach(docSnap => {
          const data = docSnap.data() as User;

          if (!busyProfessores.has(data['userID'])) {
            this.agendaItems.push({
              id: data['userID'],
              nome: data['nome'],
              status: 'Disponível',
              cor: 'success',
              imagem: data['imagem'] || 'assets/fotos/default.png'
            });
          }
        });
      } else {
        const aulasQuery = query(collection(db, 'agenda'),
          where('date', '==', this.selectedDate),
          where('professorId', '==', this.uid)
        );
        const aulasSnap = await getDocs(aulasQuery);

        for (const docSnap of aulasSnap.docs) {
          const aula = docSnap.data() as Aula;

          const alunoSnap = await getDocs(query(collection(db, 'user'), where('userID', '==', aula['alunoId'])));
          const aluno = alunoSnap.docs[0]?.data() as User;

          this.agendaItems.push({
            id: docSnap.id,
            nome: aluno?.['nome'] || 'Aluno',
            status: aula.status,
            cor: aula.status === 'confirmado' ? 'success' : 'warning',
            imagem: aluno?.['imagem'] || 'assets/fotos/default.png',
            horarioInicio: aula.horarioInicio,
            horarioFim: aula.horarioFim
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

  async abrirModal(professorId: string) {
    const modal = await this.modalCtrl.create({
      component: AgendamentoModalComponent,
      componentProps: {
        date: this.selectedDate,
        alunoName: this.name,
        professorId: professorId
      }
    });

    modal.onDidDismiss().then(result => {
      if (result.role === 'confirm') {
        const { horarioInicio, horarioFim } = result.data;
        this.marcarAula(professorId, horarioInicio, horarioFim);
      }
    });

    await modal.present();
  }

  async marcarAula(professorId: string, horarioInicio: string, horarioFim: string) {
    if (!this.selectedDate || !this.uid) return;

    try {
      await addDoc(collection(db, 'agenda'), {
        date: this.selectedDate,
        horarioInicio: horarioInicio,
        horarioFim: horarioFim,
        professorId: professorId,
        alunoId: this.uid,
        status: 'pendente' // Aluno marca como pendente, professor confirma
      });
      alert('Aula marcada! Aguarde confirmação do professor.');
      this.loadAgendaItems();
    } catch (error) {
      console.error('Erro ao marcar aula:', error);
      alert('Erro ao marcar aula.');
    }
  }

  async confirmarAula(aulaId: string) {
    try {
      await updateDoc(doc(db, 'agenda', aulaId), {
        status: 'confirmado'
      });
      alert('Aula confirmada!');
      this.loadAgendaItems();
    } catch (error) {
      console.error('Erro ao confirmar aula:', error);
      alert('Erro ao confirmar aula.');
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
