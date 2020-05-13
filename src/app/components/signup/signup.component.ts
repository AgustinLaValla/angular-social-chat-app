import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signUpForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private uiService: UiService) { }

  ngOnInit(): void {
    this.initForm();
  };

  initForm() {
    this.signUpForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  };

  signup() {
    this.uiService.loadingSubjet.next(true);

    this.authService.signUp(this.signUpForm.value).subscribe(resp => {

      this.signUpForm.reset();

      this.uiService.loadingSubjet.next(false);

      this.router.navigate(['/streams']);
      
    }, error => {

        this.uiService.errorHandler(error);
        
        this.uiService.loadingSubjet.next(false);

    });
  };

};
