import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  passType: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm: FormGroup;
  userName:string;
  error: string = null; 

  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private toster: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.loginForm.reset();
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.passType = 'text') : (this.passType = 'password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userName = this.loginForm.value.username;
      // console.log(this.loginForm.value);
      this.userService.loginUser([
        this.loginForm.value.username,
        this.loginForm.value.password,
      ])
      .subscribe(res => {
        console.log(res);
       
        if(res == "logedin"){
          console.log(this.userName);
          
          localStorage.setItem("username", this.userName);
          this.router.navigate(['/dashboard']);
          this.loginForm.reset();
        }
        
      },
      (errorRes) => {
        console.log(errorRes);
        this.error = errorRes.error;
      });
      
      // this.toster.success('User registerd successful');
      
      
    } else {
      this.validateAllFormsFields(this.loginForm);
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
