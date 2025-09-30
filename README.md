# 💰 Expense Tracker - Full Stack Application

A modern, full-stack Expense Tracker application built with **ASP.NET Core Web API** backend and **React** frontend. Manage your personal finances with ease, track expenses by categories, and gain insights into your spending habits.

![Expense Tracker](https://img.shields.io/badge/ASP.NET%20Core-8.0-purple?style=for-the-badge&logo=.net)
![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-red?style=for-the-badge&logo=microsoft-sql-server)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=json-web-tokens)

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based Authentication** - Secure login and registration
- **Password Hashing** - BCrypt for secure password storage
- **User-specific Data** - Each user sees only their own expenses
- **Protected Routes** - Automatic token management

### 💸 Expense Management
- **➕ Add Expenses** - Quick expense entry with categories
- **✏️ Edit Expenses** - Inline editing for quick updates
- **🗑️ Delete Expenses** - Safe deletion with confirmation
- **📊 Categorization** - Organize by Food, Travel, Shopping, Bills, etc.

### 🔍 Advanced Filtering & Search
- **📅 Date Range Filter** - Filter by specific time periods
- **💰 Amount Range** - Set min/max amount filters
- **🏷️ Category Filter** - Filter by expense categories
- **🔍 Real-time Search** - Instant search through expenses

### 🎨 User Experience
- **🌙 Dark Mode** - Toggle between light and dark themes
- **📱 Responsive Design** - Works perfectly on all devices
- **⚡ Real-time Updates** - Instant UI updates
- **📈 Expense Statistics** - Monthly totals and averages

## 🛠 Tech Stack

### Backend (ASP.NET Core Web API)
- **ASP.NET Core 8** - High-performance web framework
- **Entity Framework Core** - ORM with code-first migrations
- **SQL Server** - Robust database system
- **JWT Bearer Authentication** - Secure token-based auth
- **BCrypt.NET** - Password hashing library
- **Swagger/OpenAPI** - API documentation

### Frontend (React)
- **React 18** - Modern UI library with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Context API** - State management

## 🚀 Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup (ASP.NET Core API)

Navigate to the backend directory:
```bash
cd ExpenseTrackApi
```

#### Configure Database Connection
Update `appsettings.json` with your SQL Server connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ExpenseTrackerDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "SecretKey": "your-very-strong-secret-key-here-minimum-32-characters",
    "Issuer": "ExpenseTrackerAPI",
    "Audience": "ExpenseTrackerClient"
  }
}
```

#### Run Database Migrations
```bash
dotnet ef database update
```

#### Start the API
```bash
dotnet run
```
**API Server**: http://localhost:5237

### 3. Frontend Setup (React)

Open a new terminal and navigate to the frontend:
```bash
cd expense-tracker-frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```
**Frontend**: http://localhost:5173

## 📱 Application Screenshots

*(Add your screenshots here)*
- **Login Page** - Clean authentication interface
- **Dashboard** - Expense overview with statistics
- **Expense List** - Manage expenses with CRUD operations
- **Filter Panel** - Advanced filtering options

## 🔐 Authentication Flow

1. **Registration** → `/api/auth/register`
2. **Login** → `/api/auth/login` → Returns JWT token
3. **Token Storage** → Saved in browser's localStorage
4. **Automatic Auth** → Axios interceptor attaches token to requests
5. **Protected Access** → All expense endpoints require valid JWT

### API Endpoints

#### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

#### Expenses (Protected)
```http
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}
GET    /api/expenses/filter
```

#### Categories
```http
GET /api/categories
```

## 🗂 Project Structure

```
ExpenseTracker/
│
├── ExpenseTrackApi/                 # Backend (.NET Core 8)
│   ├── Controllers/                 # API Controllers
│   │   ├── AuthController.cs        # Authentication endpoints
│   │   ├── ExpensesController.cs    # Expense CRUD operations
│   │   └── CategoriesController.cs  # Category management
│   ├── Models/                      # Entity Models
│   │   ├── User.cs                  # User entity
│   │   ├── Expense.cs               # Expense entity
│   │   └── Category.cs              # Category entity
│   ├── Data/                        # Data Layer
│   │   ├── ApplicationDbContext.cs  # EF Core DbContext
│   │   └── SeedData.cs              # Database seeding
│   ├── Services/                    # Business Logic
│   │   └── AuthService.cs           # Authentication logic
│   └── Migrations/                  # EF Core Migrations
│
├── expense-tracker-frontend/        # Frontend (React)
│   ├── src/
│   │   ├── pages/                   # React Pages
│   │   │   ├── Login.jsx            # Login component
│   │   │   ├── Register.jsx         # Registration component
│   │   │   └── Expenses.jsx         # Main expenses dashboard
│   │   ├── components/              # Reusable Components
│   │   ├── api/                     # API Configuration
│   │   │   └── axios.js             # Axios instance with interceptors
│   │   └── App.jsx                  # Main app component with routing
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🧪 API Testing with Postman

### Register a New User
```http
POST http://localhost:5237/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "passwordHash": "securepassword123"
}
```

### User Login
```http
POST http://localhost:5237/api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

### Get User Expenses (Protected)
```http
GET http://localhost:5237/api/expenses
Authorization: Bearer <your-jwt-token>
```

### Add New Expense
```http
POST http://localhost:5237/api/expenses
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Groceries",
  "amount": 85.50,
  "categoryId": 1,
  "date": "2024-01-15"
}
```

## 🌟 Key Features in Detail

### Smart Expense Filtering
- **Multi-criteria filtering** - Combine category, date, and amount filters
- **Real-time search** - Instant filtering as you type
- **Backend & client-side filtering** - Optimized performance

### Secure Authentication
- **JWT tokens** - Stateless authentication
- **Automatic token refresh** - Seamless user experience
- **Password security** - BCrypt hashing with salt

### Responsive Design
- **Mobile-first approach** - Perfect on phones and tablets
- **Dark mode support** - Easy on the eyes
- **Accessible UI** - Proper contrast and keyboard navigation

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify SQL Server is running
   - Check connection string in `appsettings.json`
   - Ensure database exists or use `TrustServerCertificate=true`

2. **Migration Errors**
   ```bash
   dotnet ef migrations remove
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

3. **CORS Issues**
   - Ensure backend CORS is configured for frontend URL
   - Check `Program.cs` for CORS policy setup

4. **JWT Token Issues**
   - Verify secret key length (minimum 32 characters)
   - Check token expiration settings

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow C# and React best practices
- Include meaningful commit messages
- Update documentation for new features
- Add tests for new functionality

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ASP.NET Core team for the excellent web framework
- React team for the powerful UI library
- TailwindCSS for the utility-first CSS framework
- Contributors and testers who helped improve this application

---

<div align="center">

**Built with ❤️ using ASP.NET Core, React, and SQLite**

[Report Bug](https://github.com/your-username/expense-tracker/issues) · [Request Feature](https://github.com/your-username/expense-tracker/issues)

</div>
