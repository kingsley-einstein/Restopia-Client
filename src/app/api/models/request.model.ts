export interface APIRequestModel {
  url: string;
  exact: object | string;
  response: object | string;
  method: string;
  headers?: object | string;
}
