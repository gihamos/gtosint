import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  pseudos: { type: [String], required: true },
  countries: { type: Schema.Types.ObjectId, ref: 'countries' },
  games: [{ type: Schema.Types.ObjectId, ref: 'games' }]
});

const User = mongoose.model('User', UserSchema);

export default User;