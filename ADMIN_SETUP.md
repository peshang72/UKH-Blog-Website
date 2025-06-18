# Admin Panel Setup and Usage

This document explains how to set up and use the admin functionality for the UBW Blog System.

## Features Added

### Admin Features

- **Admin Login**: Separate login portal for administrators
- **Blog Approval System**: Admins can approve or reject pending blog posts
- **Blog Management Dashboard**: View all blogs with status filtering
- **Full Blog Preview**: Admins can view complete blog content before making decisions
- **Blog Deletion**: Admins can permanently delete any blog post
- **Rejection Reasons**: Admins can provide feedback when rejecting blogs

### User Features

- **Blog Status Tracking**: Users can view the status of their submitted blogs
- **Approval Notifications**: Clear indication when blogs are pending, approved, or rejected
- **Rejection Feedback**: Users can see why their blogs were rejected

## Setup Instructions

### 1. Create Admin User

Before using the admin functionality, you need to create an admin user:

```bash
npm run create-admin
```

This will create an admin user with the following credentials:

- **Email**: admin@ukh.edu.krd
- **Password**: admin123

**Important**: Change these credentials after first login for security.

### 2. Database Changes

The blog schema has been updated to include approval workflow fields:

- `status`: "pending" | "approved" | "rejected" (default: "pending")
- `reviewedBy`: Reference to the admin who reviewed the blog
- `reviewedAt`: Timestamp of when the blog was reviewed
- `rejectionReason`: Reason provided when rejecting a blog

### 3. New API Endpoints

#### Admin Endpoints

- `GET /api/admin/blogs/pending` - Get all pending blogs (admin only)
- `GET /api/admin/blogs` - Get all blogs with optional status filter (admin only)
- `PUT /api/admin/blogs/:id/approve` - Approve a blog (admin only)
- `PUT /api/admin/blogs/:id/reject` - Reject a blog with reason (admin only)
- `DELETE /api/admin/blogs/:id` - Delete any blog permanently (admin only)

#### User Endpoints

- `GET /api/user/blogs` - Get current user's blogs with status

## Usage Guide

### For Administrators

1. **Access Admin Panel**

   - Go to `/admin/login`
   - Login with admin credentials
   - You'll be redirected to the admin dashboard

2. **Review Pending Blogs**

   - The dashboard shows statistics of all blog statuses
   - Click on "Pending Blogs" tab to see blogs awaiting review
   - Each blog shows title, description, author, and creation date
   - Click "View" button to see the full blog content, images, and formatting

3. **Approve Blogs**

   - Click the "Approve" button on any pending blog
   - The blog will be published and visible to all users
   - The blog status changes to "approved"

4. **Reject Blogs**

   - Click the "Reject" button on any pending blog
   - Provide a reason for rejection in the modal
   - The author will be able to see this feedback
   - The blog status changes to "rejected"

5. **View All Blogs**

   - Click on "All Blogs" tab to see blogs with all statuses
   - Filter by status using the dropdown
   - View rejection reasons and review timestamps

6. **View Full Blog Content**

   - Click the "View" button on any blog to open the full preview modal
   - See complete blog content including formatting, images, and metadata
   - For pending blogs, approve or reject directly from the preview modal
   - Review information shows previous admin actions and rejection reasons

7. **Delete Blogs**
   - In the "All Blogs" tab, click the "Delete" button on any blog
   - Confirm deletion in the modal dialog
   - Blog will be permanently removed from the system
   - **Warning**: This action cannot be undone

### For Users

1. **Submit Blogs**

   - Create blogs as usual through "Create Post"
   - After submission, blogs are in "pending" status
   - Users see a message indicating admin approval is required

2. **Track Blog Status**

   - Go to "My Blogs" in the navigation
   - View all your submitted blogs with their current status
   - See statistics of total, published, and pending blogs

3. **View Feedback**
   - If a blog is rejected, the rejection reason is displayed
   - Users can see when blogs were reviewed
   - Published blogs have a link to view the public post

## Blog Workflow

1. **User submits blog** → Status: "pending"
2. **Admin reviews blog** → Admin can:
   - Approve → Status: "approved" (blog is published)
   - Reject → Status: "rejected" (with reason)
3. **User receives feedback** → Can see status and rejection reason if applicable

## Security Features

- Admin routes are protected with role-based authentication
- Only users with "admin" role can access admin endpoints
- Admin login validates role before allowing access
- JWT tokens include user role for authorization

## Frontend Routes

### Public Routes

- `/admin/login` - Admin login page

### Protected Routes (Admin)

- `/admin/dashboard` - Admin dashboard for blog management

### Protected Routes (User)

- `/my-blogs` - User's blog status tracking page

## Technical Details

### Database Schema Changes

```javascript
// Blog Model additions
status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
reviewedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
reviewedAt: {
  type: Date,
},
rejectionReason: {
  type: String,
}
```

### Authentication Flow

1. Admin login validates credentials and role
2. JWT token includes user role information
3. Protected routes check for admin role
4. API endpoints use middleware to verify admin access

## Customization

### Adding More Admin Features

- User management (promote/demote users)
- Blog categories management
- Site statistics and analytics
- Bulk actions for blog management

### Modifying Approval Workflow

- Add more status options (e.g., "under_review", "needs_changes")
- Implement multi-level approval process
- Add automatic approval for trusted users
- Implement content moderation rules

## Troubleshooting

### Common Issues

1. **Admin user not created**

   - Run `npm run create-admin` from the root directory
   - Check MongoDB connection
   - Verify environment variables

2. **Admin login fails**

   - Verify admin user exists in database
   - Check email and password
   - Ensure user has "admin" role

3. **Blogs not showing in admin panel**

   - Check if blogs exist in database
   - Verify admin authentication
   - Check API endpoint responses

4. **Users can't see their blog status**
   - Verify user authentication
   - Check if user blogs endpoint is working
   - Ensure blogs have proper author reference

## Future Enhancements

- Email notifications for blog status changes
- Rich text editor for rejection reasons
- Blog scheduling and publishing dates
- Content moderation with AI assistance
- Detailed audit logs for admin actions
