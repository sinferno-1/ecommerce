import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should disable submit button when form is invalid', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should call authService.login on form submit', () => {
    authService.login.and.returnValue(of({} as any));
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });

  it('should display error message on login failure', (done) => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage).toContain('Invalid credentials');
      done();
    }, 100);
  });
});
