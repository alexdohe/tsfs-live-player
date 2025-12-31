import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) return res.status(400).json({ error: "No title provided" });

  try {
    await client.connect();
    const database = client.db('video-streaming-app'); 
    const uploads = database.collection('uploads');
    
    // Clean title for matching
    const cleanTitle = title.split('(')[0].trim();

    // Find the document where project.title matches
    const doc = await uploads.findOne({ 
      "project.title": { $regex: new RegExp("^" + cleanTitle + "$", "i") } 
    });

    if (doc) {
      return res.status(200).json({ 
        synopsis: doc.project?.synopsis || "Official broadcast showcase.",
        banner: doc.banner?.url || null 
      });
    }
    
    res.status(200).json({ synopsis: "Official broadcast showcase.", banner: null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
}
