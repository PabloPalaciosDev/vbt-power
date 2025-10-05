import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VbtPage } from './vbt.page';

describe('VbtPage', () => {
  let component: VbtPage;
  let fixture: ComponentFixture<VbtPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VbtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.carga).toBe(0);
    expect(component.velocidad).toBe(0);
    expect(component.ejercicio).toBe(1);
    expect(component.porcentaje).toBe(100);
  });

  it('should validate form correctly', () => {
    component.carga = 0;
    component.velocidad = 0;
    expect(component.esFormularioValido()).toBeFalsy();

    component.carga = 100;
    component.velocidad = 0.5;
    component.porcentaje = 80;
    expect(component.esFormularioValido()).toBeTruthy();
  });

  it('should call vbtCalcular method', async () => {
    spyOn(component, 'vbtCalcular').and.callThrough();

    component.carga = 100;
    component.velocidad = 0.8;
    component.ejercicio = 2;
    component.porcentaje = 85;

    await component.vbtCalcular();

    expect(component.vbtCalcular).toHaveBeenCalled();
    expect(component.mostrarResultados).toBeTruthy();
    expect(component.resultado1RM).toBeGreaterThan(0);
    expect(component.cargaEstimada).toBeGreaterThan(0);
    expect(component.percent1Rm).toBeGreaterThan(0);
  });
});
