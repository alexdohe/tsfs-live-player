import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const { title } = req.query;

  try {
    await client.connect();
    const database = client.db('tsfs_production'); // Match your DB name
    const films = database.collection('films');
    
    // We look for a film where the title matches the EPG title
    const film = await await films.findOne({ title: { $regex: new RegExp(title, "i") } });

    if (film && film.synopsis) {
      return res.status(200).json({ synopsis: film.synopsis });
    }
    
    res.status(200).json({ synopsis: "Official broadcast showcase." });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch from MongoDB" });
  } finally {
    await client.close();
  }
}
