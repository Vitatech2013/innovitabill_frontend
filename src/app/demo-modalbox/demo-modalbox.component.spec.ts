import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoModalboxComponent } from './demo-modalbox.component';

describe('DemoModalboxComponent', () => {
  let component: DemoModalboxComponent;
  let fixture: ComponentFixture<DemoModalboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoModalboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemoModalboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
