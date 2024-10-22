import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as config from '../../../../config.json';
import { TokenResponse } from '../models/tokenResponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  // private client: JwksClient = new JwksClient({
  //   jwksUri: config.jwks_uri,
  // });

  getAuthorizationUri(state: string, code_verifier: string): string {
    const parameters = {
      client_id: 'test',
      scope: 'openid email phone address profile',
      response_type: 'code',
      redirect_uri: 'http://localhost:4200/callback',
      prompt: 'login',
      state: state,
      code_challenge_method: 'plain',
      code_challenge: code_verifier,
    };

    const authorizationUri = `${config.authorization_endpoint}?${new URLSearchParams(parameters)}`;

    return authorizationUri;
  }

  generateRandomString(length: number = 128): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  async getToken(code: string, code_verifier: string): Promise<TokenResponse> {
    const parameters = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:4200/callback',
      code_verifier: code_verifier,
      client_id: 'test',
      client_secret: 'OBV4AbThgbgGWLQVv4rIvgZoVwRkoaGv',
    };

    const response = await fetch(config.token_endpoint, {
      method: 'POST',
      body: new URLSearchParams(parameters),
    });

    const payload = await response.json();
    return payload as TokenResponse;
  }

  // getKey(header: any, callback: any) {
  //   this.client.getSigningKey(header.kid, function (err, key: any) {
  //     const signingKey = key.publicKey || key.rsaPublicKey;
  //     callback(null, signingKey);
  //   });
  // }

  getUserInfo(accessToken: string) {
    return this.http.get(config.userinfo_endpoint, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
  }
}
