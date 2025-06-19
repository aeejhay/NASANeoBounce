# 🛰️ NASA NEO Tracker

A full-stack web application for monitoring Near-Earth Objects (NEOs) using NASA's NeoWs API. Built with React frontend and Node.js/Express backend.

![NASA NEO Tracker](https://img.shields.io/badge/NASA-NEO%20Tracker-blue?style=for-the-badge&logo=nasa)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)

## 🌟 Features

### 🛰️ Backend (Node.js/Express)
- **NASA NEO API Integration**: Fetches real-time asteroid data from NASA's NeoWs API
- **Date-based Queries**: Accept optional date parameters (YYYY-MM-DD format)
- **Data Processing**: Filters and processes asteroid information
- **Historical Data**: Provides 7-day historical asteroid tracking
- **CORS Enabled**: Allows frontend connectivity
- **Environment Configuration**: Secure API key management with dotenv

### 🌍 Frontend (React)
- **Live Asteroid Dashboard**: Real-time display of current NEOs
- **Interactive Charts**: Bar charts for velocity, distance, and diameter using Recharts
- **Date Picker**: Select any date to explore past/future NEOs
- **Hazard Widget**: Real-time hazard assessment and alerts
- **Historical Tracker**: 7-day historical data with trend analysis
- **Quiz Game**: Interactive educational quiz about asteroids
- **Responsive Design**: Mobile-friendly layout with modern UI

### 📊 Key Components
- **Asteroid List**: Sortable table with detailed asteroid information
- **Analytics Charts**: Visual representation of asteroid data
- **Hazard Assessment**: Real-time monitoring of potentially hazardous asteroids
- **Historical Analysis**: Trend tracking and comparison tools
- **Educational Quiz**: Fun learning experience about NEOs

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- NASA API key (free from [api.nasa.gov](https://api.nasa.gov/))

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nasa-neo-bounce
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
NASA_API_KEY=your_nasa_api_key_here
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Start the Application

**Option 1: Run both simultaneously**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

**Option 2: Development mode with auto-restart**
```bash
# Terminal 1 - Backend (with nodemon)
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 5. Access the Application
- Frontend: http://localhost:3000 / https://nasa-neo-bounce.vercel.app/ via Vercel
- Backend API: http://localhost:5000 / https://nasaneobounce.onrender.com via Render

## 📁 Project Structure

```
nasa-neo-bounce/
├── backend/
│   ├── server.js              # Express server with NEO API endpoints
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AsteroidDashboard.js    # Main dashboard component
│   │   │   ├── AsteroidList.js         # Asteroid table component
│   │   │   ├── AsteroidChart.js        # Chart visualization
│   │   │   ├── HazardWidget.js         # Hazard assessment widget
│   │   │   ├── HistoricalTracker.js    # Historical data component
│   │   │   ├── QuizGame.js             # Interactive quiz component
│   │   │   └── *.css                   # Component-specific styles
│   │   ├── App.js                      # Main app with routing
│   │   ├── App.css                     # Global styles
│   │   └── index.js                    # React entry point
│   └── package.json                    # Frontend dependencies
└── README.md                          # This file
```

## 🔧 API Endpoints

### Backend Routes
- `GET /api/neos?date=YYYY-MM-DD` - Get asteroids for specific date
- `GET /api/neos/historical` - Get 7-day historical data
- `GET /api/health` - Health check endpoint

### Example API Response
```json
{
  "date": "2024-01-15",
  "count": 5,
  "asteroids": [
    {
      "id": "123456",
      "name": "(2024 AB)",
      "isHazardous": false,
      "distance": {
        "kilometers": 1500000,
        "lunar": 3.9
      },
      "diameter": {
        "min": 0.5,
        "max": 1.2
      },
      "velocity": 25000,
      "closeApproachDate": "2024-01-15",
      "orbitingBody": "Earth"
    }
  ]
}
```

## 🎨 Features in Detail

### Live Dashboard
- Real-time asteroid count and statistics
- Interactive date picker for historical exploration
- Visual charts showing velocity, distance, and diameter distributions
- Hazard assessment with color-coded alerts

### Historical Tracker
- 7-day historical data visualization
- Trend analysis with line and bar charts
- Statistical summaries and comparisons
- Daily breakdown of asteroid activity

### Hazard Widget
- Real-time hazard level assessment
- Potentially hazardous asteroid identification
- Alert simulation system
- Educational information about NEO classification

### Quiz Game
- Dynamic questions based on current asteroid data
- Multiple choice format with explanations
- Score tracking and performance feedback
- Educational content about NEOs

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - UI framework
- **React Router** - Navigation and routing
- **Recharts** - Data visualization
- **React DatePicker** - Date selection
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for NASA API
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### APIs
- **NASA NeoWs API** - Near Earth Object data
- **NASA API Key** - Authentication (free registration required)

## 🔒 Security

- NASA API key stored in environment variables
- CORS configured for frontend-backend communication
- Input validation and error handling
- Secure data processing and sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎯 Future Enhancements

- [ ] Email/SMS notifications for hazardous asteroids
- [ ] User accounts and personalized tracking
- [ ] Advanced filtering and search capabilities
- [ ] 3D visualization of asteroid orbits
- [ ] Social sharing features
- [ ] Dark/light theme toggle
- [ ] Offline data caching
- [ ] Progressive Web App (PWA) features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for providing the NeoWs API
- **JPL** (Jet Propulsion Laboratory) for NEO data
- **React** and **Node.js** communities for excellent documentation
- **Recharts** for beautiful chart components

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/aeejhay/issues) page
2. Create a new issue with detailed information
3. Include your Node.js version and operating system

## 🔗 Useful Links

- [NASA NeoWs API Documentation](https://api.nasa.gov/neo/)
- [NASA NEO Database](https://cneos.jpl.nasa.gov/)
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)

---

**Built with ❤️ for space exploration and education**


