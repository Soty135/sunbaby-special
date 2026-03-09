# Sunbaby Special Food Ordering App

A comprehensive food ordering website built with React (JavaScript) that connects customers to WhatsApp Business for placing orders. Features responsive design across all device sizes and includes a full admin dashboard for menu management.

## Features

### Customer Features
- 🏠 **Home Page**: Services showcase with WhatsApp Business CTA
- ℹ️ **About Page**: Founder information, mission, and vision
- 🍽️ **Menu Page**: Browse food items with categories and add-to-cart
- 🛒 **Cart Page**: Manage quantities and view totals
- 🖼️ **Gallery Page**: View food photos and videos
- 📱 **WhatsApp Integration**: Direct order placement via WhatsApp Business

### Admin Features
- 🔐 **Secure Admin Login**: JWT-based authentication
- 📊 **Admin Dashboard**: Full CRUD operations for menu items
- 🎬 **Gallery Management**: Upload and manage media content
- 📦 **Order Management**: Track and manage customer orders

## Technology Stack

### Frontend
- **React** with **Vite** (fast build tool)
- **React Router** for navigation
- **Tailwind CSS** for responsive design
- **Axios** for API calls
- **React Context** for state management

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

## Project Structure

```
sunbaby-food-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   └── utils/         # Helper functions
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth and validation middleware
│   ├── controllers/      # Business logic
│   └── uploads/          # Media file storage
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB installed and running
- Git

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd sunbaby-food-app

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sunbaby-food-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
UPLOAD_PATH=./uploads
```

### 3. Start the Application

```bash
# Start the backend server (from server directory)
cd server
npm run dev

# Start the frontend (from client directory)
cd ../client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Menu Management
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/menu` - Create menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:menuItemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Gallery Management
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery/upload` - Upload media (admin only)
- `PUT /api/gallery/:id` - Update gallery item (admin only)
- `DELETE /api/gallery/:id` - Delete gallery item (admin only)

## Database Schema

### Users
- id, name, email, passwordHash, role (admin/customer)

### Menu Items
- id, name, description, price, category, availability, imageURL

### Cart
- id, userId, items (array with menuItemId, quantity, price), totalAmount

### Gallery
- id, title, description, mediaURL, mediaType (image/video), uploadDate, uploadedBy

## WhatsApp Integration

Orders are sent directly to WhatsApp Business with:
- Complete order details
- Item quantities and prices
- Total amount
- Customer contact information

**Note**: Replace the placeholder phone number in the code with your actual WhatsApp Business number.

## Admin Access

### Default Admin Credentials
- Email: admin@sunbaby.com
- Password: admin123

### Or Create Admin via API
```bash
POST /api/auth/register
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "admin"
}
```

## Responsive Design

The application is fully responsive with:
- **Mobile-first** approach
- **Tailwind CSS** breakpoints
- Touch-friendly interfaces
- Optimized layouts for all screen sizes

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration

## Development Scripts

```bash
# Client scripts (from client directory)
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Server scripts (from server directory)
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## Production Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use secure JWT secrets
- Configure production MongoDB connection string
- Set up file storage for uploads

### Build and Deploy
```bash
# Build client
cd client
npm run build

# Start server in production mode
cd ../server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For any issues or questions:
- Check the API documentation
- Review the error logs
- Ensure MongoDB is running
- Verify environment variables

## License

This project is licensed under the MIT License.