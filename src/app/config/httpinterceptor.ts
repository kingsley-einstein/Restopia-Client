import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
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
        console.log(err.error.data);
      }
    }));
  }
}
