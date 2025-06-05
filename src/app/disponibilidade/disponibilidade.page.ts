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
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';

import { UserService } from '../services/user.service';

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
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonSpinner
]

})
export class DisponibilidadePage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  uid = '';
  name = '';
  email = '';
  photoURL = '';
  isLoading = false;

  constructor(private router: Router, private userService: UserService) {}
diasSemana = [
  { label: 'Segunda-feira', selecionado: false },
  { label: 'Terça-feira', selecionado: false },
  { label: 'Quarta-feira', selecionado: false },
  { label: 'Quinta-feira', selecionado: false },
  { label: 'Sexta-feira', selecionado: false },
  { label: 'Sábado', selecionado: false },
  { label: 'Domingo', selecionado: false }
];

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

   async logout() {
    this.isLoading = true;
    try {
      await this.userService.clearUserProfile();  // limpa memória + storage
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
      const updatedProfile = {
        name: this.name,
        email: this.email,
        photoURL: this.photoURL,
        role: this.role
      };

      this.userService.setUserProfile(updatedProfile);  // atualiza memória + storage

      // Aqui você pode adicionar também lógica para salvar no Firestore se quiser
      alert('Alterações salvas com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar alterações: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }
}
