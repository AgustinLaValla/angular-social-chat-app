import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { UiService } from 'src/app/services/ui.service';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setErrorStyle();
  };

  initForm() {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))]],
      confirmPassword: ['', [Validators.required]]
    });
    this.passwordForm.get('confirmPassword').setValidators(this.validate.bind(this))
  };


  validate(control: AbstractControl): { [key: string]: boolean } {
    return control.value !== this.passwordForm.get('newPassword').value
      ? { doesNotMatch: true } : null;
  };


  setErrorStyle() {
    const input = document.getElementById('confirm-password');
    this.passwordForm.valueChanges.pipe(
      map(() => {
        if (this.passwordForm.errors) {
          input.className = 'invalid';
        } else {
          input.className = 'validate';
        };
      })
    ).subscribe();
  };

  changePassword() {
    this.userService.changePassword(this.passwordForm.value).pipe(
      tap({
        next: () => (
          this.passwordForm.reset(),
          this.passwordForm.updateValueAndValidity()
        )
      }),
      catchError(error => of(this.uiService.errorHandler(error)))
    ).subscribe();
  };

};
