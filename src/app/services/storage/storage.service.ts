import { Injectable } from "@angular/core";
import { RequestModel } from "../../models";

@Injectable()
export class StorageService {
  addToStorage(model: RequestModel) {
    let requests: Array<RequestModel>;
    if (localStorage.getItem("requests")) {
      requests = JSON.parse(localStorage.getItem("requests"));
      requests.push(model);
      localStorage.setItem("requests", JSON.stringify(requests));
    } else {
      requests = [];
      requests.push(model);
      localStorage.setItem("requests", JSON.stringify(requests));
    }
  }

  emptyStorage() {
    if (localStorage.getItem("requests")) {
      localStorage.setItem("requests", JSON.stringify([]));
    }
  }

  getItems() {
    return localStorage.getItem("requests");
  }
}
