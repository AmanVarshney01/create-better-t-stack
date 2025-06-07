import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { injectForm, injectStore, TanStackField } from '@tanstack/angular-form';
import { z } from 'zod';

@Component({
 selector: 'app-login',
 standalone: true,
 imports: [CommonModule, FormsModule, RouterLink, TanStackField],
 templateUrl: './login.component.html',
})
export class LoginComponent {
 email = '';
 password = '';
 private authService = inject(AuthService);
 loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
 });
 logInForm = injectForm({
  defaultValues: {
   email: "",
   password: "",
   rememberMe: false,
  } as z.infer<typeof this.loginSchema>,
  validators: {
   onChange: this.loginSchema,
  },
  onSubmit: async ({value}) => {
   this.authService.login(value.email, value.password);
  },
 });
 canSubmit = injectStore(this.logInForm, (state) => state.canSubmit);
 isSubmitting = injectStore(this.logInForm, (state) => state.isSubmitting);
}
