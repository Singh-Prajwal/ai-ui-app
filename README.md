# 🧠 AI Interview Bot – Fullstack App

An intelligent, adaptive AI Interviewer that simulates job interviews by asking personalized questions, analyzing candidate responses, and generating detailed feedback. Built using **Next.js** for both frontend and backend, and a **Flask** microservice for resume parsing. Interview data is stored on **Supabase**.  

🌐 **Live App**: [https://ai-ui-app.vercel.app](https://ai-ui-app.vercel.app)  
🎥 **Demo Video**: [Watch here](https://drive.google.com/file/d/1pW4Yk5aH_kSRxAgPGKAoTajue8MNEIxJ/view)

---

## 🛠 Tech Stack

### Frontend & Backend (Monorepo)
- [Next.js 14](https://nextjs.org/) (App Router)
- Tailwind CSS
- OpenAI API (free tier for question & feedback generation)
- Supabase (DB + Auth)
- Fetch

### Resume Parsing Microservice
- [Python Flask](https://flask.palletsprojects.com/)
- `PyPDF2` for resume text extraction

---

## 🧩 Features

✅ Upload resume & job description  
✅ AI asks personalized questions in a chat interface  
✅ Adaptive question flow based on previous answers  
✅ Interview auto-completes intelligently (no button press needed)  
✅ Flask API parses the resume to extract relevant information  
✅ OpenAI (GPT) used to:
- Generate questions from resume + JD
- Analyze responses and generate final feedback  
✅ Stores:
- Full interview transcript
- Candidate name
- Final feedback in Supabase

---

## 📂 Repositories

- **Frontend & Backend (Next.js)**: [https://github.com/Singh-Prajwal/ai-ui-app](https://github.com/Singh-Prajwal/ai-ui-app)  
- **Resume Parsing API (Flask)**: [https://github.com/Singh-Prajwal/ai-flask-app](https://github.com/Singh-Prajwal/ai-flask-app)

---

## 🚧 Missing Features (Planned)

- 🔊 Text-to-Speech (AI speaks the questions)
- 🎙️ Speech-to-Text (User can respond via voice)

---

## ⚠️ Notes

- This project currently uses **OpenAI's free-tier API**, which has token and usage limits. If the API fails during testing due to auth or quota issues, feel free to contact me — I’ll refresh the API key promptly.

---

## 🧪 Running Locally

### 1. Clone both repositories:

```bash
git clone https://github.com/Singh-Prajwal/ai-ui-app
git clone https://github.com/Singh-Prajwal/ai-flask-app
```
### 2. Set up environment variables:
For Next.js app (ai-ui-app), create a .env.local file:
    
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
    
### 3. Start the Flask backend:
```bash
cd ai-flask-app
pip install -r requirements.txt
python app.py
```

### 4. Start the Next.js frontend:
```bash
cd ai-ui-app
npm install
npm run dev
```