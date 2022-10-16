import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  passType: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signupForm: FormGroup;
  error: string = null;

  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private toster: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formbuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.signupForm.reset();
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.passType = 'text') : (this.passType = 'password');
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    if (this.signupForm.valid) {
      // console.log(this.signupForm.value);
      this.userService
        .registerUser([
          this.signupForm.value.username,
          this.signupForm.value.email,
          this.signupForm.value.mobile,
          this.signupForm.value.password,
        ])
        .subscribe(
          (res) => {
            console.log(res);
            // this.router.navigate(['/login']);
          },
          (errorRes) => {
            console.log(errorRes);
            this.error = errorRes.error;
          }
        );
      this.signupForm.reset();
    } else {
      this.validateAllFormsFields(this.signupForm);
      this.toster.error(this.signupForm.errors[0]);
      // alert("your form is invalid");
    }
  }

  private validateAllFormsFields(fromGroup: FormGroup) {
    Object.keys(fromGroup.controls).forEach((fields) => {
      const control = fromGroup.get(fields);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormsFields(control);
      }
    });
  }
}
