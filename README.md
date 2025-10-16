# Hotel Booking SaaS Platform

A full-stack hotel booking SaaS application built with MERN stack and integrated with [LiteAPI](https://docs.liteapi.travel/).

## 🏗️ Project Structure

```
book-your-hotel/
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── config/       # Database and other configurations
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── services/     # Business logic & external APIs
│   │   └── utils/        # Utility functions
│   ├── .env              # Environment variables
│   ├── .env.example      # Environment variables template
│   ├── package.json
│   └── server.js         # Entry point
│
├── frontned/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   └── ui/       # Shadcn UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   ├── lib/          # Libraries (utils for Shadcn)
│   │   ├── App.jsx       # Main App component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles (Tailwind)
│   ├── .env              # Environment variables
│   ├── .env.example      # Environment variables template
│   ├── package.json
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── components.json   # Shadcn UI configuration
│
└── postman/              # Postman collection for API testing
```

## 🚀 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **Axios** - HTTP client for LiteAPI
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Morgan** - HTTP request logger

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **React Router** - Routing
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- LiteAPI Key ([Get one here](https://www.liteapi.travel/))

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd book-your-hotel
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your configurations:
# - MONGODB_URI
# - LITEAPI_KEY
# - etc.
```

### 3. Frontend Setup

```bash
cd frontned
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your configurations:
# - VITE_API_URL
# - VITE_LITEAPI_KEY (if needed)
```

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontned
npm run dev
```
Frontend runs on: http://localhost:5173

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontned
npm run build
npm run preview
```

## 🔌 API Endpoints (To be implemented)

### Hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels/availability` - Check availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id` - Cancel booking

## 🎨 Adding Shadcn UI Components

To add Shadcn UI components to your project:

```bash
cd frontned

# Example: Add button component
npx shadcn@latest add button

# Add card component
npx shadcn@latest add card

# Add input component
npx shadcn@latest add input
```

Components will be added to `src/components/ui/`

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hotel-booking-saas
FRONTEND_URL=http://localhost:5173
LITEAPI_KEY=your_liteapi_key_here
LITEAPI_BASE_URL=https://api.liteapi.travel/v3.0
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_LITEAPI_KEY=your_liteapi_key_here
```

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:3000/health
```

## 📚 LiteAPI Documentation

- [LiteAPI Docs](https://docs.liteapi.travel/)
- [API Reference](https://docs.liteapi.travel/reference)

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Your Name

---

**Note:** This is a starter template with folder structure in place. Controllers, routes, models, and components need to be implemented based on your requirements.
