import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private userService:UsersService, private uiService:UiService) { }

  ngOnInit(): void {
    this.initForm();
    this.setErrorStyle();
  };

  initForm() {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.validate.bind(this) });
  };


  validate(passFormGroup: FormGroup) {
    const new_password = passFormGroup.controls.newPassword.value;
    const confirm_password = passFormGroup.controls.confirmPassword.value;

    if (confirm_password && confirm_password.length <= 0) return null;

    if (new_password !== confirm_password) {
      return {
        doesNotMatch: true
      };
    };

    return null;
  };

  setErrorStyle() {
    const input = document.getElementById('confirm-password');
    this.passwordForm.valueChanges.subscribe(() => {
      if(this.passwordForm.errors) { 
        input.className = 'invalid';
      } else { 
        input.className = 'validate';
      };
    });
  };

  changePassword() { 
    this.userService.changePassword(this.passwordForm.value).subscribe((resp) => {
      this.passwordForm.reset();
      this.passwordForm.updateValueAndValidity();
      console.log(this.passwordForm.valid);
    } , error => this.uiService.errorHandler(error)) ;
  };

};
