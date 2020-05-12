import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services";

@Component({
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
  selector: "app-main"
})
export class MainComponent implements OnInit {

  user: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    console.log("[MainComponent]");
    this.authenticate();
    this.getAuthenticatedUser();
  }

  authenticate() {
    if (localStorage.getItem("token")) {
      this.auth.authenticate();
    }
  }

  getAuthenticatedUser() {
    if (localStorage.getItem("user")) {
      this.user = this.auth.getLoggedUser();
    }
  }

  logOut() {
    if (localStorage.getItem("user")) {
      this.auth.logUserOut();
      this.router.navigateByUrl("/");
      window.location.reload();
    }
  }
}
