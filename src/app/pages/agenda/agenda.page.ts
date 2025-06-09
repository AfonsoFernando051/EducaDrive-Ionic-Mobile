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
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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
  horario?: string;
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
        // Professores ocupados nesse dia
        const bookedQuery = query(collection(db, 'agenda'),
          where('date', '==', this.selectedDate),
          where('status', '==', 'confirmado')
        );
        const bookedSnap = await getDocs(bookedQuery);
        const busyProfessores = new Set(bookedSnap.docs.map(d => (d.data() as Aula)['professorId']));

        // Professores disponíveis
        const allProfQuery = query(collection(db, 'user'), where('papel', '==', 'professor'));
        const profSnap = await getDocs(allProfQuery);

        profSnap.forEach(docSnap => {
          const data = docSnap.data() as User;

          // Comparar com userID, não com docSnap.id
          if (!busyProfessores.has(data['userID'])) {
            this.agendaItems.push({
              id: data['userID'],  // salva userID no agenda
              nome: data['nome'],
              status: 'Disponível',
              cor: 'success',
              imagem: data['imagem'] || 'assets/fotos/default.png'
            });
          }
        });
      } else {
        // Professor: aulas marcadas nesse dia
        const aulasQuery = query(collection(db, 'agenda'),
          where('date', '==', this.selectedDate),
          where('professorId', '==', this.uid),
          where('status', '==', 'confirmado')
        );
        const aulasSnap = await getDocs(aulasQuery);

        for (const docSnap of aulasSnap.docs) {
          const aula = docSnap.data() as Aula;

          // Buscar aluno correspondente
          const alunoSnap = await getDocs(query(collection(db, 'user'), where('userID', '==', aula['alunoId'])));
          const aluno = alunoSnap.docs[0]?.data() as User;

          this.agendaItems.push({
            id: docSnap.id,  // aqui o id da aula (para cancelar)
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
        const { horario, status } = result.data;
        this.marcarAula(professorId, horario, status);
      }
    });

    await modal.present();
  }

  async marcarAula(professorId: string, horario: string, status: string) {
    if (!this.selectedDate || !this.uid) return;

    try {
      await addDoc(collection(db, 'agenda'), {
        date: this.selectedDate,
        horario: horario,
        professorId: professorId,  // aqui já será o userID
        alunoId: this.uid,
        status: status
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
