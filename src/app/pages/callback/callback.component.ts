import {
  Component,
  HostBinding,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatButton } from '@angular/material/button';
import { TokenResponse } from '../../core/models/tokenResponse.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [MatButton, JsonPipe],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  @HostBinding('class') className: string = 'dark';

  private _authService: AuthService = inject(AuthService);
  private _router: ActivatedRoute = inject(ActivatedRoute);
  token$: WritableSignal<TokenResponse | undefined> = signal(undefined);

  ngOnInit() {
    this._router.queryParams.subscribe(async params => {
      console.log(params);
      await this.getToken(params);
    });
  }

  async getToken(params: Params) {
    const code_verifier = localStorage.getItem(params['state'])!;
    console.log(code_verifier);
    const token = await this._authService.getToken(
      params['code'],
      code_verifier
    );
    console.log(token);

    if (token) {
      this.token$.set(token);
      this._authService.getUserInfo(token.access_token).subscribe(user => {
        console.log(user);
      });
    }
  }
}
