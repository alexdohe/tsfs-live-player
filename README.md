TSFS Live Player - Developer Documentation
1. Project Overview
The TSFS Live Player is a React-based web application deployed on Vercel. It is designed to provide a 24/7 broadcast experience for independent cinema, featuring a primary video player, dynamic metadata, and an Electronic Program Guide (EPG).

Core Technology Stack

Frontend: Next.js (React).

Video Engine: Shaka Player (with HLS.js fallback) for adaptive bitrate streaming and caption support.

Database: MongoDB Atlas (stores film metadata and schedules).

Storage: AWS S3 (Hosting fallback video, EPG JSON/XML, and branding assets).

CDN: Bunny CDN (Primary stream delivery and image pull zone).

2. Infrastructure & Networking
The CORS Challenge

A recurring issue during development was CORS (Cross-Origin Resource Sharing). Browsers block the player from loading the .m3u8 manifest if the video server doesn't explicitly allow the Vercel domain.

The Fix: A CORS Proxy (corsproxy.io) was implemented in the frontend to bypass server-side header restrictions during the demo.

S3 Configuration: AWS S3 buckets must have a CORS policy allowing GET requests from * or the specific Vercel URL to load the main.json schedule.

MongoDB Connectivity

The API route (/api/live-status) connects to MongoDB to determine which film is playing.

Whitelist Requirement: MongoDB Atlas must have its Network Access set to 0.0.0.0/0 because Vercel uses dynamic IP addresses.

Fallback Logic: If the database connection fails, the API is hardcoded to return a "Fallback Status," triggering the player to load a branded loop from S3.

3. Video Player Logic
Dual-Stream Strategy

The player follows a "Failover" architecture:

Attempt 1: Load the live HLS stream from Bunny CDN via the proxy.

Attempt 2 (Automatic): If the live stream returns a fatal error (404, 403, or CORS), the player catches the error and loads the Ambience Fallback MP4 from S3.

Critical Video Attributes

Muted Autoplay: Modern browsers require video to be muted to autoplay. A "Tap to Unmute" overlay is required for user engagement.

Looping: The fallback video uses the loop attribute to ensure the screen never goes black.

4. EPG and Asset Management
EPG Syncing

The "Coming Up" sidebar fetches a main.json file from S3.

Path: https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json.

Thumbnail Rewriting: Because thumbnails are stored in a locked S3 bucket but served via a Bunny CDN Pull Zone, the frontend rewrites the URL from assets.theshortfilmshow.com to assets.cdn.theshortfilmshow.com on the fly.

5. Deployment Guide
Environment Variables: Ensure MONGODB_URI and LIVE_STITCHER_URL are set in Vercel.

Build Command: Use next build.

Troubleshooting:

Black Screen: Check the browser console for CORS errors.

Static UI: If changes don't appear, trigger a "Redeploy" in Vercel with "Use Build Cache" disabled.
