# Paper Plane: AI Greeting Card Generator

An AI-powered greeting card generation platform where customers can input an occasion, select an emotional tone, input sender and recipient details, and instantly generate personalized, high-fidelity greeting cards styled in designer templates. 

Built using the **VERN / MERN Stack** (Vite, React, Express, Node.js, MongoDB) and powered by the **Google Gemini 1.5 Flash API**.

---

## ✈️ Key Features

1. **AI Content Composer**: Generates personalized greeting card text, titles, social captions, and gift tags via advanced prompt engineering with Gemini 1.5.
2. **Interactive Preview Canvas**: Toggle between 5 premium card layouts (Minimalist, Neon Modern, Bright Festive, Romantic, and Sleek Corporate).
3. **One-Click Export**: Copies card text, captions, and gift tags to clipboard, or exports print-ready, high-resolution PDFs.
4. **History Vault**: Securely logs every generated card. Supports instant text search and filters by occasion and tone.
5. **Admin Dashboard**: Visualizes operational analytics (generation count, registered users, category distributions) using charts.
6. **Offline Resiliency**: Automatically falls back to in-memory datasets and structured offline templates if MongoDB or Gemini connections are missing.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Framer Motion, React Icons, Recharts, html2pdf.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas via Mongoose ODM
- **AI Model**: Google Gemini 1.5 Flash (via `@google/generative-ai`)
- **Deployments**: Vercel (Client) / Render (Server)

---

## 📂 Project Structure

```text
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Sidebar, CardTemplate
│   │   ├── pages/              # Home, Generator, History, AdminDashboard, AdminUsers, AdminSettings
│   │   ├── api.js              # Axios config
│   │   └── index.css           # Styling
├── server/                     # Node.js + Express Backend
│   ├── config/db.js            # Database connection
│   ├── controllers/            # Card and Dashboard aggregation logic
│   ├── models/                 # User, GreetingCard, Analytics, Admin models
│   ├── routes/                 # Express API routes
│   └── server.js               # Entry point
└── docs/                       # Internship Documents & Manuals
    ├── internship_report.md    # Full academic project report (ERD, Architecture)
    ├── presentation_slides.md  # Outlines for Review 1, 2, and Final reviews
    └── setup_guide.md          # Step-by-step Local Setup & Deployments Guide
```

---

## 🚀 Quick Start

1. **Clone & Setup Environment**:
   Clone the repository and create `.env` files in both the `/server` and `/client` directories following the guidelines in the [Setup Guide](file:///docs/setup_guide.md).

2. **Run Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Run Frontend Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the App**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 Academic & Internship Documents

Find complete academic reports and slideshow outlines in the `docs` folder:
- 📖 [Project Report](file:///docs/internship_report.md) - Contains UML diagrams, ERDs, and testing strategies.
- 📊 [Presentation Slide Contents](file:///docs/presentation_slides.md) - Outline content for Reviews 1, 2, and Final evaluations.
- ⚙️ [Installation & Deployment Guide](file:///docs/setup_guide.md) - Guides on VS Code configs, MongoDB Atlas setup, Render backend hosting, and Vercel frontend deployments.
