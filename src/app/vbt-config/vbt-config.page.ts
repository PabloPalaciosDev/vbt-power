import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  settings,
  save,
  arrowBack,
  checkmarkCircle,
  alertCircle,
  informationCircleOutline,
  barbell,
  speedometer,
  trash
} from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonInput,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonAlert,
  IonToast,
  AlertController,
  ToastController,
  IonLabel
} from '@ionic/angular/standalone';
import { VbtConfigService, VbtPersonalizedData } from '../services/vbt-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vbt-config',
  templateUrl: './vbt-config.page.html',
  styleUrls: ['./vbt-config.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonInput,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonNote,

  ]
})
export class VbtConfigPage implements OnInit {
  configForm: FormGroup;
  isSubmitting = false;
  hasExistingData = false;

  constructor(
    private fb: FormBuilder,
    private vbtConfigService: VbtConfigService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({
      settings,
      save,
      arrowBack,
      checkmarkCircle,
      alertCircle,
      informationCircleOutline,
      barbell,
      speedometer,
      trash
    });

    this.configForm = this.initializeForm();
  }

  ngOnInit() {
    this.loadExistingData();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initializeForm(): FormGroup {
    return this.fb.group({
      // Squat
      squatVelocity90: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      squatLoad90: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      squatVelocity85: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      squatLoad85: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      squatVelocity75: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      squatLoad75: [0, [Validators.required, Validators.min(1), Validators.max(500)]],

      // Bench Press
      benchVelocity90: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      benchLoad90: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      benchVelocity85: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      benchLoad85: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      benchVelocity75: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      benchLoad75: [0, [Validators.required, Validators.min(1), Validators.max(500)]],

      // Deadlift
      deadliftVelocity90: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      deadliftLoad90: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      deadliftVelocity85: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      deadliftLoad85: [0, [Validators.required, Validators.min(1), Validators.max(500)]],
      deadliftVelocity75: [0, [Validators.required, Validators.min(0.1), Validators.max(2)]],
      deadliftLoad75: [0, [Validators.required, Validators.min(1), Validators.max(500)]]
    });
  }

  /**
   * Carga los datos existentes si están disponibles
   */
  private loadExistingData(): void {
    const existingData = this.vbtConfigService.getPersonalizedData();
    if (existingData) {
      this.hasExistingData = true;
      this.configForm.patchValue(existingData);
    }
  }

  /**
   * Guarda la configuración personalizada
   */
  async saveConfiguration(): Promise<void> {
    if (this.configForm.valid) {
      this.isSubmitting = true;

      try {
        const formData: VbtPersonalizedData = this.configForm.value;

        // Procesar y guardar los datos
        const coefficients = this.vbtConfigService.processAndSaveUserData(formData);

        // Mostrar mensaje de éxito
        await this.showSuccessMessage();

        // Navegar de vuelta
        setTimeout(() => {
          this.router.navigate(['/vbt']);
        }, 2000);

      } catch (error) {
        console.error('Error al guardar configuración:', error);
        await this.showErrorMessage('Error al guardar la configuración. Inténtalo de nuevo.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      await this.showErrorMessage('Por favor, completa todos los campos correctamente.');
    }
  }

  /**
   * Elimina los datos personalizados
   */
  async clearPersonalizedData(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar todos tus datos personalizados? Se volverán a usar los valores genéricos.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.vbtConfigService.clearPersonalizedData();
            this.configForm.reset();
            this.hasExistingData = false;
            this.showSuccessMessage('Datos personalizados eliminados correctamente.');
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Muestra mensaje de éxito
   */
  private async showSuccessMessage(message: string = '✅ Configuración guardada correctamente. Ahora se usarán tus valores personalizados.'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
  }

  /**
   * Muestra mensaje de error
   */
  private async showErrorMessage(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color: 'danger',
      icon: 'alertCircle'
    });
    await toast.present();
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.configForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['min']) return 'Valor muy bajo';
      if (field.errors['max']) return 'Valor muy alto';
    }
    return '';
  }

  /**
   * Verifica si el formulario es válido
   */
  isFormValid(): boolean {
    return this.configForm.valid;
  }

  /**
   * Obtiene el estado de configuración actual
   */
  getConfigStatus(): { isPersonalized: boolean, message: string } {
    return this.vbtConfigService.getConfigurationStatus();
  }
}
