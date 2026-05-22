# 🎯 Tech Interview Prep Tracker

A sleek, glassmorphic, local-first interactive dashboard designed to track Neetcode, System Design, and JavaScript/React preparation progress. Integrated with a GitHub Gist backup system for seamless, serverless cloud sync.

### 🔗 Live Application
**[sudheendrachari.github.io/interview-prep-tracker](https://sudheendrachari.github.io/interview-prep-tracker/)**

---

## ✨ Features

1. **Interactive Progress Dashboard**
   - Sleek dark mode visual cards showing completion stats for three key tracks: **Neetcode (Blind 75 & Neetcode 150)**, **System Design**, and **JavaScript/React**.
   - Aggregated display of total logged study hours for each track.
   - Radial progress indicators and celebration animations upon milestone completions.

2. **Daily Check-ins & Log History**
   - Log daily Neetcode practice, System Design topics, and JavaScript/React study details.
   - **Smart Autocomplete & Roadmap Sync:** Daily System Design logs feature a searchable combobox populated with 30 key roadmap topics. Logging a matched topic auto-checks it off on the roadmap; editing or clearing it checks if it is logged elsewhere before auto-unchecking.
   - Problem selections are localized to specific dates, ensuring previous days' progress cannot be accidentally altered.

3. **Commit Heatmap**
   - A GitHub-style daily commitment heatmap that displays consistency over time. 
   - Hovering on any date shows the count of problems solved on that specific day.

4. **GitHub Gist Sync (Cloud Backup)**
   - Secure and serverless backup. Provide a GitHub Personal Access Token (PAT) and Gist ID to sync your data back and forth from anywhere.
   - Automatically checks for Gist version conflicts on startup to prevent overwriting progress.

5. **Local-first Architecture**
   - Operates entirely on the browser using `localStorage`, running fast and privately even without cloud sync.

---

## 🛠️ Tech Stack & Design

- **Core:** HTML5, CSS3, Vanilla JavaScript.
- **Styling:** CSS variables, HSL-based color schemes, glassmorphic card design, and modern typography (Outfit/Inter).
- **Libraries:**
  - FontAwesome (icons)
  - Canvas Confetti (celebration animations)
- **Zero Build Tooling:** Simply open the `index.html` file or host it statically.

---

## 🚀 How to Run Locally

Since this is a fully client-side application, you can run it locally with any simple static file server.

### Option 1: VS Code Live Server
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Click the **Go Live** button in the bottom-right status bar.

### Option 2: Python HTTP Server
Run the following command in the project directory:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Option 3: Node.js (npx)
Run the following command in the project directory:
```bash
npx serve
```
Then visit the URL shown in the terminal.
