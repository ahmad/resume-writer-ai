# Firebase Integration Setup

This project has been integrated with Firebase for authentication and data storage. Here's what has been implemented:

## Features Added

### 1. Authentication
- **Email/Password Authentication**: Users can sign up and sign in with email and password
- **Protected Routes**: The main application is protected and requires authentication
- **User Profile**: Shows user information and provides logout functionality
- **Auth Context**: Manages authentication state throughout the application

### 2. Data Storage (Firestore)
- **Resume Storage**: Users can save their resumes to Firestore
- **Resume Loading**: Users can load previously saved resumes
- **Resume Management**: Users can delete saved resumes
- **User Preferences**: Framework for storing user preferences

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase configuration and initialization
│   ├── auth.ts              # Authentication utilities
│   └── firestore.ts         # Firestore utilities for data operations
├── contexts/
│   └── AuthContext.tsx      # React context for authentication state
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx    # Login form component
│   │   ├── SignupForm.tsx   # Signup form component
│   │   ├── AuthPage.tsx     # Combined auth page
│   │   ├── ProtectedRoute.tsx # Route protection component
│   │   └── UserProfile.tsx  # User profile and logout component
│   └── resume/
│       └── ResumeManager.tsx # Resume save/load/delete functionality
```

## Firebase Configuration

The Firebase configuration is already set up in `src/lib/firebase.ts` with the provided config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyA7U3EhqcMDVKKxH8LchWmOhu_w2yTVItk",
  authDomain: "resume-writer-ffd1d.firebaseapp.com",
  projectId: "resume-writer-ffd1d",
  storageBucket: "resume-writer-ffd1d.firebasestorage.app",
  messagingSenderId: "1018155935511",
  appId: "1:1018155935511:web:8a6290afdd86c7d19ef952",
  measurementId: "G-FYW63YHZYY"
};
```

## Usage

### Authentication
1. Users will be automatically redirected to the login page if not authenticated
2. They can switch between login and signup forms
3. After successful authentication, they'll be taken to the main application
4. The user profile component in the header shows their email and provides logout functionality

### Resume Management
1. **Save Resume**: Click "Save Resume" in the header to save the current resume
2. **Load Resume**: Click "Load Resume" to view and load previously saved resumes
3. **Delete Resume**: Use the delete button in the load modal to remove saved resumes

## Security Rules

Make sure to set up proper Firestore security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Dependencies

The following Firebase packages are already installed:
- `firebase` - Core Firebase SDK
- Firebase Auth for authentication
- Firestore for data storage

## Next Steps

1. **Enable Authentication**: In your Firebase console, enable Email/Password authentication
2. **Set up Firestore**: Create a Firestore database in your Firebase console
3. **Configure Security Rules**: Set up the security rules mentioned above
4. **Test the Integration**: Try creating an account and saving/loading resumes

## Troubleshooting

- If authentication doesn't work, check that Email/Password authentication is enabled in Firebase console
- If data operations fail, ensure Firestore is properly set up and security rules are configured
- Check the browser console for any error messages 