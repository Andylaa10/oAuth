import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private _authService: AuthService = inject(AuthService);
  @HostBinding('class') className: string = 'dark';

  redirect() {
    const state = this._authService.generateRandomString();
    const code = this._authService.generateRandomString();
    localStorage.setItem(state, code);

    document.location.href = this._authService.getAuthorizationUri(state, code);
  }
}
