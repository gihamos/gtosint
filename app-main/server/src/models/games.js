import mongoose from 'mongoose';

const { Schema } = mongoose;

const gameSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: {type: String},
  summary: {type: String},
  coverUrl: {type: String},
  platforms: {type: [Number]},
  lastUpdated: { type: Date, default: Date.now }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;