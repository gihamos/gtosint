import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
  id: String,
  name: String,
  slug: String,
  region: String,
  image: String,
  priority: Number,
  displayPriority: Object,
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

const League = mongoose.model('League', leagueSchema);

export default League;