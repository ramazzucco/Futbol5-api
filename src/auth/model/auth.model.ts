import { ObjectId } from 'mongoose';

export class AuthModel {
  _id: ObjectId;
  token: string;
  user_id: ObjectId;
  isvalid: boolean;
  createdAt: Date;
  updatedAt: Date;
}
