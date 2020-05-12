import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from "@angular/forms";
import { Router } from "@angular/router";
import { ClrLoadingState } from "@clr/angular";
import { HttpService } from "../../services";

@Component({
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
  selector: "app-registration"
})
export class RegistrationComponent implements OnInit {
  fg: FormGroup;

  email: FormControl = new FormControl("", [
    Validators.required, Validators.email
  ]);
  password: FormControl = new FormControl("", [Validators.required]);
  confirmPassword: FormControl = new FormControl("", [
    Validators.required, ComparePassword(this.password)
  ]);

  loading: ClrLoadingState = ClrLoadingState.DEFAULT;
  error: string = "";

  constructor(fb: FormBuilder, private http: HttpService, private router: Router) {
    this.fg = fb.group({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
  }

  ngOnInit() {
    console.log("[Registration]");
  }

  createUser($event) {
    $event.preventDefault();
    this.loading = ClrLoadingState.LOADING;
    const { email, password } = this.fg.value;
    const newUser = { email, password };
    this.http.createUser(newUser).subscribe((res) => {
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        this.loading = ClrLoadingState.SUCCESS;
        this.router.navigateByUrl("/main/client");
        window.location.reload();
      }
      if (res.code >= 400) {
        this.error = res.data;
        this.loading = ClrLoadingState.ERROR;
      }
    },
    err => {
      this.error = err.error.data;
      this.loading = ClrLoadingState.ERROR;
    });
  }
}

const ComparePassword = (p: AbstractControl): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any; } => {
    const match = p.value === control.value;
    return !match ? { nomatch: true } : null;
  };
};
