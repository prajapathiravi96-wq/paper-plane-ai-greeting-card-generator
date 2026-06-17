# Installation & Deployment Manual: Paper Plane

This guide walks you through setting up, running, and deploying the **Paper Plane** AI Greeting Card Generator from scratch.

---

## 1. VS Code Local Setup

1. **Install Node.js**: Ensure you have Node.js (v18 or higher) installed on your system. Verify by running `node -v` in your terminal.
2. **Open Project**: Open the project root folder `AI GREETING CARD GENERATOR` in VS Code.
3. **Workspace Organization**:
   - Open a terminal split: Terminal 1 for `server` operations, Terminal 2 for `client` operations.
4. **VS Code Extensions Recommendation**:
   - **Prettier** - for code formatting.
   - **Tailwind CSS IntelliSense** - for CSS autocomplete.

---

## 2. npm Commands Reference

### Backend Server Setup:
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Start the server in development mode (with nodemon)
npm run dev

# Start the server in production mode
npm start
```

### Frontend Client Setup:
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev

# Build the production bundle
npm run build
```

---

## 3. Environment Variable Setup

### Server Config:
Create a file named `.env` in the `server` directory (copy the `.env.example` structure):
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

### Client Config:
Create a file named `.env` in the `client` directory:
```env
# Optional: Set this if your backend is running on a different port or host.
# If omitted, client will proxy /api to localhost:5000 during development.
VITE_API_URL=http://localhost:5000/api
```

---

## 4. MongoDB Atlas Setup Guide

1. **Sign Up / Log In**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create Database Cluster**:
   - Click "Deploy a Database". Choose the **M0 Shared Free Tier**.
   - Select your preferred cloud provider (AWS/GCP) and region close to you.
3. **Configure Access Control**:
   - **Database Access**: Create a database user with username and password. Keep these credentials safe.
   - **Network Access**: Add an IP access entry. For testing, choose "Allow Access From Anywhere" (`0.0.0.0/0`).
4. **Get Connection String**:
   - Go to your Cluster dashboard, click **Connect** -> **Drivers**.
   - Copy the connection string. It looks like:
     `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - Paste it into your `server/.env` as `MONGODB_URI`, replacing `<username>` and `<password>` with your database user credentials.

---

## 5. GitHub Repository Push Commands

Run these commands in the root of the project to initialize Git and upload the code to your GitHub account:

```bash
# Initialize git in root folder
git init

# Add root gitignore to prevent pushing node_modules
echo "node_modules/\n.env\ndist/\n.DS_Store" > .gitignore

# Add all files to staging
git add .

# Create initial commit
git commit -m "feat: initial commit for Paper Plane AI Greeting Card Generator"

# Rename branch to main
git branch -M main

# Link to your remote GitHub repository
git remote add origin https://github.com/your-username/paper-plane.git

# Push changes
git push -u origin main
```

---

## 6. Render Deployment Guide (Backend Server)

1. Sign up/log in at [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `paper-plane-server`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Open **Environment Variables** (under Advanced settings or sidebar tab) and add:
   - `MONGODB_URI` = (your Atlas connection URL)
   - `GEMINI_API_KEY` = (your Gemini token)
   - `PORT` = `5000`
6. Click **Deploy Web Service**. Render will build the service and give you a public URL (e.g. `https://paper-plane-server.onrender.com`).

---

## 7. Vercel Deployment Guide (Frontend Client)

1. Sign up/log in at [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Connect your GitHub repository.
4. Select the project and configure the project settings:
   - **Root Directory**: Select `client`
   - **Framework Preset**: `Vite` (detected automatically)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_API_URL` = (your Render backend API URL, e.g. `https://paper-plane-server.onrender.com/api`)
6. Click **Deploy**. Vercel will build your static files and host the React application on a global CDN, providing a public domain.
