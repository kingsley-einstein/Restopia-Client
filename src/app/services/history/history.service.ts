import { Injectable } from "@angular/core";
import { StorageService } from "../storage/storage.service";
import { RequestModel } from "../../models/";

@Injectable()
export class HistoryService {
  constructor(private storage: StorageService) {}

  public history: RequestModel[] = [];

  public loadHistory() {
    this.history = [];
    if (this.storage.getItems()) {
      this.history = JSON.parse(this.storage.getItems());
    }
  }

  public clean() {
    this.storage.emptyStorage();
  }
}
