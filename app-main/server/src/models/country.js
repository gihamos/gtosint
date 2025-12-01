import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  alpha2Code: { type: String, required: true, unique: true },
  alpha3Code: { type: String, required: true, unique: true },
  flagUrl: { type: String, required: true },
  region: String,
  subregion: String,
  population: Number,
  languages: [String],
  currencies: [String],
  lastUpdated: { type: Date, default: Date.now }
});

const Country = mongoose.model('Country', countrySchema);
export default Country;