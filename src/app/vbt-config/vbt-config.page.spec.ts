import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VbtConfigPage } from './vbt-config.page';

describe('VbtConfigPage', () => {
  let component: VbtConfigPage;
  let fixture: ComponentFixture<VbtConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VbtConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
