import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';
import { ForgotPassComponent } from './user/forgot-pass/forgot-pass.component';
import { UserPanelComponent } from './user/user-panel/user-panel.component';
import '../polyfills';
import { HeaderComponent } from './user/header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './user/auth/auth.service';
import { AuthComponent } from './user/auth/auth.component';
import { DbSettingsComponent } from './dbsettings/dbsettings.component';

//TestUI
import { UserComponent } from './testUI/user.component';

const appRoutes: Routes = [
  { path: 'login', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'user-panel', component: UserPanelComponent, canActivate: [AuthService]},
  { path: 'auth', component: AuthComponent },
  { path: 'dbsettings', component: DbSettingsComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthService]},
  { path: '', pathMatch: 'full', component: SigninComponent},
  { path: '**', component: SigninComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    ForgotPassComponent,
    UserPanelComponent,
    HeaderComponent,
    AuthComponent,
    DbSettingsComponent,
    UserComponent
  ],
  imports: [
    RouterModule.forRoot (appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    FormsModule,
    BrowserModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
