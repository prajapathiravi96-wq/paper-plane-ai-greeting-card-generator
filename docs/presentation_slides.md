# Presentation Slides Content: Paper Plane

This document contains slide contents for Academic Internship Reviews: **Review 1**, **Review 2**, and **Final Review**.

---

# REVIEW 1 PPT: Design, Scope, & Architecture

### Slide 1: Title & Project Overview
- **Project Title:** Paper Plane - AI-Powered Greeting Card Generator
- **Presented By:** [Intern Name]
- **Company Mentor:** Paper Plane Engineering Team
- **Objective:** Build a premium SaaS platform automating personalized greeting card copy using generative artificial intelligence (Gemini API).

### Slide 2: Problem Definition
- Consumers experience writer's block during gift checkout.
- Static templates feel cold, robotic, and generic.
- Lack of emotional customization (funny, romantic, formal).
- No instant preview of how text looks on a card.

### Slide 3: Abstract & Proposed Objectives
- **Abstract:** A generative AI platform translating recipient names, tones, occasions, and lengths into styled cards.
- **Objectives:**
  - Create a responsive card generator workspace (Vite + React).
  - Design dynamic styled card templates.
  - Implement an Express API integrating the Gemini 1.5 Flash model.
  - Establish an analytical dashboard for category monitoring.

### Slide 4: Literature Survey
- **Large Language Models (LLMs):** Shift from static databases to context-aware generative text agents.
- **Client-Side Rendering:** Using modern component libraries (Tailwind, Framer Motion) to deliver fluid, desktop-like micro-interactions.
- **Aggregations in NoSQL:** Storing analytics log structures as JSON documents to query counts without joins.

### Slide 5: System Architecture & Tech Stack
- **Frontend:** React, Tailwind CSS, React Router, Framer Motion, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Mongoose ODM).
- **AI Engine:** Google Gemini LLM via Generative AI SDK.
- **Deployments:** Frontend (Vercel) / Backend (Render).

---

# REVIEW 2 PPT: Database Schemas & REST APIs

### Slide 1: Database Design (Mongoose)
- **User Schema:** Stores customer account credentials and access roles.
- **Greeting Card Schema:** Saves parameters (occasion, tone, language, names) and generated texts (title, message, caption, gift tag).
- **Analytics Schema:** Simple logs tracking timestamps, occasions, and tones to build graphs.

### Slide 2: ER Diagram & Relationships
- Decoupled collections optimized for fast writes.
- One-to-Many: User -> Greeting Cards.
- One-to-One: Greeting Card -> Analytics log.

### Slide 3: REST API Specifications
- `POST /api/cards`: Validates input, compiles prompt, invokes Gemini API, saves card + analytics.
- `GET /api/cards`: Supports queries by search terms, occasion, and tone.
- `DELETE /api/cards/:id`: Cleans card logs from db.
- `GET /api/dashboard/stats`: Generates aggregated data arrays.

### Slide 4: Gemini API Prompt Engineering
- Structured prompt instructing Gemini to write human-like text.
- Forces raw JSON return schemas to avoid HTML parsing errors.
- Integrates language options (English, Hindi) and text constraints.

### Slide 5: Mid-Project Progress Summary
- Backend routes completed and validated using mock parameters.
- Axios hooks established linking client forms to endpoints.
- Basic template layout preview rendered in React.

---

# FINAL REVIEW PPT: System Demo & Deployments

### Slide 1: Final Objectives Accomplished
- Completed React generator workspace with 5 customizable layouts.
- Dynamic template switcher and PDF download implemented.
- Secure, searchable history vault.
- Full Admin Dashboard displaying charts (cards/day, occasion breakdown).
- Offline-ready database and AI fallbacks.

### Slide 2: Feature Walkthrough (Live Demo Screens)
- **Home Landing:** CTA, branding, how-it-works workflow.
- **Generator Workspace:** Live preview panel, loading skeletons, template toggles.
- **Vault:** Query search bars and modal detail reviews.
- **Admin Panel:** Real-time metrics counters, bar charts, pie charts.

### Slide 3: Testing & Validation Metrics
- **Unit & Integration:** Route validation tests.
- **UX Verification:** Verified fully responsive CSS breakpoints across mobile, tablet, and desktops.
- **Gemini Exception Handling:** Failures trigger local template fallbacks.

### Slide 4: Deployment & Operations Guide
- **Frontend:** Deployed to Vercel with automatic production builds.
- **Backend:** Deployed to Render with environment variable bindings.
- **Database:** MongoDB Atlas cloud cluster configured with whitelist IPs.

### Slide 5: Future Enhancements & Conclusion
- **Future Enhancements:** Imagen graphic cards, customer checkout plugins, localized translations.
- **Conclusion:** Paper Plane delivers a high-converting, professional SaaS AI implementation, suitable for production deployment.
