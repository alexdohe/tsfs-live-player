import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { title } = req.query;
  if (!title) return res.status(200).json({ synopsis: "TSFS Live Broadcast" });

  const client = new MongoClient(process.env.MONGODB_URI, {
    connectTimeoutMS: 5000, // Don't let it hang the page
  });

  try {
    await client.connect();
    // Use the exact database name from your Atlas Screenshot
    const database = client.db('video-streaming-app'); 
    const uploads = database.collection('uploads');

    const film = await uploads.findOne({ 
      "project.title": { $regex: new RegExp(title.trim(), "i") } 
    });

    if (film) {
      res.status(200).json({ 
        synopsis: film.project?.synopsis || "No synopsis available.",
        thumbnail: film.thumbnail?.url || null
      });
    } else {
      res.status(200).json({ synopsis: "Independent Short Film Showcase." });
    }
  } catch (error) {
    res.status(200).json({ synopsis: "Live Short Film Channel." });
  } finally {
    await client.close();
  }
}
