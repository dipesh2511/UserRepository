export default class GenericResponseHandler {
  constructor(message, status, code, data) {
    this.message = message;
    this.status = status;
    this.code = code;
    this.data = data;  
}
}
