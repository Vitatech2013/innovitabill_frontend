import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveBusinesstypeComponent } from './inactive-businesstype.component';

describe('InactiveBusinesstypeComponent', () => {
  let component: InactiveBusinesstypeComponent;
  let fixture: ComponentFixture<InactiveBusinesstypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveBusinesstypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InactiveBusinesstypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
