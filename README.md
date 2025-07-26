# 🚀 MERN Live Chat Application

A modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring dark mode, comprehensive user management, and real-time messaging capabilities.

![Live Chat App](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)

## ✨ Features

### 🎨 **User Interface**
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Real-time Updates** - Live message delivery and online status indicators

### 👤 **User Management**
- **User Authentication** - Secure signup/login with JWT tokens
- **Profile Management** - Edit profile information, upload avatars
- **Account Settings** - Comprehensive settings panel with privacy controls
- **Password Management** - Secure password change functionality

### 💬 **Chat Features**
- **Real-time Messaging** - Instant message delivery using Socket.io
- **User Search** - Find and connect with other users
- **Online Status** - See who's currently online
- **Message History** - View and manage conversation history
- **Image Sharing** - Send and receive images in conversations

### ⚙️ **Settings & Customization**
- **Theme Preferences** - Light, dark, or system theme
- **Notification Settings** - Customize push notifications and sounds
- **Privacy Controls** - Manage profile visibility and online status
- **Language Support** - Multiple language options
- **Data Management** - Export data and clear chat history

### 🔒 **Security & Privacy**
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - Bcrypt password hashing
- **Input Validation** - Comprehensive form validation
- **XSS Protection** - Built-in security measures

## 🛠️ Tech Stack

### **Frontend**
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time communication
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/noblex1/mern-live-chat-app.git
cd mern-live-chat-app
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### **3. Frontend Setup**
```bash
cd ../chat-frontend
npm install
```

### **4. Start the Application**

**Start Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Start Frontend (Terminal 2):**
```bash
cd chat-frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🚀 Usage

### **Getting Started**
1. **Sign Up** - Create a new account with email and password
2. **Login** - Access your account
3. **Customize Profile** - Add avatar, bio, and personal information
4. **Find Users** - Search and connect with other users
5. **Start Chatting** - Send messages and images in real-time

### **Features Guide**

#### **Dark Mode**
- Toggle between light and dark themes
- Automatic system preference detection
- Persistent theme selection

#### **Profile Management**
- Upload profile pictures
- Edit personal information
- Manage privacy settings
- Update account preferences

#### **Chat Interface**
- Real-time message delivery
- Online status indicators
- User search and filtering
- Image sharing capabilities

#### **Settings Panel**
- **Account**: Password change, account deletion
- **Privacy**: Profile visibility, online status
- **Notifications**: Push notifications, sound effects
- **Appearance**: Theme, language, font size
- **Data**: Export data, clear history

## 📁 Project Structure

```
live-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── .env
├── chat-frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### **Environment Variables**

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/live-chat-app
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### **Database Setup**
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `live-chat-app`
3. Update the `MONGODB_URI` in your `.env` file

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to your preferred platform
3. Update API endpoints to production URLs

### **Backend Deployment (Heroku/Railway)**
1. Set environment variables in your hosting platform
2. Deploy the backend code
3. Update CORS settings for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.io** - For real-time communication
- **Tailwind CSS** - For the beautiful UI components
- **Lucide React** - For the amazing icons
- **React Hot Toast** - For the toast notifications

## 📞 Support

If you have any questions or need help with the application, please:

1. Check the [Issues](https://github.com/noblex1/mern-live-chat-app/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainers

---

**Made by Sharif Iddrisu**

⭐ **Star this repository if you found it helpful!** 
