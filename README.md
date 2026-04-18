# CloudVault - File Manager Application

## Project Overview

A full-stack, production-ready file management application with cloud storage integration, real-time uploads, and comprehensive user authentication.

---

## Key Achievements & Features

### 🔐 Authentication & Security

- **NextAuth.js JWT Authentication** - Secure credential-based login with password hashing (bcryptjs)
- **Protected Routes** - Server-side session validation via middleware with automatic redirects
- **Authorization Checks** - Granular permission validation on all sensitive operations
- **Session Management** - Persistent user sessions with logout functionality

### 📁 File Management

- **Cloud Storage Integration** - AWS S3 SDK v3 for scalable file storage with presigned URLs
- **File Operations** - Upload, download, preview, rename, and delete with error handling
- **Hierarchical Organization** - Nested folder structure with parent-child relationships
- **Real-time Upload Queue** - Multiple file uploads with individual progress tracking and status indicators
- **File Thumbnails** - Automatic thumbnail generation for images with fallback icons for other file types

### 💾 Data Persistence

- **MongoDB Integration** - Mongoose v8.20 with three core models:
  - User (credentials, metadata)
  - File (metadata, S3 references, relationships)
  - Folder (hierarchy, organization)
- **Atomic Operations** - Transaction support for data consistency during uploads/deletes

### 🎨 User Interface

- **Modern Design System** - Glassmorphism effects with backdrop blur and transparency
- **Dark Mode Support** - Full dark/light theme toggle with localStorage persistence and system preference detection
- **Modal-Based UX** - Professional modals replacing browser prompts:
  - Upload Modal with drag-and-drop interface
  - File Preview Modal with image/PDF support
  - Rename Modal for files and folders
  - Delete Confirmation Modal with warnings
  - Create Folder Modal with validation
- **Responsive Grid** - 5-column adaptive file grid with hover effects and file type icons
- **Storage Visualization** - Progress bar with color-coded storage usage (0-50%, 50-80%, 80%+)
- **Toast Notifications** - Non-intrusive feedback system with success/error/info types
- **Sidebar Navigation** - Expandable folder tree with real-time updates

### 🚀 Technical Implementation

- **Next.js 16** with App Router, TypeScript 5, and Server Components
- **React 19** with Hooks (useState, useEffect, useCallback, useContext)
- **Tailwind CSS v4** - Class-based dark mode with responsive design
- **Framer Motion v12** - Smooth animations and transitions
- **Lucide React v0.556** - Professional icon library
- **Form Validation** - Client-side validation with error states
- **API Design** - RESTful endpoints with proper HTTP methods and status codes

### 🔧 Developer Experience

- **TypeScript** - Full type safety across all components
- **Error Handling** - Comprehensive try-catch blocks with user-friendly messages
- **Performance Optimization** - useCallback memoization, lazy loading, request deduplication
- **Code Quality** - ESLint configuration with Turbopack for fast builds
- **Environment Configuration** - Environment variable support for API keys and endpoints

---

## Technologies Used

**Frontend:**

- Next.js 16, React 19, TypeScript 5
- Tailwind CSS v4, Framer Motion
- Lucide React (Icons)

**Backend:**

- Next.js API Routes
- NextAuth.js v4.24.13
- Node.js

**Database:**

- MongoDB with Mongoose v8.20

**Cloud Services:**

- AWS S3 SDK v3.933.0 (File Storage)

**Development Tools:**

- ESLint, Turbopack
- PostCSS

---

## Project Impact

✅ **Production Ready** - All critical features implemented with proper error handling
✅ **Security Focused** - Authentication, authorization, and data validation throughout
✅ **User Centric** - Modern UI with smooth interactions and helpful feedback
✅ **Scalable Architecture** - Cloud storage enables unlimited file capacity
✅ **Professional Polish** - Glassmorphic design with comprehensive dark mode support

---

## Installation & Running

```bash
# Install dependencies
npm install

# Configure environment variables (.env.local)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
MONGODB_URI=your-mongodb-connection
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Optional: Logging configuration
LOG_LEVEL=info # error, warn, info, debug
ENABLE_FILE_LOGGING=true # Set to false for serverless environments

# Run development server
npm run dev

# Build for production
npm run build
npm start

## 🚀 Vercel Deployment

This application is optimized for Vercel deployment. See [DEPLOYMENT_GUIDE_VERCEL.md](./DEPLOYMENT_GUIDE_VERCEL.md) for complete deployment instructions.

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/cloudvault)
```

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/        # Main file management interface
│   ├── login/            # Authentication page
│   ├── register/         # User registration
│   ├── api/              # Backend endpoints
│   │   ├── auth/         # Authentication routes
│   │   ├── files/        # File operations (CRUD)
│   │   ├── folders/      # Folder management
│   │   └── upload-url/   # S3 presigned URLs
│   ├── models/           # Database schemas
│   ├── layout.tsx        # Root layout with providers
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   ├── FileGrid.tsx      # File display with thumbnails
│   ├── SidebarFolderTree.tsx  # Folder navigation
│   ├── UploadModal.tsx   # File upload interface
│   ├── FilePreviewModal.tsx   # File viewing
│   ├── RenameFileModal.tsx    # File renaming
│   ├── DeleteFileModal.tsx    # Delete confirmation
│   ├── CreateFolderModal.tsx  # Folder creation
│   ├── Toast.tsx         # Notifications
│   ├── ThemeToggle.tsx   # Dark mode switcher
│   ├── Providers.tsx     # React Context providers
│   └── ProtectedRoute.tsx     # Route protection
└── lib/
    ├── auth.ts          # NextAuth configuration
    └── db.ts            # MongoDB connection
```

---

## Key Learning Outcomes

1. **Full-Stack Development** - Mastered Next.js for both frontend and backend
2. **Cloud Architecture** - Integrated AWS S3 with proper security practices
3. **Database Design** - Hierarchical data modeling with MongoDB
4. **Authentication** - Implemented secure JWT-based auth system
5. **UI/UX Design** - Created modern, accessible interface with dark mode
6. **Performance** - Optimized React with memoization and lazy loading
7. **TypeScript** - Leveraged strict typing for robust code
8. **Error Handling** - Built comprehensive error feedback system

---

## Future Enhancements

- File versioning and rollback
- Sharing and permission system
- Collaborative editing
- Advanced search and filtering
- File tagging and categorization
- Bulk operations
- Audit logging
- Two-factor authentication
- File encryption

---

## GitHub Repository

[Your GitHub Link]

## Live Demo

[Your Live Demo Link]

---

**Created by:** [Your Name]  
**Date:** February 2026  
**Duration:** [Project Timeline]  
**Status:** Complete & Production Ready
