import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusinessTypeComponent } from './view-business-type.component';

describe('ViewBusinessTypeComponent', () => {
  let component: ViewBusinessTypeComponent;
  let fixture: ComponentFixture<ViewBusinessTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBusinessTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBusinessTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
