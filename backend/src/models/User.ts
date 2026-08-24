import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  institution?: string;
  country?: string;
  bookmarkedConferences: Schema.Types.ObjectId[];
  alertSubscriptions: Array<{
    category: string;
    country?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    institution: { type: String, default: '' },
    country: { type: String, default: '' },
    bookmarkedConferences: [{ type: Schema.Types.ObjectId, ref: 'Conference' }],
    alertSubscriptions: [
      {
        category: { type: String, required: true },
        country: { type: String },
        frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', UserSchema);
