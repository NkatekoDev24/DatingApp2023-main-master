import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { user } from'../_models/user';
import { PresenceService } from './presence.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private CurrentUserSource = new BehaviorSubject<user | null>(null);
  currentUser$ = this.CurrentUserSource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model: any){
    return this.http.post<user>(this.baseUrl + 'account/login', model).pipe(
      map((response: user) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        };
      })
    )
  }

  register(model: any){
    return this.http.post<user>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: user){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.CurrentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.CurrentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
