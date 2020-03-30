import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from "@angular/forms";

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

  constructor(fb: FormBuilder) {
    this.fg = fb.group({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
  }

  ngOnInit() {
    console.log("[Registration]");
  }
}

const ComparePassword = (p: AbstractControl): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any; } => {
    const match = p.value === control.value;
    return !match ? { nomatch: true } : null;
  };
};
