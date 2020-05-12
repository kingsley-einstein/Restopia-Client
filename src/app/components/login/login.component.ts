import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ClrLoadingState } from "@clr/angular";
import { AuthService } from "../../services";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  fg: FormGroup;

  email: FormControl = new FormControl("", [
    Validators.email, Validators.required
  ]);
  password: FormControl = new FormControl("", [
    Validators.required
  ]);

  user: any = {};

  loading: ClrLoadingState = ClrLoadingState.DEFAULT;

  error: string = "";

  constructor(fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.fg = fb.group({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit() {
    console.log("[Login]");
  }

  logUserIn($event) {
    $event.preventDefault();
    this.error = "";
    this.loading = ClrLoadingState.LOADING;
    this.auth.logUserIn(this.fg.value).subscribe((res) => {
      if (res.data._id) {
        const { _id, email, token } = res.data;
        this.user = { _id, email, token };
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", token);
        this.loading = ClrLoadingState.SUCCESS;
      }
      if (res.code >= 400) {
        this.error = res.data;
      }
    },
    err => {
      this.error = err.error.data;
      this.loading = ClrLoadingState.ERROR;
      setTimeout(() => {
        this.error = "";
      }, 2000);
    },
    () => {
      this.router.navigateByUrl("/");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
}
