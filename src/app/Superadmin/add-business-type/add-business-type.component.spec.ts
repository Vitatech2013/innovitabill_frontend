import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessTypeComponent } from './add-business-type.component';

describe('AddBusinessTypeComponent', () => {
  let component: AddBusinessTypeComponent;
  let fixture: ComponentFixture<AddBusinessTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBusinessTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBusinessTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
