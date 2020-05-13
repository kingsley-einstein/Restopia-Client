import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AppComponent } from "../app.component";

@Injectable()
export class Activatable implements CanActivate {
  constructor(private router: Router, private app: AppComponent) {}
  canActivate(): boolean {
    if (!localStorage.getItem("token")) {
      this.app.showMessage("Only logged in users can access this page.", "warning");
      setTimeout(() => {
        this.router.navigateByUrl("/");
      }, 1000);
      return false;
    }
    return true;
  }
}


