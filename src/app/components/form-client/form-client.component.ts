import { Component, OnInit, Input } from "@angular/core";
import { StorageService, TabsHistoryService } from "../../services";
// import { RequestModel } from "../../models/request.model";

@Component({
  templateUrl: "./form-client.component.html",
  styleUrls: ["./form-client.component.css"],
  selector: "app-form-client"
})
export class FormClientComponent implements OnInit {
  @Input()
  tabId: string = "";

  url: string = "";
  allowedMethods: { name: string; value: string; }[] = [
    { name: "GET", value: "GET" },
    { name: "POST", value: "POST" },
    { name: "PATCH", value: "PATCH" },
    { name: "DELETE", value: "DELETE" },
    { name: "PUT", value: "PUT" },
    { name: "OPTIONS", value: "OPTIONS" }
  ];
  requestBodyTypes: { name: string; value: string; }[] = [
    { name: "json", value: "json" },
    { name: "urlencoded", value: "urlencoded" },
    { name: "multipart", value: "multipart" }
  ];
  method: string = "GET";
  requestBodyType: string = "json";
  response: string = "";
  body: any = "{}";
  headers: any = "{}";

  // Urlencoded keys
  objects: { key: string; value: string; }[] = [
    { key: "", value: "" }
  ];

  // Multipart keys
  formDataObjects: { key: string; type: string; value: any }[] = [
    { key: "", type: "text", value: "" }
  ];
  // @Output()
  // e: EventEmitter<RequestModel[]> = new EventEmitter<RequestModel[]>();

  constructor(private storage: StorageService, private tabHistory: TabsHistoryService) {}

  ngOnInit() {
    console.log("[Form]");
    console.log(this.tabId);
    if (!this.tabHistory.getTabContent(this.tabId)) {
      this.saveTabContent();
    }
    if (this.tabHistory.getTabContent(this.tabId)) {
      this.getTabContent();
    }
  }

  addToLocalStorage() {
    this.storage.addToStorage({
      method: this.method,
      url: this.url,
      response: JSON.parse(this.response)
    });
  }

  async fetchData() {
    if (this.requestBodyType === "json") {
      this.body = JSON.stringify(JSON.parse(this.body));
    }
    if (this.requestBodyType === "urlencoded") {
      const newBody = {};
      this.objects.forEach((o) => {
        newBody[o.key] = o.value;
      });
      this.body = JSON.stringify(newBody, undefined, 2);
    }
    if (this.requestBodyType === "multipart") {
      const formData: FormData = new FormData();
      this.formDataObjects.forEach((o) => {
        formData.append(o.key, o.value, (o.value.name ? o.value.name : ""));
      });
      this.body = formData;
    }
    const r = await fetch(this.url, {
      method: this.method,
      body: (this.method === "GET" || this.method === "HEAD") ? null : this.body,
      headers: JSON.parse(this.headers) || null
    });
    const json = await r.json();
    this.response = JSON.stringify(json, undefined, 2);
  }

  async fetchAndUpdate() {
    await this.fetchData();
    this.addToLocalStorage();
    this.saveTabContent();
  }

  // updateHistory() {
  // }

  formatJson(event: any) {
    // console.log(event.key);
    const SINGLE_QUOTE = "'";
    const DOUBLE_QUOTE = '"';
    const LEFT_CURLY_BRACE = "{";
    const RIGHT_CURLY_BRACE = "}";
    const LEFT_SQUARE_BRACKET = "[";
    const RIGHT_SQUARE_BRACKET = "]";

    const PAIRS = {
      [SINGLE_QUOTE]: SINGLE_QUOTE,
      [DOUBLE_QUOTE]: DOUBLE_QUOTE,
      [LEFT_CURLY_BRACE]: RIGHT_CURLY_BRACE,
      [LEFT_SQUARE_BRACKET]: RIGHT_SQUARE_BRACKET
    };
    if (!Object.keys(PAIRS).includes(event.key)) {
      // event.target.value = JSON.stringify(
      //   JSON.parse(event.target.value), undefined, 2
      // );
      return;
    }
    const cursorPosition = event.target.selectionStart;
    const cursorEnd = event.target.selectionEnd;
    const closingChar = PAIRS[event.key];
    event.target.value = event.target.value.substr(0, cursorPosition) + closingChar + event.target.value.substr(cursorPosition);
    setTimeout(() => {
      event.target.value = JSON.stringify(
        JSON.parse(event.target.value), undefined, 2
      );
    }, 100);
    this.saveTabContent();
    event.target.setSelectionRange(cursorPosition, cursorEnd);
  }

  logMethod() {
    console.log(this.method);
    this.saveTabContent();
  }

  saveTabContent() {
    setTimeout(() => {
      this.tabHistory.addTabContent(this.tabId, {
        url: this.url,
        method: this.method,
        requestBodyType: this.requestBodyType,
        response: this.response,
        body: this.body,
        headers: this.headers
      });
    }, 500);
  }

  getTabContent() {
    const content = this.tabHistory.getTabContent(this.tabId);
    this.url = content.url;
    this.method = content.method;
    this.requestBodyType = content.requestBodyType;
    this.response = content.response;
    this.body = content.body;
    if (this.requestBodyType === "urlencoded") {
      if (Object.keys(JSON.parse(this.body)).length > 0) {
        this.objects = [];
        Object.keys(JSON.parse(this.body)).forEach((key) => {
        this.objects.push({
          key, value: JSON.parse(this.body)[key]
        });
      });
      }
    }
    this.headers = content.headers;
  }

  watchUrlencodedFields() {
    console.log(this.objects);
    const newBody = {};
    this.objects.forEach((o) => {
        newBody[o.key] = o.value;
      });
    this.body = JSON.stringify(newBody, undefined, 2);
    this.saveTabContent();
  }

  pushUrlEncoded() {
    this.objects.push({
      key: "",
      value: ""
    });
  }

  removeUrlEncoded(i: any) {
    const index = this.objects.indexOf(i);
    this.objects.splice(index, 1);
  }

  watchMultipartFields() {
    const formData: FormData = new FormData();
    this.formDataObjects.forEach((o) => {
        formData.append(o.key, o.value, (o.value.name ? o.value.name : ""));
      });
    this.body = formData;
    this.saveTabContent();
    console.log(this.formDataObjects);
  }
}
