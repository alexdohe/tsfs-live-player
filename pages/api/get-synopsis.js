import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { title } = req.query;
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const database = client.db('video-streaming-app'); 
    const uploads = database.collection('uploads');

    // Searching specifically within the project.title field
    const film = await uploads.findOne({ 
      "project.title": { $regex: new RegExp(title, "i") } 
    });

    if (film) {
      // Extracting the synopsis and the thumbnail URL from your object
      res.status(200).json({ 
        synopsis: film.project?.synopsis || "No synopsis available.",
        thumbnail: film.thumbnail?.url || film.project?.thumbnail || null,
        filmId: film.filmId || ""
      });
    } else {
      res.status(200).json({ synopsis: "Independent Short Film Showcase.", thumbnail: null });
    }
  } catch (error) {
    res.status(500).json({ error: "DB Error" });
  } finally {
    await client.close();
  }
}
