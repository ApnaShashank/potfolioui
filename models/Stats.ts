import mongoose, { Schema, model, models } from 'mongoose';

const StatsSchema = new Schema({
  siteId: { type: String, default: 'main', unique: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

const Stats = models.Stats || model('Stats', StatsSchema);

export default Stats;
