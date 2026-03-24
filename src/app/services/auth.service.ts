import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  cart: any[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get currently logged-in user from localStorage
   */
  private getCurrentUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  /**
   * Login user with username and password
   * Fetches user from backend and stores in localStorage
   */
  login(request: LoginRequest): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${request.username}&password=${request.password}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            const user = users[0];
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
          }
          throw new Error('Invalid credentials');
        }),
        catchError(error => {
          return throwError(() => new Error('Invalid username or password'));
        })
      );
  }

  /**
   * Register a new user
   * Posts new user to backend and auto-logs them in
   */
  signup(request: SignupRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, {
      ...request,
      cart: []
    })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          return throwError(() => new Error('Failed to create account. Username may already exist.'));
        })
      );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Get current logged-in user synchronously
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Update the current user (used by CartService when syncing)
   */
  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }
}
