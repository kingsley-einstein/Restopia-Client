import { Component, OnInit } from "@angular/core";
// import { RequestModel } from "../../models";

@Component({
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.css"],
  selector: "app-sidenav"
})
export class SideNavComponent implements OnInit {
  // requests: RequestModel[] = [];

  ngOnInit() {
    console.log("[SideNav]");
    // this.loadHistory();
  }

  // loadHistory() {
  //   this.requests = JSON.parse(localStorage.getItem("requests"));
  // }
}
