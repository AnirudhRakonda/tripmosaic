# 🌍 TripMosaic

**TripMosaic** is a collaborative group trip planning web app built with **React, Firebase, Groq AI, and Google Maps**.  
It enables users to create travel groups, collect preferences, generate AI-powered itineraries, and visualize routes on an interactive map.

---

## 🚀 Features

- **Authentication**: Email & Google Sign-In (Firebase Auth)
- **Groups**: Create or join travel groups
- **Preferences**: Group travel preference form
- **AI Planner**: Generate itineraries using **Groq LLaMA 3.3** (`llama-3.3-70b-versatile`)
- **Maps**: Visualize trip routes with **Google Maps**
- **Expense Manager** *(In Development)*

---

## 🛠 Tech Stack

| Purpose               | Technology                                      |
|-----------------------|-------------------------------------------------|
| Frontend              | React + Vite                                    |
| Styling               | Tailwind CSS                                    |
| Backend / Auth / DB   | Firebase (Auth + Firestore)                     |
| AI Model              | Groq (`llama-3.3-70b-versatile`)                |
| Maps & Geocoding      | Google Maps API + `@react-google-maps/api`      |

---

## 📂 Project Structure

```plaintext
src/
├── pages/
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── Dashboard.jsx
│   └── group/
│       ├── GroupHome.jsx
│       ├── PreferencesForm.jsx
│       ├── AIPlan.jsx
│       └── MapsView.jsx
├── components/
│   └── ProtectedRoute.jsx
├── firebase/
│   └── firebase.js
└── utils/
    └── geocodePlace.js

git clone https://github.com/your-username/tripmosaic.git
cd tripmosaic
```
npm run dev
