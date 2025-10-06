import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface VbtPersonalizedData {
  // Squat data
  squatVelocity90: number;
  squatLoad90: number;
  squatVelocity85: number;
  squatLoad85: number;
  squatVelocity75: number;
  squatLoad75: number;

  // Bench Press data
  benchVelocity90: number;
  benchLoad90: number;
  benchVelocity85: number;
  benchLoad85: number;
  benchVelocity75: number;
  benchLoad75: number;

  // Deadlift data
  deadliftVelocity90: number;
  deadliftLoad90: number;
  deadliftVelocity85: number;
  deadliftLoad85: number;
  deadliftVelocity75: number;
  deadliftLoad75: number;
}

export interface VbtRegressionCoefficients {
  regresionASquat: number;
  regresionBSquat: number;
  regresionABench: number;
  regresionBBench: number;
  regresionADeadlift: number;
  regresionBDeadlift: number;
}

export interface VbtCalculationInput {
  carga: number;
  velocidad: number;
  ejercicio: number;
  porcentaje: number;
}

export interface VbtCalculationResult {
  percent1Rm: number;
  resultado1RM: number;
  cargaEstimada: number;
}

@Injectable({
  providedIn: 'root',
})
export class VbtConfigService {
  private readonly STORAGE_KEY = 'vbt_personalized_data';
  private readonly COEFFICIENTS_KEY = 'vbt_regression_coefficients';

  constructor() {}

  /**
   * Guarda los datos personalizados del usuario en localStorage
   */
  savePersonalizedData(data: VbtPersonalizedData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar datos personalizados:', error);
    }
  }

  /**
   * Obtiene los datos personalizados del localStorage
   */
  getPersonalizedData(): VbtPersonalizedData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al obtener datos personalizados:', error);
      return null;
    }
  }

  /**
   * Verifica si existen datos personalizados
   */
  hasPersonalizedData(): boolean {
    return this.getPersonalizedData() !== null;
  }

  /**
   * Elimina los datos personalizados
   */
  clearPersonalizedData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.COEFFICIENTS_KEY);
    } catch (error) {
      console.error('Error al eliminar datos personalizados:', error);
    }
  }

  /**
   * Calcula y guarda los coeficientes de regresión basados en los datos personalizados
   */
  calculateAndSaveRegressionCoefficients(
    data: VbtPersonalizedData
  ): VbtRegressionCoefficients {
    // Calcular coeficientes para Squat
    const squatCoeffs = this.calculateRegressionCoefficients([
      { velocity: data.squatVelocity90, percentage: 90 },
      { velocity: data.squatVelocity85, percentage: 85 },
      { velocity: data.squatVelocity75, percentage: 75 },
    ]);

    // Calcular coeficientes para Bench Press
    const benchCoeffs = this.calculateRegressionCoefficients([
      { velocity: data.benchVelocity90, percentage: 90 },
      { velocity: data.benchVelocity85, percentage: 85 },
      { velocity: data.benchVelocity75, percentage: 75 },
    ]);

    // Calcular coeficientes para Deadlift
    const deadliftCoeffs = this.calculateRegressionCoefficients([
      { velocity: data.deadliftVelocity90, percentage: 90 },
      { velocity: data.deadliftVelocity85, percentage: 85 },
      { velocity: data.deadliftVelocity75, percentage: 75 },
    ]);

    const coefficients: VbtRegressionCoefficients = {
      regresionASquat: squatCoeffs.slope,
      regresionBSquat: squatCoeffs.intercept,
      regresionABench: benchCoeffs.slope,
      regresionBBench: benchCoeffs.intercept,
      regresionADeadlift: deadliftCoeffs.slope,
      regresionBDeadlift: deadliftCoeffs.intercept,
    };

    // Guardar coeficientes calculados
    try {
      localStorage.setItem(this.COEFFICIENTS_KEY, JSON.stringify(coefficients));
    } catch (error) {
      console.error('Error al guardar coeficientes:', error);
    }

    return coefficients;
  }

  /**
   * Calcula los coeficientes de regresión lineal usando el método de mínimos cuadrados
   */
  private calculateRegressionCoefficients(
    points: { velocity: number; percentage: number }[]
  ): { slope: number; intercept: number } {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.velocity, 0);
    const sumY = points.reduce((sum, p) => sum + p.percentage, 0);
    const sumXY = points.reduce((sum, p) => sum + p.velocity * p.percentage, 0);
    const sumXX = points.reduce((sum, p) => sum + p.velocity * p.velocity, 0);

    let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;

    // Forzar pendiente negativa (la relación velocidad-%1RM siempre desciende)
    if (slope > 0) slope = -slope;

    return {
      slope: parseFloat(slope.toFixed(3)),
      intercept: parseFloat(intercept.toFixed(3)),
    };
  }

  /**
   * Obtiene los coeficientes de regresión (personalizados o del environment)
   */
  getRegressionCoefficients(): VbtRegressionCoefficients {
    try {
      const savedCoefficients = localStorage.getItem(this.COEFFICIENTS_KEY);
      if (savedCoefficients) {
        return JSON.parse(savedCoefficients);
      }
    } catch (error) {
      console.error('Error al obtener coeficientes guardados:', error);
    }

    // Si no hay coeficientes personalizados, usar los del environment
    return {
      regresionASquat: environment.regresionASquat,
      regresionBSquat: environment.regresionBSquat,
      regresionABench: environment.regresionABench,
      regresionBBench: environment.regresionBBench,
      regresionADeadlift: environment.regresionADeadlift,
      regresionBDeadlift: environment.regresionBDeadlift,
    };
  }

  /**
   * Procesa y guarda los datos del formulario
   */
  processAndSaveUserData(
    formData: VbtPersonalizedData
  ): VbtRegressionCoefficients {
    // 1. Guardar datos del formulario
    this.savePersonalizedData(formData);

    // 2. Calcular y guardar coeficientes de regresión
    const coefficients = this.calculateAndSaveRegressionCoefficients(formData);

    return coefficients;
  }

  /**
   * Obtiene el estado de configuración (si usa datos personalizados o genéricos)
   */
  getConfigurationStatus(): { isPersonalized: boolean; message: string } {
    const isPersonalized = this.hasPersonalizedData();

    return {
      isPersonalized,
      message: isPersonalized
        ? '✅ Usando tus valores personalizados de VBT'
        : '⚠️ Estas usando valores genéricos',
    };
  }

  /**
   * Calcula el porcentaje de 1RM basado en la velocidad y ejercicio
   */
  private calculateOneRmPercentage(ejercicio: number, velocidad: number): number {
    const coefficients = this.getRegressionCoefficients();

    switch (ejercicio) {
      case 1: // Squat
        return coefficients.regresionASquat * velocidad + coefficients.regresionBSquat;
      case 2: // Bench Press
        return coefficients.regresionABench * velocidad + coefficients.regresionBBench;
      case 3: // Deadlift
        return coefficients.regresionADeadlift * velocidad + coefficients.regresionBDeadlift;
      default:
        return 0;
    }
  }

  /**
   * Realiza todos los cálculos VBT y devuelve los resultados
   */
  calculateVbt(input: VbtCalculationInput): VbtCalculationResult {
    // 1️⃣ Calcular % del 1RM estimado según la velocidad
    const percent1Rm = this.calculateOneRmPercentage(input.ejercicio, input.velocidad);

    // 2️⃣ Calcular 1RM estimado
    const resultado1RM = input.carga / (percent1Rm / 100);

    // 3️⃣ Calcular carga estimada para el porcentaje solicitado
    let cargaEstimada: number;
    if (input.porcentaje === 100) {
      cargaEstimada = resultado1RM;
    } else {
      cargaEstimada = resultado1RM * (input.porcentaje / 100);
    }

    return {
      percent1Rm,
      resultado1RM,
      cargaEstimada
    };
  }
}
