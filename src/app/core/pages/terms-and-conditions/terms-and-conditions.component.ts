import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrentUserService } from '../../services/current-user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  public form: FormGroup;

  constructor(public currentUser: CurrentUserService,
              private router: Router) {

    this.form = new FormGroup({
      agreed: new FormControl(false, [Validators.required])
    });
  }

  ngOnInit() {
  }

  public submitAgreement(value) {
    if (value.agreed) {
      this.currentUser.acceptTerms()
        .subscribe({
          next: () => console.log(`You just typed `),
          error: error => console.log(`Oops... ${error}`),
          complete: () => this.router.navigate(['/registration'])
        });
    }
  }
}
