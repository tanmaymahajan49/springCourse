import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selectedUserType: string = 'customer';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Watch for user type changes to update form validation
    this.registerForm.get('userType')?.valueChanges.subscribe(() => {
      this.updateFormValidation();
    });
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      city: [''],
      experience: ['']
    });
  }

  updateFormValidation(): void {
    const cityControl = this.registerForm.get('city');
    const experienceControl = this.registerForm.get('experience');

    if (this.selectedUserType === 'washer') {
      cityControl?.setValidators([Validators.required]);
      experienceControl?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      cityControl?.clearValidators();
      experienceControl?.clearValidators();
    }

    cityControl?.updateValueAndValidity();
    experienceControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const formData = {
        ...this.registerForm.value,
        userType: this.selectedUserType
      };

      console.log('Registration data:', formData);

      // Simulate registration process
      setTimeout(() => {
        this.isLoading = false;

        // Navigate to login after successful registration
        this.router.navigate(['/login']);
      }, 2000);
    }
  }
}
