import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
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
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.signupForm.get('firstName')?.value).toBe('');
    expect(component.signupForm.get('lastName')?.value).toBe('');
    expect(component.signupForm.get('username')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate password strength', () => {
    const passwordControl = component.signupForm.get('password');
    passwordControl?.setValue('weak');
    expect(passwordControl?.hasError('passwordStrength')).toBe(true);

    passwordControl?.setValue('Strong123');
    expect(passwordControl?.hasError('passwordStrength')).toBe(false);
  });

  it('should validate password match', () => {
    component.signupForm.get('password')?.setValue('Strong123');
    component.signupForm.get('confirmPassword')?.setValue('Different123');
    component.signupForm.updateValueAndValidity();

    expect(component.signupForm.hasError('passwordMismatch')).toBe(true);
  });

  it('should disable submit button when form is invalid', () => {
    expect(component.signupForm.invalid).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    component.signupForm.get('firstName')?.setValue('John');
    component.signupForm.get('lastName')?.setValue('Doe');
    component.signupForm.get('username')?.setValue('johndoe');
    component.signupForm.get('email')?.setValue('john@example.com');
    component.signupForm.get('password')?.setValue('Strong123');
    component.signupForm.get('confirmPassword')?.setValue('Strong123');
    component.signupForm.updateValueAndValidity();

    expect(component.signupForm.valid).toBe(true);
  });

  it('should call authService.signup on form submit', () => {
    authService.signup.and.returnValue(of({} as any));
    component.signupForm.get('firstName')?.setValue('John');
    component.signupForm.get('lastName')?.setValue('Doe');
    component.signupForm.get('username')?.setValue('johndoe');
    component.signupForm.get('email')?.setValue('john@example.com');
    component.signupForm.get('password')?.setValue('Strong123');
    component.signupForm.get('confirmPassword')?.setValue('Strong123');
    component.signupForm.updateValueAndValidity();
    component.onSubmit();

    expect(authService.signup).toHaveBeenCalled();
  });

  it('should display error message on signup failure', (done) => {
    authService.signup.and.returnValue(throwError(() => new Error('Username already exists')));
    component.signupForm.get('firstName')?.setValue('John');
    component.signupForm.get('lastName')?.setValue('Doe');
    component.signupForm.get('username')?.setValue('johndoe');
    component.signupForm.get('email')?.setValue('john@example.com');
    component.signupForm.get('password')?.setValue('Strong123');
    component.signupForm.get('confirmPassword')?.setValue('Strong123');
    component.signupForm.updateValueAndValidity();
    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage).toContain('Username already exists');
      done();
    }, 100);
  });
});
