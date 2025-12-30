import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { title } = req.query;

  if (!title || title === "The Short Film Show") {
    return res.status(200).json({ synopsis: "A curated showcase of independent cinema." });
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    // Updated to match your specific DB and Collection structure
    const database = client.db('video-streaming-app'); 
    const uploads = database.collection('uploads');

    // Search for title inside the 'project' object
    const film = await uploads.findOne({ 
      "project.title": { $regex: new RegExp(title, "i") } 
    });

    if (film) {
      res.status(200).json({ 
        synopsis: film.project?.synopsis || "No synopsis available.",
        filmId: film.filmId || ""
      });
    } else {
      res.status(200).json({ synopsis: "Independent Short Film Showcase." });
    }
  } catch (error) {
    res.status(500).json({ error: "DB Connection failed" });
  } finally {
    await client.close();
  }
}
