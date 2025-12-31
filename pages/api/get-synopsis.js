import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: "No title" });

  try {
    if (!uri) throw new Error("MONGODB_URI is not defined");

    // Standard Next.js MongoDB connection pattern
    await client.connect();
    const database = client.db('video-streaming-app');
    const uploads = database.collection('uploads');
    
    const cleanTitle = title.split('(')[0].trim();
    const doc = await uploads.findOne({ 
      "project.title": { $regex: new RegExp("^" + cleanTitle + "$", "i") } 
    });

    if (doc) {
      return res.status(200).json({ 
        synopsis: doc.project?.synopsis || "Official broadcast showcase.",
        banner: doc.banner?.url || null 
      });
    }
    res.status(200).json({ synopsis: "Official broadcast showcase." });
  } catch (error) {
    // This logs the SPECIFIC error to your Vercel dashboard
    console.error("DETAILED_MONGO_ERROR:", error.message);
    res.status(500).json({ error: "Database error", message: error.message });
  } finally {
    await client.close();
  }
}
