# UBW Blog Backend - Database Redesign

## Database Structure

### Collections

#### 1. Users Collection

- **username**: String (unique, required, 3-30 characters)
- **email**: String (unique, required, lowercase)
- **password**: String (hashed with bcrypt, required, min 6 characters)
- **role**: String (enum: 'user', 'admin', default: 'user')
- **createdAt**: Date (auto-generated)

#### 2. Blogs Collection

- **title**: String (required)
- **blogDescription**: String (required)
- **author**: ObjectId (references User, required)
- **authorDescription**: String
- **category**: String (required)
- **imgCaption**: String
- **coverImage**: Object (data: Buffer, contentType: String)
- **createdAt**: Date (auto-generated)

## Environment Variables

Create a `.env` file in the root directory with:

```
MONGODB_URI=mongodb://localhost:27017/ubw_blog
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
NODE_ENV=development
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)
- `GET /users` - Get all users (admin only)
- `PUT /users/:userId/role` - Update user role (admin only)

### Blog Routes (`/api`)

- `GET /blogs` - Get all blogs (public)
- `GET /blogs/:id` - Get blog by ID (public)
- `POST /post-blog` - Create new blog (protected)
- `PUT /blogs/:id` - Update blog (author or admin only)
- `DELETE /blogs/:id` - Delete blog (author or admin only)

## User Roles

- **user**: Can create, edit, and delete their own blogs
- **admin**: Can manage all blogs and users

## Installation

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start the server: `npm run server`

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```
