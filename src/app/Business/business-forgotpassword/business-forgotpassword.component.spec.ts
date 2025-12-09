import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessForgotpasswordComponent } from './business-forgotpassword.component';

describe('BusinessForgotpasswordComponent', () => {
  let component: BusinessForgotpasswordComponent;
  let fixture: ComponentFixture<BusinessForgotpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessForgotpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessForgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
