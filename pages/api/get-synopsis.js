import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { title } = req.query;
  if (!title) return res.status(200).json({ synopsis: "Independent Cinema Showcase." });

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db('video-streaming-app'); 
    const uploads = database.collection('uploads');

    // WILDCARD SEARCH: Finds titles that contain the EPG text
    const cleanTitle = title.trim();
    const film = await uploads.findOne({ 
      "project.title": { $regex: new RegExp(cleanTitle, "i") } 
    });

    if (film) {
      res.status(200).json({ 
        synopsis: film.project?.synopsis || "No synopsis available.",
        thumbnail: film.thumbnail?.url || film.project?.thumbnail || null,
        filmId: film.filmId || ""
      });
    } else {
      res.status(200).json({ synopsis: "Short Film Showcase.", thumbnail: null });
    }
  } catch (error) {
    res.status(500).json({ error: "DB Connection Error" });
  } finally {
    await client.close();
  }
}
