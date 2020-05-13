import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, 
              private uiService: UiService,
              private router:Router) { }

  ngOnInit(): void { }

  signIn(f: NgForm) {
    this.uiService.loadingSubjet.next(true);

    this.authService.signIn(f.value).subscribe((resp) => {
      
      this.uiService.loadingSubjet.next(false);

      this.router.navigate(['/streams']);

    } , error => {

      console.log(error);

      this.uiService.errorHandler(error);

      this.uiService.loadingSubjet.next(false);

    });
  };

};
