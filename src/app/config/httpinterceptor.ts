import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AppComponent } from "../app.component";

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router, private app: AppComponent) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newRequest = req.clone({
      setHeaders: {
        Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
      }
    });
    return next.handle(newRequest).pipe(tap(n => {
      console.log("Request Modified");
    },
    err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 500) {
          this.app.showMessage(
            typeof err.error.data === "string" ? err.error.data : JSON.stringify(err.error.data),
            "danger"
          );
        }

        if (err.status === 401) {
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            this.router.navigateByUrl("/");
            window.location.reload();
          }, 1000);
        }
        // console.log(err.error.data);
      }
    }));
  }
}
