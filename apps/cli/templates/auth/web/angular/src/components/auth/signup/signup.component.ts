import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { injectForm, injectStore, TanStackField } from '@tanstack/angular-form';
import { AuthService } from '../../../services/auth.service';
import { z } from 'zod';

@Component({
 selector: 'app-signup',
 standalone: true,
 imports: [CommonModule, FormsModule, RouterLink, TanStackField],
 templateUrl : './signup.component.html'
})
export class SignupComponent {
 #router = inject(Router);
 private authService = inject(AuthService);
 signUpSchema = z
 .object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
 });
 signUpForm = injectForm({
  defaultValues: {
   email: "",
   password: "",
   name: "",
  } as z.infer<typeof this.signUpSchema>,
  validators: {
   onChange: this.signUpSchema,
  },
  onSubmit: async ({value}) => {
   this.authService.signUp(value.email, value.password);
  },
 });
 canSubmit = injectStore(this.signUpForm, (state) => state.canSubmit);
 isSubmitting = injectStore(this.signUpForm, (state) => state.isSubmitting);
}
