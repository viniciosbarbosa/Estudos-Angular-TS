import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { enviroments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private API_URL = enviroments.API_URL

constructor(private http: HttpClient) { }

  signUpUser(requestDatas:SignupUserRequest):Observable<SignupUserResponse>{
    return this.http.post<SignupUserResponse>(
      `${this.API_URL}/user` , requestDatas
    )
  }

  authUser(requestDatas:AuthRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.API_URL}/auth` , requestDatas)
  }


}
