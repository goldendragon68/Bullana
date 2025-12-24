# Bullana Bet

Bullana Bet is a comprehensive betting platform featuring multiple games including Roulette, Dice, Mines, Plinko, Sword, Cave of Plunder, Wheel of Fortune, Coinflip, and more. The platform includes user wallet management, cryptocurrency integration, and a robust admin dashboard.

## Project Overview

- **Frontend**: React-based user interface
- **Backend**: Node.js/Express API server
- **Admin Dashboard**: Angular-based administration panel
- **Database**: MongoDB for data persistence
- **Features**: Multiple games, crypto wallet integration, user management, VIP levels

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bull
```

2. Install dependencies for each component:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin dashboard dependencies
cd ../admin
npm install --legacy-peer-deps

```

## Available Scripts

### General

```bash
# Database seed
npm run db:seed

# Run backend, frontend and admin server
npm run dev
```


### Backend (`/backend` directory)

```bash
# Start the backend server
npm start

# Run in development mode
npm run dev
```

The backend server will be available at `http://localhost:5000`

### Frontend (`/frontend` directory)

```bash
# Start the frontend development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:3000`

### Admin Dashboard (`/admin` directory)

```bash
# Start the admin dashboard
npm start

# Build for production
ng build
```

The admin dashboard will be available at `http://localhost:4200`

## Features

- **Multiple Games**:
  - Roulette
  - Dice
  - Mines
  - Plinko
  - Sword
  - Cave of Plunder
  - Wheel of Fortune
  - Coinflip
  - Limbo
  - Keno

- **User Management**:
  - Authentication
  - Wallet management
  - Betting history
  - VIP levels
  - Referral system

- **Admin Features**:
  - User management
  - Transaction monitoring
  - Game statistics
  - Support ticket system
  - Site settings management

- **Security**:
  - IP blocking
  - Encryption
  - Secure wallet transactions
  - Login attempt monitoring

## Configuration

- Environment configurations are available in:
  - Backend: `/backend/config`
  - Frontend: `/frontend/src/environments`
  - Admin: `/admin/src/environments`

## Support

For support issues:
1. Check the documentation in `PRODUCTION_TESTING_GUIDE.md`
2. Use the support ticket system in the admin dashboard
3. Contact the development team

## License

This project is proprietary software. All rights reserved.