import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  calculator,
  arrowBack,
  fitness,
  analytics,
  checkmarkCircle,
  barbell,
  speedometer,
  trophy,
  refresh,
  informationCircle,
  flashlight,
  star,
  book,
  informationCircleOutline
} from 'ionicons/icons';
import { IonTitle } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonContent,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonButtons,
  IonCardHeader,
  IonNote,
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { InfoVbtPage } from './info-vbt/info-vbt.page';

@Component({
  selector: 'app-vbt',
  templateUrl: './vbt.page.html',
  styleUrls: ['./vbt.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonTitle,
    IonButtons,
    IonCardHeader,
    IonNote,
  ],
})
export class VbtPage implements OnInit {
  // Variables del formulario
  carga: number = 0;
  velocidad: number = 0;
  ejercicio: number = 1;
  porcentaje: number = 100;

  // Variables para mostrar resultados
  mostrarResultados: boolean = false;
  calculando: boolean = false;
  resultado1RM: number | null = null;
  cargaEstimada: number | null = null;
  percent1Rm: number | null = null;

  // Variables para mejorar UX
  animarResultados: boolean = false;

  // Variables para el modal informativo
  private readonly STORAGE_KEY = 'vbt_no_mostrar_info';

  // Opciones para el select de ejercicios
  ejercicios = [
    { valor: 1, nombre: 'Squat' },
    { valor: 2, nombre: 'Bench Press' },
    { valor: 3, nombre: 'Deadlift' },
  ];

  constructor(private modalCtrl: ModalController) {
    addIcons({
      calculator,
      arrowBack,
      fitness,
      analytics,
      checkmarkCircle,
      barbell,
      speedometer,
      trophy,
      refresh,
      informationCircle,
      flashlight,
      star,
      informationCircleOutline,
      book,
    });
  }

  ngOnInit() {
    this.verificarMostrarModal();
  }

  /**
   * Verificar si debe mostrar el modal informativo
   */
  private verificarMostrarModal() {
    const noMostrar = localStorage.getItem(this.STORAGE_KEY);
    if (!noMostrar) {
      // Mostrar modal después de un pequeño delay para mejor UX
      setTimeout(() => {
        this.mostrarModalInfo();
      }, 800);
    }
  }

  /**
   * Mostrar modal informativo
   */
  async mostrarModalInfo() {
    console.log('Creando modal InfoVBT...');
    try {
      const modal = await this.modalCtrl.create({
        component: InfoVbtPage,
        cssClass: 'info-modal-class',
        backdropDismiss: true,
        showBackdrop: true,
        animated: true,
      });

      modal.onDidDismiss().then((result) => {
        console.log('Modal dismissido con resultado:', result);
        if (result.data && result.data.noMostrarDeNuevo) {
          localStorage.setItem(this.STORAGE_KEY, 'true');
          console.log('Preferencia guardada: no mostrar de nuevo');
        }
      });

      console.log('Presentando modal...');
      return await modal.present();
    } catch (error) {
      console.error('Error al mostrar modal:', error);
    }
  }

  async vbtCalcular() {
    this.calculando = true;
    this.animarResultados = false;

    // Simular un pequeño delay para mejor UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 1️⃣ Calcular % del 1RM estimado según la velocidad
    this.percent1Rm = this.oneRmPercentage(this.ejercicio, this.velocidad);

    // 2️⃣ Calcular 1RM estimado
    this.resultado1RM = this.carga / (this.percent1Rm / 100);

    // 3️⃣ Calcular carga estimada para el porcentaje solicitado
    if (this.porcentaje === 100) {
      this.cargaEstimada = this.resultado1RM;
    } else {
      this.cargaEstimada = this.resultado1RM * (this.porcentaje / 100);
    }

    this.calculando = false;

    // 4️⃣ Mostrar resultados con animación
    setTimeout(() => {
      this.mostrarResultados = true;
      this.animarResultados = true;
    }, 100);
  }

  oneRmPercentage(movimiento: number, velocidad: number): number {
    switch (movimiento) {
      case 1: // Squat
        return (
          environment.regresionASquat * velocidad + environment.regresionBSquat
        );
      case 2: // Bench Press
        return (
          environment.regresionABench * velocidad + environment.regresionBBench
        );
      case 3: // Deadlift
        return (
          environment.regresionADeadlift * velocidad +
          environment.regresionBDeadlift
        );
      default:
        return 0;
    }
  }

  /**
   * Obtener nombre del ejercicio seleccionado
   */
  obtenerNombreEjercicio(): string {
    const ejercicioSeleccionado = this.ejercicios.find(
      (e) => e.valor === this.ejercicio
    );
    return ejercicioSeleccionado ? ejercicioSeleccionado.nombre : 'Desconocido';
  }

  /**
   * Limpiar formulario y resultados
   */
  limpiarFormulario() {
    this.carga = 0;
    this.velocidad = 0;
    this.ejercicio = 1;
    this.porcentaje = 100;
    this.mostrarResultados = false;
    this.animarResultados = false;
  }

  /**
   * Obtener clasificación de velocidad específica por ejercicio
   */
  obtenerClasificacionVelocidad(): {
    texto: string;
    color: string;
    icono: string;
  } {
    if (!this.velocidad) return { texto: '', color: 'medium', icono: '' };

    switch (this.ejercicio) {
      case 1: // Squat
        if (this.velocidad >= 0.8) {
          return { texto: 'Explosiva', color: 'success', icono: 'flashlight' };
        } else if (this.velocidad >= 0.65) {
          return { texto: 'Rápida', color: 'primary', icono: 'speedometer' };
        } else if (this.velocidad >= 0.5) {
          return { texto: 'Moderada', color: 'warning', icono: 'analytics' };
        } else {
          return { texto: 'Lenta', color: 'danger', icono: 'barbell' };
        }

      case 2: // Bench Press
        if (this.velocidad >= 1.0) {
          return { texto: 'Explosiva', color: 'success', icono: 'flashlight' };
        } else if (this.velocidad >= 0.75) {
          return { texto: 'Rápida', color: 'primary', icono: 'speedometer' };
        } else if (this.velocidad >= 0.6) {
          return { texto: 'Moderada', color: 'warning', icono: 'analytics' };
        } else {
          return { texto: 'Lenta', color: 'danger', icono: 'barbell' };
        }

      case 3: // Deadlift
        if (this.velocidad >= 0.7) {
          return { texto: 'Explosiva', color: 'success', icono: 'flashlight' };
        } else if (this.velocidad >= 0.55) {
          return { texto: 'Rápida', color: 'primary', icono: 'speedometer' };
        } else if (this.velocidad >= 0.4) {
          return { texto: 'Moderada', color: 'warning', icono: 'analytics' };
        } else {
          return { texto: 'Lenta', color: 'danger', icono: 'barbell' };
        }

      default:
        return { texto: '', color: 'medium', icono: '' };
    }
  }

  /**
   * Obtener nivel de intensidad del porcentaje
   */
  obtenerNivelIntensidad(): string {
    if (this.percent1Rm! >= 90) return '🔥 Máxima Intensidad (Va a pesar)';
    if (this.percent1Rm! >= 80) return '⚡ Alta Intensidad (Puede pesar)';
    if (this.percent1Rm! >= 70)
      return '💪 Moderada-Alta (No pesa lo suficiente)';
    if (this.percent1Rm! >= 60) return '🏃 Moderada (No pesa)';
    return '😌 Baja Intensidad (Pa eso te quedas en casa)';
  }

  /**
   * Validar si el formulario es válido
   */
  esFormularioValido(): boolean {
    return this.carga > 0 && this.velocidad > 0 && this.porcentaje > 0;
  }
}
