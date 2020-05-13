import { Component, OnInit } from "@angular/core";
import { SettingsService } from "../../services";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {

  maintainTabsHistory: string = "on";
  deleteTabsContent: string = "off";
  keepSignIn: string = "on";

  constructor(private settings: SettingsService) {}

  ngOnInit() {
    console.log("[Settings]");
    this.maintainTabsHistory = this.settings.getTabsHistoryState();
    this.deleteTabsContent = this.settings.getTabsContentState();
    this.keepSignIn = this.settings.getStaySignedInState();
  }

  switchTabsHistory($event: any) {
    setTimeout(() => {
      console.log($event.target.checked);
      this.settings.switchTabsHistory($event.target.checked ? "on" : "off");
    }, 500);
  }

  switchTabsContent($event: any) {
    setTimeout(() => {
      console.log($event.target.checked);
      this.settings.switchTabsContent(!$event.target.checked ? "on" : "off");
    });
  }

  switchKeepSignIn($event: any) {
    setTimeout(() => {
      console.log($event.target.checked);
      this.settings.switchStaySignedIn($event.target.checked ? "on" : "off");
    });
  }
}
