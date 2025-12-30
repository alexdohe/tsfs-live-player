# TSFS Live Player Portal

A resilient broadcast-grade web player for **The Short Film Show**. This application manages a live HLS stream with a 4-second automated failover to an S3-hosted "Ambience" video loop.

## 🚀 Key Features

* **Dual-Engine Player**: Uses **Shaka Player** for HLS live streams and **Native HTML5** for MP4 fallbacks to maximize browser compatibility and stability.
* **Watchdog Failover**: A 4-second logic timer identifies hung network requests (CORS or server downtime) and forces a switch to the S3 fallback video.
* **Smart EPG Sidebar**: Auto-refreshes every 30 seconds, filtering out past shows and skipping "Untitled" or placeholder blocks to maintain a premium feel.
* **MetaData API**: Case-insensitive wildcard searching connects the EPG title to the `uploads` collection in MongoDB Atlas.

## 🛠 Tech Stack

* **Framework**: Next.js (React)
* **Video Engine**: Shaka Player (Google) & HTML5 Native
* **Database**: MongoDB Atlas
* **Hosting**: Vercel (channel.theshortfilmshow.com)
* **Storage**: Amazon S3 (EPG JSON & Video Assets)

## 📡 Data Architecture & Flow

1. **EPG Check**: The site fetches `main.json` from S3.
2. **Title Processing**: The Sidebar identifies the current film title, skipping "Untitled".
3. **Metadata Fetch**: The API `/api/get-synopsis` searches MongoDB for that title.
4. **Player Logic**: 
    - Attempt 1: Load HLS Stream via Shaka.
    - Failover (4s): If no signal, destroy Shaka and load MP4 via Native Video tag.

## 🔧 Troubleshooting

### Synopsis is missing or says "Independent Cinema Showcase"
* **Check Title Match**: Ensure the title in your EPG matches the `project.title` in MongoDB exactly (case doesn't matter, but spelling does).
* **Check API Logs**: View Vercel Runtime Logs for `Search failed for title: "NAME"`.

### Video is stuck on "ESTABLISHING SIGNAL"
* **CORS Policy**: Ensure S3 has the correct CORS headers allowing `https://channel.theshortfilmshow.com`.
* **HLS Status**: Verify the `.m3u8` manifest is reachable in a standard VLC player.

### AirPlay Disconnects
* The player uses `onEnded` manual looping to keep the AirPlay session alive. If it still fails, check the file format of the fallback MP4.

## 📋 Environment Variables
* `MONGODB_URI`: Required for the Synopsis API.

## 🚀 Deployment
Push to `main` branch. Deployment is automatic via Vercel.
