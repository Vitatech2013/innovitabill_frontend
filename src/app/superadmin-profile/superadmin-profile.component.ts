import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-superadmin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './superadmin-profile.component.html',
  styleUrl: './superadmin-profile.component.css'
})
export class SuperadminProfileComponent implements OnInit {

  superadmin_id: any;
  superadminprofileForm!:FormGroup;
previewUrl: any;
  back:any;
  editForm!: FormGroup;
  superadminData: any;
  selectedImage: any;


constructor(private fb:FormBuilder, private router:Router, private profileService: BillingService, private location: Location){}


  ngOnInit(): void {
    const a = JSON.parse(localStorage.getItem('sa') || '{}');
this.superadmin_id = a?.data?._id || a?._id || null;
console.log('superadmin_id:', this.superadmin_id);


this.superadminprofileForm = this.fb.group({
  superadmin_name: ['', [Validators.required]],
  superadmin_number:['', [Validators.required]],
   superadmin_mail: ['', [Validators.required, Validators.email]],
      superadmin_password: ['', Validators.required],
      image:[''],
      address:['', [Validators.required]],
})
 
this.editForm= this.fb.group({
 superadmin_name: ['', [Validators.required]],
  superadmin_number:['', [Validators.required]],
   superadmin_mail: ['', [Validators.required, Validators.email]],
      superadmin_password: ['', Validators.required],
      image:[''],
      address:['', [Validators.required]],
})

  } 
profileedit(){
  if(!this.superadminData) return;
  this.editForm.patchValue({
   superadmin_name:this.superadminData.superadmin_name,
   superadmin_number: this.superadminData.superadmin_number, 
   superadmin_mail: this.superadminData.superadmin_mail,
   superadmin_password: this.superadminData.superadmin_password,
   image: this.superadminData.image,
   address: this.superadminData.address,
  })
}



updateadminprofile() {
  if (this.editForm.invalid) {
    alert(' Please fill all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('superadmin_name', this.editForm.get('superadmin_name')?.value);
  formData.append('superadmin_number', this.editForm.get('superadmin_number')?.value);
  formData.append('superadmin_mail', this.editForm.get('superadmin_mail')?.value);
  formData.append('superadmin_password', this.editForm.get('superadmin_password')?.value);
  formData.append('image', this.editForm.get('superadmin_password')?.value);
  formData.append('address', this.editForm.get('superadmin_password')?.value);
  

  if (this.selectedImage) {
    formData.append('image', this.selectedImage);
  }

  this.profileService.profileupdate(formData, this.superadmin_id).subscribe(
    (res: any) => {
      alert('Profile updated successfully!');

     
      if (this.selectedImage) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(this.selectedImage);
      }

      
      this.fetchAdminData();
    },
    (err: any) => {
      console.error('Update failed:', err);
      alert(' Profile update failed! Please try again.');
    }
  );
}
 fetchAdminData() {
  if (!this.superadmin_id) {
    console.error(' Admin ID missing!');
    return;
  }

  this.profileService.getadminprofile(this.superadmin_id).subscribe(
    (res: any) => {
      console.log(' Admin profile fetched successfully:', res);
      this.superadminData = res?.data || res; // store fetched data

      
      if (this.editForm) {
        this.editForm.patchValue({
          superadmin_name:this.superadminData.superadmin_name,
   superadmin_number: this.superadminData.superadmin_number, 
   superadmin_mail: this.superadminData.superadmin_mail,
   superadmin_password: this.superadminData.superadmin_password,
   image: this.previewUrl,
   address: this.superadminData.address,
        });
      }

      
      if (this.superadminData.admin_image) {
        this.previewUrl = `http://localhost:3003/uploads/${this.superadminData.admin_image}`;
      }
    },
    (err: any) => {
      console.error('❌ Error fetching admin profile:', err);
      alert('Failed to load admin profile. Please try again later.');
    }
  );
}



 
onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement; // 👈 Cast to HTMLInputElement
  const file = input.files?.[0]; // use optional chaining to avoid null errors

  if (file) {
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}




// goBack() {
//   this.location.back();
//    this.router.navigate(['SuperAdminView']);
// }
}
