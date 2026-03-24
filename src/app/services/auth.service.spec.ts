import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully with valid credentials', (done) => {
    const mockUser = { id: 1, username: 'test', password: 'test123', email: 'test@test.com', firstName: 'Test', lastName: 'User', cart: [] };

    service.login({ username: 'test', password: 'test123' }).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.isLoggedIn()).toBe(true);
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/users?username=test&password=test123');
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should fail login with invalid credentials', (done) => {
    service.login({ username: 'invalid', password: 'invalid' }).subscribe(
      () => {},
      error => {
        expect(error.message).toContain('Invalid username or password');
        done();
      }
    );

    const req = httpMock.expectOne('http://localhost:3000/users?username=invalid&password=invalid');
    req.flush([]);
  });

  it('should signup successfully', (done) => {
    const newUser = { id: 4, username: 'newuser', password: 'NewPass123', email: 'new@test.com', firstName: 'New', lastName: 'User', cart: [] };

    service.signup({
      username: 'newuser',
      password: 'NewPass123',
      email: 'new@test.com',
      firstName: 'New',
      lastName: 'User'
    }).subscribe(user => {
      expect(user).toEqual(newUser);
      expect(service.isLoggedIn()).toBe(true);
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    req.flush(newUser);
  });

  it('should logout successfully', () => {
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });
});
