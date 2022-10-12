import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface UsersData {
  id: string,
  username: string,
  email: string,
  mobile: string,
};

export interface UserData {
  data: UsersData;
  success:boolean;
  messagr:string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  displayedColumn: string[] = ['id',  'username', 'email', 'mobile'];
  dataSource!: MatTableDataSource<UserData>;
  posts: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchText: any;
  userName: string = 'User';
  closeResult: string;
  signupForm: FormGroup;
  page = 1;             //the initial page to display
  collectionSize = 250  //total number of countries in the list
  pageSize = 25;  
  users: any[];
  
  constructor(private userService: UserService, private dialog: MatDialog, private modalService: NgbModal,private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getUserData();
    this.signupForm = this.formbuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.signupForm.reset()
  }
  
  getUserData() {
    return this.userService.getData().subscribe(data => {
      console.log(data);
      this.posts = data;
      this.userName = localStorage.getItem('username').toUpperCase();
      console.log(this.posts)
      localStorage.setItem('userList', JSON.stringify(data));

      this.dataSource = new MatTableDataSource(this.posts)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  refreshCountries(){
    this.users = JSON.parse(localStorage.getItem('userList'))
    .map((user, i) => ({id: i + 1, ...user}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openDialog(){
    this.dialog.open(SignupComponent)
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      // console.log(this.signupForm.value);
      this.userService.registerUser([
        this.signupForm.value.username,
        this.signupForm.value.email,
        this.signupForm.value.mobile,
        this.signupForm.value.password])
      .subscribe(res => {
        console.log(res);
        ModalDismissReasons;
      });
      this.signupForm.reset();
    } else {
      this.validateAllFormsFields(this.signupForm);
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
