import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { constants } from '../../../../constants';
import { BillingService } from '../../Services/billing.service';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css'],
})
export class BusinessListComponent implements OnInit {
  business: any[] = [];
  BusinessForm!: FormGroup;
  selectedBusiness: any = null;
  isEditing = false;
  deleteId: string | null = null;
  s_id: any;
  selectedImage: string | undefined;
  selectedFiles: Record<string, File> = {};
  logofile: File | null = null;
  businessTypes: any[] = [];
  statusList: any;
  b: any;
  searchTerm: string = '';
  items: any[] = [];
  businessID: any;
  superadmin_id: any;
  private baseUrl = constants.baseUrl;
  toastMessage: string | null = null;
  toastType: string | undefined;
  addressFields = [
    { name: 'house_No', label: 'House No' },
    { name: 'town_Name', label: 'Town Name' },
    { name: 'mandal_Name', label: 'Mandal' },
    { name: 'district_Name', label: 'District' },
    { name: 'state', label: 'State' },
    { name: 'pincode', label: 'Pincode' },
  ];
  selectedFilter: string = 'Active';
  filterMode: 'active' | 'inactive' | 'all' = 'active';
  loadingAccountId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: BillingService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const businesslist = localStorage.getItem('sa');
    if (businesslist) {
      const bid = JSON.parse(businesslist);
      this.businessID = bid._id;
      console.log('businessID:', this.businessID);
    }

    this.BusinessForm = this.fb.group({
      business_name: ['', [Validators.required, Validators.minLength(3)]],
      owner_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],

      registration_number: ['', [Validators.required, Validators.minLength(3)]],
      gst_number: ['', [Validators.required, Validators.minLength(3)]],
      bt_id: [''],
      password: [''],
     status: ['', [Validators.required]],
      logo_image: [''],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
      address: this.fb.group({
        house_No: [''],
        town_Name: [''],
        mandal_Name: [''],
        district_Name: [''],
        state: [''],
        pincode: [''],
      }),
    });
    const saData = JSON.parse(localStorage.getItem('sa') || '{}');
    this.superadmin_id = saData._id;
    console.log('Superadmin ID:', this.superadmin_id);

    this.loadBusinessTypes();

    this.loadBusiness();
  }
  sanitizeNameInput(event: any, controlName: string) {
    let value = event.target.value;

    value = value
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/^\s+/g, '')
      .replace(/\s{2,}/g, ' ');

    this.BusinessForm.get(controlName)?.setValue(value, {
      emitEvent: false,
    });
  }

  removeLongSpaces(event: any, controlName: string) {
    let value = event.target.value;

    value = value.replace(/^\s+/g, '').replace(/\s{2,}/g, ' ');

    this.BusinessForm.get(controlName)?.setValue(value, {
      emitEvent: false,
    });
  }

  AddressInput(event: any, fieldName: string) {
    let value = event.target.value;
    if (fieldName === 'pincode') {
      value = value.replace(/[^0-9]/g, '');
    } else if (fieldName === 'house_No') {
      value = value
        .replace(/[^a-zA-Z0-9\-\/ ]/g, '')
        .replace(/^\s+/g, '')
        .replace(/\s{2,}/g, ' ');
    } else {
      value = value
        .replace(/[^a-zA-Z ]/g, '')
        .replace(/^\s+/g, '')
        .replace(/\s{2,}/g, ' ');
    }

    this.BusinessForm.get('address')?.get(fieldName)?.setValue(value, {
      emitEvent: false,
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.BusinessForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  // loadBusiness() {
  //   this.api.getBusiness(this.businessID).subscribe({
  //     next: (res: any) => {
  //       this.business = res.data || [];

  //       this.business.sort(
  //         (a: any, b: any) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );

  //       console.log('Sorted business list:', this.business);
  //     },
  //     error: (err) => {
  //       console.error('Error loading business:', err);
  //     },
  //   });
  // }
loadBusiness() {
  this.api.getBusiness(this.businessID).subscribe({
    next: (res: any) => {
      this.business = (res.data || []).sort(
        (a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    },
    error: (err) => {
      console.error('Error loading business:', err);
    },
  });
}

  //  loadBusiness() {
  //   this.api.getBusiness(this.businessID).subscribe({
  //     next: (res: any) => {
  //       this.business = (res.data || []).map((b: any) => {
  //         const status = b.status?.toLowerCase();

  //         return {
  //           ...b,
  //           enable: status !== 'active',
  //           disable: status === 'active'
  //         };
  //       });

  //       this.business.sort(
  //         (a: any, b: any) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );
  //     },
  //     error: (err) => {
  //       console.error('Error loading business:', err);
  //     },
  //   });
  // }

  toggleAccountStatus(b: any) {
    const newStatus =
      b.status?.toLowerCase() === 'active' ? 'inactive' : 'active';

    this.api.updateBusiness(b._id, { status: newStatus }).subscribe({
      next: () => {
        b.status = newStatus;
        this.showToast(
          newStatus === 'active' ? 'Account enabled' : 'Account disabled',
          'success',
        );
      },
      error: () => {
        this.showToast('Failed to update account status', 'error');
      },
    });
  }

  toggleLoginStatus(b: any) {
    const newLogin =
      b.login_status?.toLowerCase() === 'active' ? 'inactive' : 'active';

    this.api
      .updateLoginStatus(b._id, {
        login_status: newLogin,
      })
      .subscribe(() => {
        b.login_status = newLogin;
      });
  }

  // toggleLoginStatus(b: any) {
  //   const newStatus = b.login_status === 'Active' ? 'Inactive' : 'Active';

  //   this.api.updateLoginStatus(b._id, newStatus).subscribe(() => {
  //     b.login_status = newStatus;
  //   });
  // }
  

  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl || 'assets/default-business.jpg';
    const modal = new bootstrap.Modal(
      document.getElementById('imagePreviewModal'),
    );
    modal.show();
  }

  changeFilter(value: string) {
    this.selectedFilter = value;

    switch (value) {
      case 'All':
        this.showall();
        break;
      case 'Active':
        this.showActive();
        break;
      case 'Inactive':
        this.showInactive();
        break;
    }
  }
  showActive() {
    this.filterMode = 'active';
  }

  showInactive() {
    this.filterMode = 'inactive';
  }
  showall() {
    this.filterMode = 'all';
  }

filteredBusiness() {
  let list = this.business;

  if (this.filterMode === 'active') {
    list = list.filter(
      (b) => b.status?.toLowerCase().trim() === 'active'
    );
  } else if (this.filterMode === 'inactive') {
    list = list.filter(
      (b) => b.status?.toLowerCase().trim() === 'inactive'
    );
  }

  if (this.searchTerm?.trim()) {
    const term = this.searchTerm.toLowerCase();
    list = list.filter((b) =>
      Object.values(b).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }

  return list;
}

  // filteredBusiness() {
  //   let list = this.business;

  //   if (this.filterMode === 'active') {
  //     list = list.filter((b) => b.login_status?.toLowerCase().trim() === 'active');
  //   } else if (this.filterMode === 'inactive') {
  //     list = list.filter((b) => b.login_status?.toLowerCase().trim() === 'inactive');
  //   }

  //   if (this.searchTerm?.trim()) {
  //     const term = this.searchTerm.toLowerCase();
  //     list = list.filter((b) =>
  //       Object.values(b).some((val) =>
  //         val?.toString().toLowerCase().includes(term)
  //       )
  //     );
  //   }

  //   return list;
  // }


  openViewModal(b: any) {
    this.selectedBusiness = { ...b };

    if (typeof b.bt_id === 'string') {
      const btObject = this.businessTypes.find((t: any) => t._id === b.bt_id);
      this.selectedBusiness.bt_id = btObject;
    }

    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  editBusiness(b: any) {
    console.log('Edit data:', b);
    this.s_id = b._id;
    const fullAddress =
      `${b.address.house_No}, ${b.address.town_Name}, ${b.address.mandal_Name}, ` +
      `${b.address.district_Name}, ${b.address.state} - ${b.address.pincode}`;

    this.BusinessForm.patchValue({
      business_name: b.business_name,
      owner_name: b.owner_name,
      email: b.email,
      phone_number: b.phone_number,
      password: '',
      bt_id: b.bt_id ? b.bt_id._id || b.bt_id : '',
      address: {
        house_No: b.address?.house_No || '',
        town_Name: b.address?.town_Name || '',
        mandal_Name: b.address?.mandal_Name || '',
        district_Name: b.address?.district_Name || '',
        state: b.address?.state || '',
        pincode: b.address?.pincode || '',
      },
      registration_number: b.registration_number,
      gst_number: b.gst_number,
      status: b.status || b.business_status || b.status?.status || '',
    });
    this.selectedBusiness = b;
    this.selectedFiles = {};
    if (this.logofile) {
      this.BusinessForm.get('logo_image')?.reset();
      this.BusinessForm.get('pan_pdf')?.reset();
      this.BusinessForm.get('aadhar_pdf')?.reset();
      this.BusinessForm.get('certificate_pdf')?.reset();
    }

    const modal = new bootstrap.Modal(
      document.getElementById('editBusinessModal'),
    );
    modal.show();
  }

  onFileSelect(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[controlName] = file;
      console.log('Selected file for', controlName, ':', file.name);
    }
  }

  loadBusinessTypes() {
    this.api.getBusinessTypes().subscribe({
      next: (res: any) => {
        this.businessTypes = res.data || [];
        console.log('Business Types:', this.businessTypes);
      },
      error: (err: any) => console.error('Error fetching business types:', err),
    });
  }

  getBusinessTypeName(id: string): string {
    const type = this.businessTypes.find((t) => t._id === id);
    return type ? type.business_type : '';
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/default-business.jpg';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.includes('business_images/')
      ? `${this.baseUrl}/${cleanPath}`
      : `${this.baseUrl}/business_images/${cleanPath}`;
  }

  getFileUrl(path: string): string {
    if (!path) return '#';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.includes('business_images/')
      ? `${this.baseUrl}/${cleanPath}`
      : `${this.baseUrl}/business_images/${cleanPath}`;
  }

  updateBusiness() {
    const formData = new FormData();

    const businessForm = this.BusinessForm.value;
    formData.append('business_name', businessForm.business_name || '');
    formData.append('owner_name', businessForm.owner_name || '');
    formData.append('email', businessForm.email || '');
    formData.append('phone_number', businessForm.phone_number || '');

    const btValue = businessForm.bt_id;
    formData.append(
      'bt_id',
      typeof btValue === 'object' ? btValue._id : btValue || '',
    );

    const addr = businessForm.address;
    let parsedAddress: any = {};

    for (const key in businessForm.address) {
      formData.append(`address[${key}]`, businessForm.address[key]);
    }
    formData.append(
      'registration_number',
      businessForm.registration_number || '',
    );
    formData.append('gst_number', businessForm.gst_number || '');
    formData.append('status', businessForm.status || '');

    if (businessForm.password) {
      formData.append('password', businessForm.password);
    }

    Object.keys(this.selectedFiles).forEach((key) => {
      formData.append(key, this.selectedFiles[key]);
    });

    console.log('Sending FormData:');
    formData.forEach((value, key) => console.log(key, value));

    this.api.updateBusiness(this.s_id, formData).subscribe({
      next: (res) => {
        this.showToast('Business updated successfully!', 'success');
        this.loadBusiness();
        this.closeModal('editBusinessModal');
      },
      error: (err) => {
        console.error('Update Error:', err);
        this.showToast('Update failed', 'Update Failed');
      },
    });
  }
  showToast(message: string, type: string = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  // updateBusiness() {
  //   const formData = new FormData();

  //   const businessForm = this.BusinessForm.value;
  //   formData.append("business_name", businessForm.business_name || "");
  //   formData.append("owner_name", businessForm.owner_name || "");
  //   formData.append("email", businessForm.email || "");
  //   formData.append("phone_number", businessForm.phone_number || "");

  //   const btValue = businessForm.bt_id;
  //   formData.append("bt_id", typeof btValue === "object" ? btValue._id : btValue || "");

  //   const addr = businessForm.address;
  //   let parsedAddress: any = {};

  //   if (typeof addr === "string") {
  //     const parts = addr.split(",");
  //     parsedAddress = {
  //       house_No: parts[0]?.trim() || "",
  //       town_Name: parts[1]?.trim() || "",
  //       mandal_Name: parts[2]?.trim() || "",
  //       district_Name: parts[3]?.trim() || "",
  //       state: parts[4]?.trim() || "",
  //       pincode: parts[5]?.trim() || ""
  //     };
  //   } else if (addr && typeof addr === "object") {
  //     parsedAddress = {
  //       house_No: addr.house_No || "",
  //       town_Name: addr.town_Name || "",
  //       mandal_Name: addr.mandal_Name || "",
  //       district_Name: addr.district_Name || "",
  //       state: addr.state || "",
  //       pincode: addr.pincode || ""
  //     };
  //   }

  //   formData.append("address", JSON.stringify(parsedAddress));

  //   formData.append("registration_number", businessForm.registration_number || "");
  //   formData.append("gst_number", businessForm.gst_number || "");
  //   formData.append("status", businessForm.status || "");

  //   if (businessForm.password) {
  //     formData.append("password", businessForm.password);
  //   }

  // const satoken = localStorage.getItem('sa_token');
  //   if (!satoken) {
  //     this.toastr.error("Superadmin token missing. Please login again.");
  //     return;
  //   }

  //   let superadmin_id = '';
  //   try {
  //     const token = JSON.parse(satoken);
  //     superadmin_id = token?.data?._id || token?._id;
  //   } catch (err) {
  //     console.error("Token parsing error:", err);
  //   }

  //   if (!superadmin_id) {
  //     this.toastr.error("Superadmin ID missing. Please login again.");
  //     return;
  //   }

  //   if (this.selectedFiles && Object.keys(this.selectedFiles).length) {
  //     Object.keys(this.selectedFiles).forEach((key) => {
  //       formData.append(key, this.selectedFiles[key]);
  //     });
  //   }

  //   console.log("Sending FormData:");
  //   formData.forEach((value, key) => console.log(key, value));
  //   console.log("superadmin_id:", superadmin_id);

  //   this.api.updateBusiness(this.s_id, formData).subscribe({
  //     next: (res) => {
  //       this.toastr.success("Business updated successfully!");
  //       this.loadBusiness();
  //       this.closeModal("editBusinessModal");
  //     },
  //     error: (err) => {
  //       console.error("Update Error:", err);
  //       this.toastr.error("Update failed");
  //     }
  //   });
  // }

  // filteredBusiness() {
  //     if (!this.searchTerm) return this.business;
  //     const term = this.searchTerm.toLowerCase();
  //     return this.business.filter((b) =>
  //       Object.values(b).some((val) =>
  //         val?.toString().toLowerCase().includes(term)
  //       )
  //     );
  //   }

  onCustomFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[field] = file;
    }
  }

  openDeleteModal(id: string) {
    this.deleteId = id;
    const modalEl = document.getElementById('deleteBusinessModal');
    if (modalEl) {
      let modal = bootstrap.Modal.getInstance(modalEl);
      if (!modal) modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  changeStatus(id: string, status: string) {
    this.api.updateBusiness(id, { status }).subscribe({
      next: () => {
        this.showToast(
          status === 'active'
            ? 'Business Active successfully'
            : 'Business Inactive successfully',
          'success',
        );
        this.loadBusiness(); // refresh list
      },
      error: (err) => {
        console.error(err);
        this.showToast('Status update failed', 'error');
      },
    });
  }

  deleteBusiness(id?: string | null) {
    if (!id) return;

    this.api.deletebusiness(id).subscribe({
      next: (res: any) => {
        console.log('Business deleted:', res);

        this.loadBusiness();

        this.closeModal('deleteBusinessModal');

        this.showToast('Business Type deleted successfully', 'success');

        setTimeout(() => {
          this.toastMessage = null;
        }, 3000);
      },

      error: (err) => {
        console.error('Error deleting business:', err);

        this.showToast('Failed to delete business type', 'error');

        setTimeout(() => {
          this.toastMessage = null;
        }, 3000);
      },
    });
  }

  closeModal(id: string) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }
  allowOnlyLetters(event: KeyboardEvent) {
    if (!/^[A-Za-z]$/.test(event.key)) event.preventDefault();
  }
  preventSpace(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  }
}
