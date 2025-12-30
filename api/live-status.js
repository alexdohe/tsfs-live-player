import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('TheShortFilm');
        const schedule = await db.collection('ChannelSchedules').findOne({ channel: 'main' }, { sort: { schedule_date: -1 } });
        const currentVideoId = schedule.playlist[0].videoId; 
        const film = await db.collection('uploads').findOne({ "file.videoId": currentVideoId });

        res.status(200).json({
            status: "live",
            streamUrl: process.env.LIVE_STITCHER_URL,
            title: film.project.title,
            synopsis: film.project.synopsis,
            filmId: film.filmId,
            filmPageUrl: "https://theshortfilmshow.com/film/" + film.filmId
        });
    } catch (e) {
        res.status(200).json({
            status: "fallback",
            streamUrl: "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4",
            title: "The Short Film Show - Live Showcase",
            synopsis: "Preparing the next award-winning short. Stay tuned!"
        });
    }
}
