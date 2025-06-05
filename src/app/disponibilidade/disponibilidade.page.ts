import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonCheckbox,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonContent
} from '@ionic/angular/standalone';

import { UserService } from '../services/user.service';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

interface Disponibility {
  dia: string;
  inicio: string;
  fim: string;
}

@Component({
  selector: 'app-disponibilidade',
  standalone: true,
  templateUrl: './disponibilidade.page.html',
  styleUrls: ['./disponibilidade.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonCheckbox,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonContent
  ]
})
export class DisponibilidadePage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  uid = '';
  name = '';
  email = '';
  photoURL = '';
  isLoading = false;

  diasSemana: (Disponibility & { selecionado: boolean })[] = [
    { dia: 'Segunda-feira', selecionado: false, inicio: '', fim: '' },
    { dia: 'Terça-feira', selecionado: false, inicio: '', fim: '' },
    { dia: 'Quarta-feira', selecionado: false, inicio: '', fim: '' },
    { dia: 'Quinta-feira', selecionado: false, inicio: '', fim: '' },
    { dia: 'Sexta-feira', selecionado: false, inicio: '', fim: '' },
    { dia: 'Sábado', selecionado: false, inicio: '', fim: '' },
    { dia: 'Domingo', selecionado: false, inicio: '', fim: '' }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
    const profile = await this.userService.loadUserProfileFromStorage();
    if (profile) {
      this.uid = profile['uid'] || '';
      this.role = profile['role'] || 'aluno';
      this.name = profile['name'] || 'Usuário';
      this.email = profile['email'] || '';
      this.photoURL = profile['photoURL'] || 'assets/photo/avatar.png';

      if (this.uid) {
        const docRef = doc(this.firestore, 'disponibility', this.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data() as any;
          const disponiveis = data.disponibility || [];

          this.diasSemana.forEach(dia => {
            const encontrado = disponiveis.find((d: any) => d.dia === dia.dia);
            if (encontrado) {
              dia.inicio = encontrado.inicio;
              dia.fim = encontrado.fim;
              dia.selecionado = encontrado.inicio !== '' || encontrado.fim !== '';
            }
          });
        }
      }
    } else {
      console.warn('Nenhum perfil encontrado.');
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    this.isLoading = true;
    try {
      await this.userService.clearUserProfile();
      this.router.navigate(['/login']);
      alert('Você saiu com sucesso!');
    } catch (error: any) {
      alert('Erro ao sair: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }

  async saveChanges() {
    this.isLoading = true;
    try {
      if (!this.uid) {
        const profile = await this.userService.loadUserProfileFromStorage();
        if (profile?.uid) {
          this.uid = profile.uid;
        } else {
          throw new Error('UID não encontrado. Não é possível salvar.');
        }
      }

      const updatedProfile = {
        uid: this.uid,
        name: this.name,
        email: this.email,
        photoURL: this.photoURL,
        role: this.role
      };

      this.userService.setUserProfile(updatedProfile);

      const disponibilidade = this.diasSemana.map(d => ({
        dia: d.dia,
        inicio: d.inicio || '',
        fim: d.fim || ''
      }));

      const docRef = doc(this.firestore, 'disponibility', this.uid);
      await setDoc(docRef, {
        uid: this.uid,
        disponibility: disponibilidade
      });

      alert('Disponibilidade salva com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar alterações: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }
}
