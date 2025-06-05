import type { Route } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AIChatComponent } from '../components/ai-chat/ai-chat.component';
import { LoginComponent } from '../components/auth/login/login.component';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { SignupComponent } from '../components/auth/signup/signup.component';
import { authGuard } from '../guards/auth.guard';


export const routes: Route[] = [
   { path: '', component: HomeComponent },
   { path: 'login', component: LoginComponent },
   { path: 'signup', component: SignupComponent },
   { path: 'todos', component: TodoListComponent },
   {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
   },
   { path: 'ai-chat', component: AIChatComponent }
];
