import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { BackendUrl } from '../../backendurl';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

interface AdminLoginRequest {
  email: string;
  password: string;
  pattern: string;
}

interface AdminLoginResponse {
  success: boolean;
  token?: string;
  admin?: any;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminauthService {
  private isAuthSubject = new BehaviorSubject<boolean>(false);
  public isAuth$ = this.isAuthSubject.asObservable();

  redirectUrl = BackendUrl;
  private readonly TOKEN_KEY = 'bullana_admin_token';
  private readonly ADMIN_KEY = 'bullana_admin_data';

  constructor(
    private http: HttpClient,
    private dataService: ConnectionService,
    private jwtHelper: JwtHelperService
  ) {
    // Check if admin is already authenticated on service initialization
    this.checkAuthStatus();
  }

  /**
   * Modern admin login with JWT
   */
  login(credentials: AdminLoginRequest): Observable<AdminLoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'cache-control': 'no-cache'
    });

    return this.http.post<AdminLoginResponse>(
      `${this.redirectUrl}admin/auth/login`,
      credentials,
      { headers }
    );
  }

  /**
   * Set authentication session
   */
  setSession(token: string, adminData?: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (adminData) {
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(adminData));
    }
    this.isAuthSubject.next(true);

    // Legacy support - keep old Key for backward compatibility
    localStorage.setItem('Key', token);
  }

  /**
   * Get stored token
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || localStorage.getItem('Key');
  }

  /**
   * Get stored admin data
   */
  getAdminData(): any | null {
    const adminData = localStorage.getItem(this.ADMIN_KEY);
    return adminData ? JSON.parse(adminData) : null;
  }

  /**
   * Check if admin is authenticated
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  /**
   * Check authentication status and update subject
   */
  private checkAuthStatus(): void {
    this.isAuthSubject.next(this.isAuthenticated());
  }

  /**
   * Logout admin
   */
  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'cache-control': 'no-cache'
    });

    return this.http.post(`${this.redirectUrl}admin/auth/logout`, {}, { headers });
  }

  /**
   * Clear session data
   */
  deleteToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_KEY);
    localStorage.removeItem('Key'); // Legacy cleanup
    this.isAuthSubject.next(false);
  }

  /**
   * Validate current token
   */
  validateToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'cache-control': 'no-cache'
    });

    return this.http.get(`${this.redirectUrl}admin/auth/validate`, { headers });
  }

  /**
   * Get admin profile
   */
  getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'cache-control': 'no-cache'
    });

    return this.http.get(`${this.redirectUrl}admin/auth/profile`, { headers });
  }

  /**
   * Legacy method for backward compatibility
   */
  loggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Check white IP (keeping for backward compatibility)
   */
  checkWhite(): Observable<any> {
    const headers = new HttpHeaders().set('cache-control', 'no-cache');
    return this.http.get(this.redirectUrl + 'home/checkWhiteIp', { headers: headers });
  }
}
