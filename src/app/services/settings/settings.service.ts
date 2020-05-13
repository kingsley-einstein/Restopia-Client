import { Injectable } from "@angular/core";
import { TabsHistoryService } from "../tabs-history/tabs-history.service";

@Injectable()
export class SettingsService {
  constructor(private tabs: TabsHistoryService) {}

  switchTabsHistory(state: string = "on") {
    localStorage.setItem("enable_tabs_history", state);
  }

  clearAllTabsHistoryOnLeaveIfEnabled() {
    window.addEventListener("unload", (e) => {
      if (localStorage.getItem("enable_tabs_history") && localStorage.getItem("enable_tabs_history") === "off" ) {
        this.tabs.clearAllTabsContent();
        this.tabs.clearTabsHistory();
      }
    });
  }

  switchTabsContent(state: string = "off") {
    localStorage.setItem("delete_tabs_content", state);
  }

  clearTabsContentOnLeaveIfEnabled() {
    window.addEventListener("unload", (e) => {
      // e.preventDefault();
      if (localStorage.getItem("delete_tabs_content") && localStorage.getItem("delete_tabs_content") === "on") {
        this.tabs.clearAllTabsContent();
      }
    });
  }

  switchStaySignedIn(state: string = "on") {
    localStorage.setItem("stay_signed_in", state);
  }

  clearSignInOnLeaveIfEnabled() {
    window.addEventListener("unload", (e) => {
      if (localStorage.getItem("stay_signed_in") && localStorage.getItem("stay_signed_in") === "off") {
        if (localStorage.getItem("token") && localStorage.getItem("user")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    });
  }

  getTabsHistoryState() {
    return localStorage.getItem("enable_tabs_history");
  }

  getTabsContentState() {
    return localStorage.getItem("delete_tabs_content");
  }

  getStaySignedInState() {
    return localStorage.getItem("stay_signed_in");
  }
}
