export class UserPayloadClass {
  constructor(firstName, lastName, email, user_id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.user_id = user_id;
  }

  static createPayload(firstName, lastName, email, user_id) {
    const payload = new UserPayloadClass(firstName, lastName, email, user_id);
    return payload;
  }
}
