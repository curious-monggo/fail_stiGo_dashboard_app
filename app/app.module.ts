
import { AngularFireDatabase } from 'angularfire2/database';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



//components
import { AppComponent } from './app.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { ProgramsPageComponent } from './pages/programs-page/programs-page.component';
import { ProgramsCardComponent } from './components/programs-card/programs-card.component';

//Routes
import { RouterModule, Routes} from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

//angularFire
import { environment } from './../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';


//services
import { AuthService } from './services/auth-service/auth.service';


//Form
import { FormsModule } from '@angular/forms';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { UsersItemComponent } from './components/users-item/users-item.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';


import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';

import { FullCalendarModule } from 'ng-fullcalendar';
import { StudentsItemComponent } from './components/students-item/students-item.component';
import { StudentsPageComponent } from './pages/students-page/students-page.component';
import { AttendancePageComponent } from './pages/attendance-page/attendance-page.component';


  const appRoutes: Routes = [
    {
      path:'',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginPageComponent
    },
    {
      path: 'news',
      component: NewsPageComponent
    },
    {
      path: 'events',
      component: EventsPageComponent
    },
    {
      path: 'programs',
      component: ProgramsPageComponent
    },
    {
      path: 'users',
      component: UsersPageComponent
    },
    {
      path: 'students',
      component: StudentsPageComponent
    },
    {
      path: 'attendance/:id',
      component: AttendancePageComponent
    },
    {
      path: '**',
      component: PageNotFoundComponent,
      pathMatch: 'full'
    }
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    NewsPageComponent,
    NavbarComponent,
    NewsCardComponent,
    ProgramsPageComponent,
    ProgramsCardComponent,
    UserPageComponent,
    UsersPageComponent,
    UsersItemComponent,
    EventsPageComponent,
    EventCalendarComponent,
    StudentsItemComponent,
    StudentsPageComponent,
    AttendancePageComponent,    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    FullCalendarModule
  ],
  providers: [AuthService, AngularFireDatabase, NewsCardComponent, ProgramsCardComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
