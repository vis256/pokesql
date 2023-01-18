import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ValidationCallbackData } from 'devextreme/ui/validation_rules';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services';


@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent {
  loading = false;
  formData: any = {
    is_professor: false
  };

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit(e: Event) {
    e.preventDefault();
    const { login, password, username, is_professor } = this.formData;
    this.loading = true;

    await this.authService.createAccount(login, password, username, is_professor, (result : any) => {
      this.loading = false;
      if (result.isOk) {
        this.router.navigate(['/login-form']);
      } else {
      }
    });
  }

  confirmPassword = (e: ValidationCallbackData) => {
    return e.value === this.formData.password;
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule
  ],
  declarations: [ CreateAccountFormComponent ],
  exports: [ CreateAccountFormComponent ]
})
export class CreateAccountFormModule { }
