import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../services/auth.service';


describe('Login', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
      'isAuthenticated'
    ]);
    authServiceSpy.isAuthenticated.and.returnValue(false);

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when fields are empty', () => {
    component.email = '';
    component.password = '';

    component.login();

    expect(component.errorMessage).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should call login and navigate on success', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of({
      tokenType: 'Bearer',
      accessToken: 'access-token',
      expiresIn: 3600,
      refreshToken: 'refresh-token'
    }));

    component.email = ' user@example.com ';
    component.password = 'secret';

    component.login();

    expect(component.isLoading).toBeTrue();
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret'
    });

    tick(1000);

    expect(component.isLoading).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('should set error message on login failure', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.email = 'user@example.com';
    component.password = 'secret';

    component.login();

    expect(component.errorMessage).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });
});
