# 🚀 NASA Near-Earth Object (NEO) Tracker – Backend

This is the backend server for the NASA NEO Tracker app. It uses **Node.js** and **Express** to fetch and serve Near-Earth Object data from [NASA's Open API](https://api.nasa.gov/).

The backend acts as a proxy between the React frontend and the NASA API, ensuring your API key is kept secure.

---

## 🔗 Live API Endpoint (Dev Mode)

```
GET http://localhost:5000/api/neos?date=YYYY-MM-DD
```

- `date` (optional): in `YYYY-MM-DD` format. Defaults to today's date if not provided.
- Returns an array of near-Earth objects (asteroids) for the specified date.

---

## 📦 Tech Stack

- Node.js
- Express.js
- Axios
- dotenv
- CORS

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/nasa-neo-tracker.git
cd nasa-neo-tracker/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

In the `backend` folder, create a file named `.env` and add your NASA API key:

```
NASA_API_KEY=your_actual_api_key
```

Get a free key from: [https://api.nasa.gov](https://api.nasa.gov)

### 4. Run the Server

```bash
node server.js
```

Server runs at:  
```
http://localhost:5000
```

---

## 🧪 Example Response

```
GET http://localhost:5000/api/neos?date=2025-06-18
```

```json
[
  {
    "name": "2025 AB",
    "is_potentially_hazardous_asteroid": false,
    "estimated_diameter": {...},
    "close_approach_data": [
      {
        "close_approach_date": "2025-06-18",
        "relative_velocity": {...},
        "miss_distance": {...}
      }
    ]
  },
  ...
]
```

---

## 📁 File Structure

```
backend/
├── server.js         # Main Express server file
├── .env              # API Key (not committed)
├── .gitignore        # Ignore node_modules and .env
└── README.md
```

---

## 🛡️ Notes

- API key is stored securely in `.env`
- Proper error handling included for API failures
- CORS enabled for React frontend connection

---

## 📬 Future Enhancements

- Caching data to reduce API usage
- Input validation and sanitization
- Unit tests with Jest

---

## 👨‍🚀 Author

Built with 💫 by [Your Name](https://github.com/YOUR_USERNAME)

---

## 📄 License

MIT License
