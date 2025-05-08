import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  IonSelectOption
} from '@ionic/angular/standalone';



@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  imports: [
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
    IonSelectOption
  ]
})
export class ConfigPage {
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}
