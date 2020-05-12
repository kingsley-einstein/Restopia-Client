import { Injectable } from "@angular/core";
import { HttpService } from "../http/http.service";

@Injectable()
export class AuthService {
  public user: any = {};
  public error: string = "";
  constructor(private http: HttpService) {}

  authenticate() {
    this.http.getAuthenticatedUser().subscribe((res) => {
      if (res.code === 200) {
        const { _id, email, token } = res.data;
        this.user = { _id, email, token };
        // console.log(this.user);
        localStorage.setItem("user", JSON.stringify(this.user));
      }

      if (res.code >= 400) {
        this.error = res.data;
      }
    },
    err => {
      this.error = err.error.data;
      localStorage.setItem("auth_error", this.error);
    });
    if (localStorage.getItem("auth_error")) {
      this.error = localStorage.getItem("auth_error");
      localStorage.removeItem("auth_error");
    }
    // console.log(this.user);
  }

  getLoggedUser() {
    // console.log(this.user);
    return JSON.parse(localStorage.getItem("user"));
  }

  logUserIn(auth: any) {
    return this.http.logUserIn({ email: auth.email, password: auth.password });
    // if (localStorage.getItem("auth_error")) {
    //   this.error = localStorage.getItem("auth_error");
    //   localStorage.removeItem("auth_error");
    // }
  }

  logUserOut() {
    this.http.logUserOut().subscribe((res) => {
      if (typeof res.data === "string" || res.code === 200) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    });
  }

  getError() {
    return this.error;
  }
}
