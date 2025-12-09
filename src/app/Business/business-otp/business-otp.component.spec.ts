import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOtpComponent } from './business-otp.component';

describe('BusinessOtpComponent', () => {
  let component: BusinessOtpComponent;
  let fixture: ComponentFixture<BusinessOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
