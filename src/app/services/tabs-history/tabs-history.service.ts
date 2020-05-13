import { Injectable } from "@angular/core";

@Injectable()
export class TabsHistoryService {
  addTab(name: string, id: any) {
    let tabs: { name: string; id: any }[] = [];
    if (localStorage.getItem("tabs")) {
      tabs = JSON.parse(localStorage.getItem("tabs"));
      tabs = tabs.filter((tab) => tab.id !== id);
      const newTabs = tabs.concat({ name, id });
      localStorage.setItem("tabs", JSON.stringify(newTabs));
    }
    tabs.push({ name, id });
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }

  getTabs() {
    return JSON.parse(
      localStorage.getItem("tabs")
    );
  }

  clearTabsHistory() {
    localStorage.removeItem("tabs");
  }

  removeTabAndContent(id: any) {
    let tabs = JSON.parse(localStorage.getItem("tabs"));
    tabs = tabs.filter((tab: any) => tab.id !== id);
    localStorage.setItem("tabs", JSON.stringify(tabs));
    localStorage.removeItem(id.toString());
  }

  addTabContent(id: any, content: any) {
    localStorage.setItem(id.toString(), JSON.stringify(content));
  }

  getTabContent(id: any) {
    return localStorage.getItem(id) ? JSON.parse(
      localStorage.getItem(id)
    ) : null;
  }

  clearAllTabsContent() {
    if (localStorage.getItem("tabs")) {
      const tabs = JSON.parse(localStorage.getItem("tabs"));
      tabs.forEach((tab: any) => {
        localStorage.removeItem(tab.id.toString());
      });
    }
  }
}
