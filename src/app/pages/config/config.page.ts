import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonIcon,
  IonCard,
  IonCardContent,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  imports: [
    CommonModule,
    IonIcon,
    IonCard,
    IonCardContent,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonSpinner
  ]
})
export class ConfigPage implements OnInit {
  isLoading = false;
  name = '';
  email = '';
  photoURL = '';
  role: 'aluno' | 'professor' = 'aluno';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || 'aluno';
      this.name = params['name'] || 'Usuário';
      this.email = params['email'] || '';
      this.photoURL = params['photoURL'] || 'assets/photo/avatar.png';

      console.log('Config Page - Dados recebidos:', this.role, this.name, this.email, this.photoURL);
    });
  }

  async logout() {
    this.isLoading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de espera
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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de salvamento
      alert('Alterações salvas com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar alterações: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }
}
