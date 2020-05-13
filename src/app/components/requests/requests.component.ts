import { Component, OnInit } from "@angular/core";
import { HttpService } from "../../services";
import { APIRequestModel } from "../../api/models";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.css"]
})
export class RequestsComponent implements OnInit {
  requests: APIRequestModel[] = [];
  loading: boolean = false;

  showModal: boolean = false;

  request: APIRequestModel = null;

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.getRequests();
  }

  getRequests() {
    this.loading = true;
    this.http.getAllRequests().subscribe((res) => {
      this.requests = res.data;
      this.loading = false;
    },
    err => {
      this.loading = false;
      console.log(err.error);
    });
  }

  deleteRequest({ _id }) {
    this.loading = true;
    this.http.deleteRequest(_id).subscribe((res) => {
      this.requests = this.requests.filter((req) => req._id !== _id);
      this.loading = false;
    },
    err => {
      this.loading = false;
      console.log(err.error);
    });
  }

  parse(str: string) {
    return JSON.parse(str);
  }

  displayRequestInfo(request: APIRequestModel) {
    this.showModal = true;
    this.request = request;
  }

  dismissModal() {
    this.showModal = false;
  }
}
