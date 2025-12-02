import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { constants } from '../../../constants';
declare var bootstrap: any;
@Component({
  selector: 'app-superadmin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './superadmin-profile.component.html',
  styleUrls: ['./superadmin-profile.component.css'],
})
export class SuperadminProfileComponent implements OnInit {
  superadmin_id: any;
  profileForm!: FormGroup;
  superadminData: any;
  selectedImage: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  private baseUrl = constants.baseUrl;
  addressFields = [
    { label: 'House No', name: 'house_No' },
    { label: 'Town Name', name: 'town_Name' },
    { label: 'Mandal Name', name: 'mandal_Name' },
    { label: 'District Name', name: 'district_Name' },
    { label: 'State', name: 'state' },
    { label: 'Pincode', name: 'pincode' },
  ];
  profile: any;
  toastMessage: string | null = null;
  toastType: string | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: BillingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const a = JSON.parse(localStorage.getItem('sa') || '{}');
    this.superadmin_id = a?.data?._id || a?._id || null;

    this.profileForm = this.fb.group({
      superadmin_name: [''],
      superadmin_number: [''],
      superadmin_mail: [''],
      superadmin_password: [''],
      address: this.fb.group({
        house_No: [''],
        town_Name: [''],
        mandal_Name: [''],
        district_Name: [''],
        state: [''],
        pincode: [''],
      }),
      image: [''],
    });

    // this.profileForm = this.fb.group({
    //   superadmin_name: ['', Validators.required],
    //   superadmin_number: ['', Validators.required],
    //   superadmin_mail: ['', [Validators.required, Validators.email]],
    //   superadmin_password: ['', Validators.required],
    //   address: this.fb.group({
    //     house_No: [''],
    //     town_Name: [''],
    //     mandal_Name: [''],
    //     district_Name: [''],
    //     state: [''],
    //     pincode: [''],
    //   }),
    //   image: [''],
    // });

    this.fetchAdminData();
  }

  // profileedit() {
  //   if (this.superadminData) this.profileForm.patchValue(this.superadminData);
  // }

  profileedit() {
    console.log(this.superadminData,'superadmin data');
    
    if (!this.superadminData) return;
    this.profileForm.patchValue({
      superadmin_name: this.superadminData.superadmin_name,
      superadmin_number: this.superadminData.superadmin_number,
      superadmin_mail: this.superadminData.superadmin_mail,
      superadmin_password: this.superadminData.superadmin_password,
      address: this.superadminData.address,
    });

  }

  updateadminprofile() {
    if (this.profileForm.invalid) {
      this.showToast('Please fill all required fields.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append(
      'superadmin_name',
      this.profileForm.get('superadmin_name')?.value
    );
    formData.append(
      'superadmin_number',
      this.profileForm.get('superadmin_number')?.value
    );
    formData.append(
      'superadmin_mail',
      this.profileForm.get('superadmin_mail')?.value
    );
   const newPassword = this.profileForm.get('superadmin_password')?.value;

if (newPassword && newPassword.trim() !== '') {
  formData.append('password', newPassword);
} else {
  console.log("Password not changed");
}

    formData.append(
      'address',
      JSON.stringify(this.profileForm.get('address')?.value)
    );

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.profileService.profileupdate(formData, this.superadmin_id).subscribe({
      next: (res: any) => {
       
         this.showToast('Profile updated successfully!', 'success');
         this.fetchAdminData();
         
          let modal = bootstrap.Modal.getInstance(document.getElementById('roleModal'));
          modal?.hide();
// setTimeout(() => {
//   this.router.navigate(['/SuperAdminView/superadminProfile']);
// }, 500);


      
        if (this.selectedImage) {
          const reader = new FileReader();
          reader.onload = () => {
            this.previewUrl =
              this.getImageUrl(res.data.image) + '?t=' + Date.now();
          };

          reader.readAsDataURL(this.selectedImage);
        }
          this.fetchAdminData();
      const bsmodal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'))
      bsmodal.hide();
    
        // window.location.reload();
      },
      error: (err: any) => {
        console.error('Update failed:', err);
        // alert('Profile update failed! Please try again.');
         this.showToast('Profile update failed! Please try again.', 'Error');
      },
      
    });
  }


 showToast(message: string, type: string = 'success') {
  this.toastMessage = message;
  this.toastType = type;
  setTimeout(() => (this.toastMessage = null), 3000);
}



  fetchAdminData() {
    if (!this.superadmin_id) return;

    this.profileService.getadminprofile(this.superadmin_id).subscribe({
      next: (res: any) => {
        console.log(' Admin profile fetched successfully:', res);
        this.superadminData = res?.data || res;

        this.previewUrl =
          this.getImageUrl(this.superadminData.image) + '?t=' + Date.now();

        const { image, ...rest } = this.superadminData;
        this.profileForm.patchValue(rest);
      },
      error: (err) => console.error(' Error fetching admin profile:', err),
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }
  getImageUrl(image: string | null): string {
    if (!image) return '';
    return `${this.baseUrl}/business_images/${image}`;
  }
}
