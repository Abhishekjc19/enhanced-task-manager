# Enhanced MERN Task Manager

A comprehensive MERN stack task management application with advanced features, enhanced security, and modern UI/UX.

![Task Manager Dashboard](https://user-images.githubusercontent.com/86913048/227101123-f8a35258-9c21-4479-86e8-055659ab75e2.png)

## 🚀 New Features & Improvements

### ✨ Enhanced Task Management
- **Rich Task Properties**: Title, description, status, priority, category, due date, and tags
- **Advanced Filtering**: Filter by status, priority, category, and search functionality
- **Task Statistics**: Real-time dashboard with task counts, overdue tasks, and completion rates
- **Quick Actions**: One-click status changes and task completion
- **Visual Indicators**: Color-coded priorities, overdue warnings, and status badges

### 🔒 Security Enhancements
- **Rate Limiting**: Protection against brute force attacks
- **Helmet.js**: Security headers and XSS protection
- **Enhanced Validation**: Comprehensive input validation on both frontend and backend
- **Password Security**: Strong password requirements with bcrypt hashing
- **CORS Configuration**: Proper cross-origin resource sharing setup

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Enhanced task cards with hover effects
- **Real-time Updates**: Instant feedback for user actions
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and validation feedback

### 📊 Advanced Features
- **Pagination**: Efficient handling of large task lists
- **Search Functionality**: Full-text search across titles, descriptions, and tags
- **Date Management**: Due date picker with overdue detection
- **Tag System**: Flexible tagging for better organization
- **Statistics Dashboard**: Visual representation of task metrics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React DatePicker** - Date selection component
- **Axios** - HTTP client
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

## 📋 Features

### User Features
- 🔐 **Authentication**: Secure signup, login, and logout
- 📝 **Task Management**: Create, read, update, and delete tasks
- 🏷️ **Task Organization**: Categorize tasks with priorities and tags
- 📅 **Due Date Management**: Set and track task deadlines
- 🔍 **Advanced Search**: Search across task content and tags
- 📊 **Task Analytics**: View task statistics and progress
- 📱 **Responsive Design**: Works seamlessly on all devices

### Developer Features
- 🛡️ **Security**: Comprehensive security measures
- ✅ **Validation**: Multi-layer validation (frontend + backend)
- 🎯 **Error Handling**: Graceful error handling and user feedback
- 🔄 **State Management**: Centralized state with Redux
- 📦 **Modular Architecture**: Clean, maintainable code structure
- 🧪 **Testing Ready**: Structured for easy testing implementation
- 📚 **Documentation**: Comprehensive API documentation

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MERN-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env file)
   MONGODB_URL=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_secret_key
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/signup     - Register new user
POST   /api/auth/login      - User login
GET    /api/profile         - Get user profile
```

### Task Endpoints
```
GET    /api/tasks           - Get all tasks (with filters)
GET    /api/tasks/stats     - Get task statistics
GET    /api/tasks/:id       - Get single task
POST   /api/tasks           - Create new task
PUT    /api/tasks/:id       - Update task
DELETE /api/tasks/:id       - Delete task
```

### Query Parameters
- `status` - Filter by task status
- `priority` - Filter by priority level
- `category` - Filter by category
- `search` - Search in title, description, and tags
- `page` - Page number for pagination
- `limit` - Items per page
- `sortBy` - Sort field (createdAt, dueDate, priority)
- `sortOrder` - Sort direction (asc, desc)

## 🎯 Usage Examples

### Creating a Task
```javascript
const taskData = {
  title: "Complete Project Documentation",
  description: "Write comprehensive documentation for the new feature",
  priority: "high",
  category: "work",
  dueDate: "2024-01-15",
  tags: ["documentation", "project"]
};
```

### Filtering Tasks
```javascript
// Get high priority work tasks
GET /api/tasks?priority=high&category=work

// Search for tasks containing "meeting"
GET /api/tasks?search=meeting

// Get overdue tasks
GET /api/tasks?status=pending&dueDate[lt]=2024-01-01
```

## 🔧 Development Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run dev-server       # Start only backend
npm run dev-client       # Start only frontend
npm run install-all      # Install all dependencies

# Frontend
npm start                # Start development server
npm run build            # Build for production
npm test                 # Run tests

# Backend
npm run dev              # Start with nodemon
npm start                # Start production server
```

## 🏗️ Project Structure

```
MERN-task-manager/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── app.js          # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # State management
│   │   ├── hooks/       # Custom hooks
│   │   └── validations/ # Form validations
│   └── public/          # Static assets
└── README.md
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation on all inputs
- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for production and development
- **Security Headers**: Helmet.js for additional security
- **SQL Injection Protection**: Mongoose ODM protection
- **XSS Protection**: Input sanitization and output encoding

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Theme switching capability
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback
- **Interactive Elements**: Hover effects and transitions
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient handling of large datasets
- **Lazy Loading**: Components loaded on demand
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for responses
- **CDN Ready**: Optimized for content delivery networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.



## 🙏 Acknowledgments

- React.js community for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Express.js for the robust backend framework

---

**⭐ Star this repository if you found it helpful!**
