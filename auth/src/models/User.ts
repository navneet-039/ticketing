import mongoose from 'mongoose';
import { Password } from '../services/password';
//an interface that describes the properties
//that are required to craete user
interface UserAttrs {
  email: string;
  password: string;
}
//an interface that describes the properties a user model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
//an interface taht defines the properties that a user document has

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, //string constructor interface we use string
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
});
// .statics lets you define model-level methods in js
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };
//we want to add build in method something like User.build instead of remembering this fn

export { User };
