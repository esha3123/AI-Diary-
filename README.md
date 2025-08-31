# 📖 AI-Diary

> A sophisticated personal journaling application that combines traditional diary writing with cutting-edge AI technology, featuring Hinglish AI insights and Bollywood-style personality responses.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

## 🌟 Features

### 🧠 AI-Powered Insights
- **Hinglish Responses**: Natural Hindi-English code-mixing with cultural context
- **Bollywood Personality**: AI responds with filmy references and desi expressions
- **Multiple Insight Types**: General analysis, mood tracking, growth opportunities, and deep reflection
- **Google Gemini Integration**: Powered by Google's advanced Gemini 1.5 Flash API

### 📝 Diary Management
- **CRUD Operations**: Create, read, update, and delete diary entries
- **Mood Tracking**: Select from 6 mood emojis (😂, 😀, 🤗, 😤, 😔, 😰)
- **Privacy Controls**: Toggle between public and private entries
- **Rich Content**: Write detailed entries with titles and content

### 🎭 Text-to-Speech
- **Filmy Voiceovers**: Bollywood-style dramatic narration
- **Multi-language Support**: Hindi and English voice synthesis
- **Custom Narration**: Adds dramatic intro/outro to diary entries
- **Browser-based**: Uses Web Speech API for seamless integration

### 🌐 Social Features
- **Public Feed**: Browse and discover public diary entries from other users
- **Like System**: Like/unlike entries with IP-based tracking
- **Comments**: Engage with community through comments
- **User Profiles**: Personalized user profiles and statistics

### 🎨 Modern UI/UX
- **Responsive Design**: Bootstrap 5 with custom styling
- **Animated Interface**: Particle backgrounds and smooth transitions
- **Mobile Optimized**: Fully responsive across all devices
- **Accessibility**: Screen reader and keyboard navigation support

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/esha3123/AI-Diary-.git
   cd AI-Diary-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Google Gemini Configuration
   GEMINI_API_KEY=your_actual_gemini_api_key_here

   # Session Configuration  
   SESSION_SECRET=your_secure_session_secret

   # Database Configuration
   MONGODB_URL=mongodb://127.0.0.1:27017/Dear-diary
   MONGO_DB_ATLAS=your_mongodb_atlas_connection_string

   # Application Environment
   NODE_ENV=development
   PORT=5000
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and go to `http://localhost:5000`

## 🏗️ Project Structure

```
AI-Diary/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── render.yaml           # Deployment configuration
├── controllers/          # Route controllers
│   ├── comment.js
│   ├── entries.js
│   └── user.js
├── models/               # Database models
│   ├── comment.js
│   ├── schema.js         # Diary entries model
│   └── user.js
├── routes/               # Express routes
│   ├── comment.js
│   ├── entries.js
│   ├── insights.js       # AI insights endpoints
│   ├── tts.js           # Text-to-speech endpoints
│   └── user.js
├── views/                # EJS templates
│   ├── diary/           # Main app views
│   ├── includes/        # Partial templates
│   ├── layouts/         # Layout templates
│   └── users/           # Authentication views
├── public/               # Static assets
│   ├── CSS/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   ├── images/          # Images and assets
│   └── audio/           # Audio files
└── utils/                # Utility functions
    ├── ExpressError.js
    ├── middleware.js
    ├── mockTTS.js
    └── wrapAsync.js
```

## 📊 API Endpoints

### Authentication
- `GET /AI-diary/signup` - User registration page
- `POST /AI-diary/signup` - Create new user account
- `GET /AI-diary/login` - User login page
- `POST /AI-diary/login` - Authenticate user
- `GET /AI-diary/logout` - Logout user

### Diary Entries
- `GET /AI-diary` - View all user's entries
- `GET /AI-diary/new` - New entry form
- `POST /AI-diary` - Create new entry
- `GET /AI-diary/:id` - View specific entry
- `GET /AI-diary/:id/edit` - Edit entry form
- `PUT /AI-diary/:id` - Update entry
- `DELETE /AI-diary/:id` - Delete entry

### AI Features
- `POST /insights/general` - Get general AI insights
- `POST /insights/mood` - Get mood analysis
- `POST /insights/growth` - Get growth opportunities
- `POST /insights/deep` - Get deep reflection questions
- `POST /tts/speak` - Text-to-speech conversion

### Social Features
- `GET /AI-diary/public` - Public diary feed
- `POST /AI-diary/:id/like` - Like/unlike entry
- `POST /AI-diary/:id/comment` - Add comment

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **EJS** - Template engine

### Frontend
- **Bootstrap 5** - CSS framework
- **Vanilla JavaScript** - Client-side scripting
- **Font Awesome** - Icons
- **Custom CSS** - Styling and animations

### AI & APIs
- **Google Gemini API** - AI insights generation
- **Web Speech API** - Text-to-speech functionality

### Development Tools
- **Nodemon** - Development server
- **Method-Override** - HTTP method support
- **Connect-Flash** - Flash messaging
- **Express-Session** - Session management

## 🎯 Key Features Detail

### AI Insights Examples

**General Insight (Hinglish Style):**
```
"Yaar, tumhare thoughts mein jo depth hai na, that's really impressive! 
Bollywood ke hero ki tarah tumne apni feelings express ki hai. 
Keep writing, yeh journey beautiful hai! ✨"
```

**Mood Analysis:**
```
"Dekho bhai, aaj thoda low feel kar rahe ho, but that's totally normal. 
Jaise SRK kehta hai - 'Haar ke jeetne wale ko baazigar kehte hain!' 
Tomorrow will be better, trust the process! 🌟"
```

### TTS Narration Style
The AI adds dramatic Bollywood-style introductions and conclusions to diary entries, making the experience more engaging and culturally relevant.

## 🚀 Deployment

### Render.com Deployment
The project includes a `render.yaml` configuration file for easy deployment on Render.com:

```yaml
services:
  - type: web
    name: ai-diary
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node app.js
    envVars:
      - key: NODE_ENV
        value: production
```

### Environment Variables for Production
Make sure to set all required environment variables in your deployment platform:
- `GEMINI_API_KEY`
- `SESSION_SECRET`
- `MONGO_DB_ATLAS`
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Nitin** - Developer
- **Esha** - Developer

## 🙏 Acknowledgments

- Google Gemini AI for providing advanced AI capabilities
- Bootstrap team for the excellent CSS framework
- MongoDB team for the robust database solution
- The open-source community for various packages and tools

## 📞 Support

If you have any questions or need help with setup, please feel free to open an issue or contact the maintainers.

---

<div align="center">
  <h3>🌟 Star this repo if you found it helpful! 🌟</h3>
  <p>Made with ❤️ and lots of ☕ by Nitin & Esha</p>
</div>
