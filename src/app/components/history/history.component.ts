import { Component, OnInit } from "@angular/core";
import { HistoryService } from 'src/app/services';
// import { Subject } from "rxjs";
// import { RequestModel } from "../../models";

@Component({
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  selector: "app-history"
})
export class HistoryComponent implements OnInit {
  // requests: RequestModel[] = [];
  // public requestSubject: Subject<RequestModel[]> = new Subject<RequestModel[]>();

  constructor(public service: HistoryService) {}

  ngOnInit() {
    console.log("[History]");
    this.service.loadHistory();
    // this.subscribeToHistory();
    // this.loadHistory();
    // console.log(this.requests);
  }

  clearHistory() {
    this.service.clean();
    window.location.reload();
  }

  // subscribeToHistory() {
  //   this.requestSubject.subscribe((allRequests) => {
  //     this.requests = allRequests;
  //   });
  // }

  // loadHistory() {
  //   this.requestSubject.next(JSON.parse(localStorage.getItem("requests")));
  // }
}
