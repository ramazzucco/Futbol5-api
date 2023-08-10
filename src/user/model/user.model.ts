import { ObjectId } from 'mongoose';

export class UserModel {
  fullname!: string;
  email!: string;
  phone!: string;
  role!: string;
  password!: string;
  bookings!: ObjectId[];
  token!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(user: UserModel){
    this.fullname = user.fullname;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
    this.password = user.password;
    this.bookings = user.bookings;
    this.token = user.token;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  getData() {
    return {
        fullname: this.fullname,
        email: this.email,
        phone: this.phone,
        role: this.role,
        bookings: this.bookings,
        token: this.token,
    }
  }
}
