import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    return res.status(200).json({ synopsis: "Showcasing independent cinema." });
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    // Ensure these match your Atlas dashboard exactly
    const database = client.db('video-streaming-app'); 
    const uploads = database.collection('uploads');

    // Clean the title: trim spaces and use a case-insensitive Regex
    const cleanTitle = title.trim();
    
    const film = await uploads.findOne({ 
      "project.title": { $regex: new RegExp(`^${cleanTitle}$`, "i") } 
    });

    if (film) {
      res.status(200).json({ 
        synopsis: film.project?.synopsis || "No synopsis available.",
        thumbnail: film.thumbnail?.url || film.project?.thumbnail || null,
        filmId: film.filmId || ""
      });
    } else {
      // Log for Vercel Runtime Logs so we can see what title failed
      console.log(`Search failed for title: "${cleanTitle}"`);
      res.status(200).json({ synopsis: "Independent Short Film Showcase.", thumbnail: null });
    }
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database connection failed" });
  } finally {
    await client.close();
  }
}
