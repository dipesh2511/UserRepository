export default class GenericErrorHandler extends Error {
  constructor(message, status, error_type, validation_error = null) {
    super(message);
    this.message= message;
    this.status = status;
    this.error_type = error_type;
    this.validation_error = validation_error;
  }
}
