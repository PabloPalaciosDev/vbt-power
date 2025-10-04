import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  close,
  informationCircle,
  speedometer,
  flashlight,
  analytics,
  barbell,
  warning,
  trophy,
  fitness,
  checkmarkCircle,
  informationCircleOutline
} from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonList,
  IonNote,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-info-vbt',
  templateUrl: './info-vbt.page.html',
  styleUrls: ['./info-vbt.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonList,
    IonNote,
  ],
})
export class InfoVbtPage {
  noMostrarDeNuevo: boolean = false;

  constructor(private modalController: ModalController) {
    addIcons({
      close,
      informationCircle,
      speedometer,
      flashlight,
      analytics,
      barbell,
      warning,
      trophy,
      fitness,
      checkmarkCircle,
      informationCircleOutline
    });
  }

  /**
   * Cerrar modal
   */
  async cerrar() {
    console.log('Cerrando modal con noMostrarDeNuevo:', this.noMostrarDeNuevo);
    try {
      await this.modalController.dismiss({
        noMostrarDeNuevo: this.noMostrarDeNuevo,
      });
      console.log('Modal cerrado exitosamente');
    } catch (error) {
      console.error('Error al cerrar modal:', error);
    }
  }

  /**
   * Obtener clasificaciones por ejercicio
   */
  getClasificacionesSquat() {
    return [
      { velocidad: '≥ 0.8 m/s', categoria: 'Explosiva', color: 'success', icono: 'flashlight', porcentaje: '30-50% 1RM' },
      { velocidad: '0.65 - 0.8 m/s', categoria: 'Rápida', color: 'primary', icono: 'speedometer', porcentaje: '50-70% 1RM' },
      { velocidad: '0.5 - 0.65 m/s', categoria: 'Moderada', color: 'warning', icono: 'analytics', porcentaje: '70-85% 1RM' },
      { velocidad: '< 0.5 m/s', categoria: 'Lenta', color: 'danger', icono: 'barbell', porcentaje: '85-100% 1RM' },
    ];
  }

  getClasificacionesBench() {
    return [
      { velocidad: '≥ 1.0 m/s', categoria: 'Explosiva', color: 'success', icono: 'flashlight', porcentaje: '30-50% 1RM' },
      { velocidad: '0.75 - 1.0 m/s', categoria: 'Rápida', color: 'primary', icono: 'speedometer', porcentaje: '50-70% 1RM' },
      { velocidad: '0.6 - 0.75 m/s', categoria: 'Moderada', color: 'warning', icono: 'analytics', porcentaje: '70-85% 1RM' },
      { velocidad: '< 0.6 m/s', categoria: 'Lenta', color: 'danger', icono: 'barbell', porcentaje: '85-100% 1RM' },
    ];
  }

  getClasificacionesDeadlift() {
    return [
      { velocidad: '≥ 0.7 m/s', categoria: 'Explosiva', color: 'success', icono: 'flashlight', porcentaje: '30-50% 1RM' },
      { velocidad: '0.55 - 0.7 m/s', categoria: 'Rápida', color: 'primary', icono: 'speedometer', porcentaje: '50-70% 1RM' },
      { velocidad: '0.4 - 0.55 m/s', categoria: 'Moderada', color: 'warning', icono: 'analytics', porcentaje: '70-85% 1RM' },
      { velocidad: '< 0.4 m/s', categoria: 'Lenta', color: 'danger', icono: 'barbell', porcentaje: '85-100% 1RM' },
    ];
  }

  /**
   * Obtener niveles de intensidad
   */
  getNivelesIntensidad() {
    return [
      { porcentaje: '≥ 90%', nivel: '🔥 Máxima Intensidad', descripcion: 'Fuerza máxima - Series de 1-3 reps' },
      { porcentaje: '80-90%', nivel: '⚡ Alta Intensidad', descripcion: 'Fuerza - Series de 3-6 reps' },
      { porcentaje: '70-80%', nivel: '💪 Moderada-Alta', descripcion: 'Hipertrofia/Fuerza - Series de 6-10 reps' },
      { porcentaje: '60-70%', nivel: '🏃 Moderada', descripcion: 'Hipertrofia - Series de 8-12 reps' },
      { porcentaje: '< 60%', nivel: '😌 Baja Intensidad', descripcion: 'Técnica/Calentamiento - Series de 12+ reps' },
    ];
  }
}
