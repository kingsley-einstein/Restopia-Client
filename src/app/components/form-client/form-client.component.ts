import { Component, OnInit, Input } from "@angular/core";
import { ClrLoadingState } from "@clr/angular";
import { StorageService, TabsHistoryService, HttpService } from "../../services";
import { environment } from "../../../environments/environment";
// import { RequestModel } from "../../models/request.model";

@Component({
  templateUrl: "./form-client.component.html",
  styleUrls: ["./form-client.component.css"],
  selector: "app-form-client"
})
export class FormClientComponent implements OnInit {
  @Input()
  tabId: string = "";

  loading: ClrLoadingState = ClrLoadingState.DEFAULT;
  saveRequestLoading: ClrLoadingState = ClrLoadingState.DEFAULT;

  canSaveRequests: boolean = false;

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
  response: string = "{}";
  body: any = "{}";
  headers: any = "{}";
  statusCode: number = 0;

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

  constructor(private storage: StorageService, private tabHistory: TabsHistoryService, private http: HttpService) {}

  ngOnInit() {
    console.log("[Form]");
    console.log(this.tabId);
    if (!this.tabHistory.getTabContent(this.tabId)) {
      this.saveTabContent();
    }
    if (this.tabHistory.getTabContent(this.tabId)) {
      this.getTabContent();
    }
    this.canSaveRequest();
  }

  addToLocalStorage() {
    this.storage.addToStorage({
      method: this.method,
      url: this.url,
      response: JSON.parse(this.response),
      status: this.statusCode
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
      const newBody = {};
      this.formDataObjects.forEach((o) => {
        formData.set(o.key, o.value);
      });
      formData.forEach((i, k) => {
        newBody[k] = i;
      });
      this.body = JSON.stringify(newBody, undefined, 2);
    }
    this.loading = ClrLoadingState.LOADING;

    if (!this.url.startsWith("http://")) {
      this.url = "http://" + this.url;
    }

    const mainRequestBody = {
      type: this.requestBodyType,
      method: this.method,
      url: this.url,
      body: JSON.parse(this.body),
      headers: JSON.parse(this.headers)
    };

    const outUrl = (
      this.url.startsWith("http://localhost:")
    || this.url.startsWith("localhost:")
    || this.url.startsWith("http://127.0.0.1:")
    || this.url.startsWith("127.0.0.1:")) ?
                  this.url : environment.proxy;
    const outGoingBody = (
        this.url.startsWith("http://localhost:")
      || this.url.startsWith("localhost:")
      || this.url.startsWith("http://127.0.0.1:")
      || this.url.startsWith("127.0.0.1:")) ?
                    JSON.stringify(this.body) : JSON.stringify(mainRequestBody);
    const outGoingHeaders = (
      this.url.startsWith("http://localhost:")
      || this.url.startsWith("localhost:")
      || this.url.startsWith("http://127.0.0.1:")
      || this.url.startsWith("127.0.0.1:")) ?
                      JSON.parse(this.headers) : {};
    const outGoingMethod = (
        this.url.startsWith("http://localhost:")
      || this.url.startsWith("localhost:")
      || this.url.startsWith("http://127.0.0.1:")
      || this.url.startsWith("127.0.0.1:")) ?
                  this.method : "POST";

    const r = await fetch(outUrl, {
      method: outGoingMethod,
      body: (this.method !== "GET" && this.method !== "HEAD") ? outGoingBody : null,
      headers: outGoingHeaders
    })
    .catch((err) => null);

    this.loading = (!r || (r.status >= 400 && r.status <= 599)) ? ClrLoadingState.ERROR : ClrLoadingState.SUCCESS;
    this.statusCode = r.status || 500;
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
        response: JSON.parse(this.response),
        body: JSON.parse(this.body),
        headers: JSON.parse(this.headers),
        status: this.statusCode
      });
    }, 500);
  }

  getTabContent() {
    const content = this.tabHistory.getTabContent(this.tabId);
    this.url = content.url;
    this.method = content.method;
    this.requestBodyType = content.requestBodyType;
    this.statusCode = content.status;
    this.response = JSON.stringify(content.response, undefined, 2);
    this.body = JSON.stringify(content.body, undefined, 2);
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
    if (this.requestBodyType === "multipart") {
      if (Object.keys(JSON.parse(this.body)).length > 0) {
        this.formDataObjects = [];
        Object.keys(JSON.parse(this.body)).forEach((key) => {
          this.formDataObjects.push({
            key, value: JSON.parse(this.body)[key],
            type: typeof JSON.parse(this.body)[key] === "object" ? "file" : "text"
          });
        });
      }
    }
    this.headers = JSON.stringify(content.headers, undefined, 2);
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
    const newBody = {};
    this.formDataObjects.forEach((o) => {
        formData.set(o.key, o.value);
      });
    formData.forEach((i, k) => {
      newBody[k] = i;
    });
    this.body = JSON.stringify(newBody, undefined, 2);
    this.saveTabContent();
    console.log(this.formDataObjects);
  }

  handleFileUpload(event: any, o: any) {
    const file = event.target.files[0];
    o.value = file;
    this.watchMultipartFields();
    this.saveTabContent();
    console.log(this.formDataObjects);
  }

  addMultipart() {
  this.formDataObjects.push({
    key: "",
    type: "text",
    value: ""
    });
  }

  removeMultipart(i: any) {
    const index = this.formDataObjects.indexOf(i);
    this.formDataObjects.splice(index, 1);
  }

  canSaveRequest() {
    if (localStorage.getItem("token")) {
      this.canSaveRequests = true;
    }
  }

  createRequest() {
    this.saveRequestLoading = ClrLoadingState.LOADING;
    this.http.createRequest({
      url: this.url,
      method: this.method,
      headers: JSON.parse(this.headers),
      exact: JSON.parse(this.body),
      response: JSON.parse(this.response)
    })
    .subscribe((res) => {
      console.log(res);
      this.saveRequestLoading = ClrLoadingState.SUCCESS;
    },
    err => {
      this.saveRequestLoading = ClrLoadingState.ERROR;
      console.log(err.error);
    });
  }
}
