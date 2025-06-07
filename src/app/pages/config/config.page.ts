import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

import { Auth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ]
})
export class ConfigPage implements OnInit {
  role: 'aluno' | 'professor' = 'aluno';
  uid = '';
  name = '';
  email = '';
  photoURL = '';
  isLoading = false;

  // Variáveis para alteração de senha
  currentPassword = '';
  newPassword = '';

  constructor(private router: Router, private userService: UserService, private auth: Auth) {}

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

      alert('Alterações salvas com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar alterações: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }

  // NOVA FUNÇÃO - alterar senha
  async changePassword() {
    this.isLoading = true;

    try {
      const user = this.auth.currentUser;

      if (!user || !user.email) {
        throw new Error('Usuário não autenticado ou sem e-mail.');
      }

      // 1️⃣ Reautenticar
      const credential = EmailAuthProvider.credential(user.email, this.currentPassword);

      await reauthenticateWithCredential(user, credential);
      console.log('Reautenticação bem-sucedida.');

      // 2️⃣ Atualizar senha
      await updatePassword(user, this.newPassword);
      console.log('Senha atualizada com sucesso!');

      alert('Senha alterada com sucesso!');

      // Limpa os campos de senha do form
      this.currentPassword = '';
      this.newPassword = '';

    } catch (error: any) {
      console.error('Erro ao mudar senha:', error);
      alert('Erro ao mudar senha: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }
}
