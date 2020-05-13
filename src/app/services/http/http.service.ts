import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Config, APIAuthModel, APIRequestModel, APIResponseModel } from "../../api";

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}

  createUser(model: APIAuthModel) {
    return this.http.post<APIResponseModel>(`${Config.URL}/user`, model);
  }

  logUserIn(model: APIAuthModel) {
    return this.http.post<APIResponseModel>(`${Config.URL}/user/login`, model);
  }

  getAuthenticatedUser() {
    return this.http.get<APIResponseModel>(`${Config.URL}/user/logged`);
  }

  logUserOut() {
    return this.http.post<APIResponseModel>(`${Config.URL}/user/logout`, {});
  }

  updatePassword(model: APIAuthModel) {
    return this.http.patch<APIResponseModel>(`${Config.URL}/user/update_password`, model);
  }

  createRequest(model: APIRequestModel) {
    return this.http.post<APIResponseModel>(`${Config.URL}/request`, model);
  }

  deleteRequest(id: any) {
    return this.http.delete<APIResponseModel>(`${Config.URL}/request/${id}`);
  }

  getAllRequests() {
    return this.http.get<APIResponseModel>(`${Config.URL}/request`);
  }
}
