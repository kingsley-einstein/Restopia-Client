import { Component, OnInit } from '@angular/core';
import { SwUpdate } from "@angular/service-worker";
import { SettingsService } from "./services";
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // isSupportedWidth: boolean = window.screen.width > 780;
  shouldDisplayOverlay: boolean = true;
  shouldDisplayTopLevelAlert: boolean = false;
  type: string = "info";
  alertText: string = "";

  constructor(private swUpdate: SwUpdate, private settings: SettingsService) {}

  ngOnInit() {
    this.run();
    this.watchPwa();
    if (!this.settings.getTabsContentState()) {
      this.settings.switchTabsContent();
    } else {
      this.settings.switchTabsContent(this.settings.getTabsContentState());
    }
    if (!this.settings.getTabsHistoryState()) {
      this.settings.switchTabsHistory();
    } else {
      this.settings.switchTabsHistory(this.settings.getTabsHistoryState());
    }
    // if (!this.settings.getStaySignedInState()) {
    //   this.settings.switchStaySignedIn();
    // } else {
    //   this.settings.switchStaySignedIn(this.settings.getStaySignedInState());
    // }
    this.settings.clearAllTabsHistoryOnLeaveIfEnabled();
    this.settings.clearTabsContentOnLeaveIfEnabled();
    // this.settings.clearSignInOnLeaveIfEnabled();
  }

  run() {
    setTimeout(() => {
      this.shouldDisplayOverlay = false;
    }, 4000);
  }

  hideAlert() {
    this.shouldDisplayTopLevelAlert = false;
  }

  public showMessage(message: string, type: string = "info") {
    this.shouldDisplayTopLevelAlert = true;
    this.alertText = message;
    this.type = type;

    setTimeout(() => {
      this.shouldDisplayTopLevelAlert = false;
      this.alertText = "";
      this.type = "info";
    }, 4000);
  }

  watchPwa() {
    if (this.swUpdate.isEnabled && environment.production) {
      this.swUpdate.available.subscribe((available) => {
        if (available) {
          this.showMessage("New version of app is available. App would be updated in background.");
          this.swUpdate.activateUpdate().then(() => {
            this.showMessage("App successfully updated in background. Would now reload to effect changes.");
            window.location.reload();
          });
        }
      });
    }
  }
}
