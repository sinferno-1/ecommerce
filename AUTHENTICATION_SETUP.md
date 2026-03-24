# E-Commerce App - Authentication & Local Database Setup

## Overview
This project has been enhanced with a complete authentication system featuring:
- JWT-like login/signup with local JSON database
- Reactive forms with comprehensive validations
- Protected routes with Auth Guard
- User-specific cart management
- Local persistence using json-server

## Project Structure

### New Files Created
```
src/app/
├── services/
│   ├── auth.service.ts              # Authentication service
│   └── auth.service.spec.ts          # Auth service tests
├── components/
│   ├── login/
│   │   ├── login.component.ts        # Login component
│   │   ├── login.component.html      # Login template
│   │   ├── login.component.scss      # Login styles
│   │   └── login.component.spec.ts   # Login tests
│   ├── signup/
│   │   ├── signup.component.ts       # Signup component
│   │   ├── signup.component.html     # Signup template
│   │   ├── signup.component.scss     # Signup styles
│   │   └── signup.component.spec.ts  # Signup tests
│   └── [header/header.component.ts]  # Updated with user menu
├── guards/
│   └── auth.guard.ts                 # Authentication guard
├── app-routing.module.ts             # Updated routing
└── app.component.ts                  # Updated app component

db.json                               # Local database file
package.json                          # Updated with json-server
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the JSON Server (Database)
In terminal 1:
```bash
npm run json-server
```
The server will run on `http://localhost:3000` and watch `db.json` for changes.

### 3. Start the Angular Development Server
In terminal 2:
```bash
npm start
# or
ng serve
```
The application will run on `http://localhost:4200`

## Database Structure

### Users Table
```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "password": "password123",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "cart": [
        {
          "productId": 1,
          "name": "Laptop",
          "price": 999.99,
          "quantity": 1,
          "image": "laptop.jpg"
        }
      ]
    }
  ]
}
```

## Test Credentials

Use any of these accounts to test the application:

| Username | Password | First Name | Last Name |
|----------|----------|-----------|-----------|
| john_doe | password123 | John | Doe |
| jane_smith | password456 | Jane | Smith |
| bob_wilson | password789 | Bob | Wilson |

## Features

### Authentication Service (auth.service.ts)
- `login(credentials)` - Login with username/password
- `signup(data)` - Register new user
- `logout()` - Logout current user
- `isLoggedIn()` - Check if user is logged in
- `currentUser$` - Observable of current user

### Login Component
- Email-style form with Material Design
- Reactive form validation
- Username validation (min 3 chars)
- Password validation (min 6 chars)
- Error message display
- Link to signup page
- Demo credentials display
- loading state with spinner

### Signup Component
- Comprehensive form with validations
- First/Last name validation
- Email validation
- Username validation (alphanumeric only)
- Password strength validation (uppercase, lowercase, digit)
- Password confirmation matching
- Error handling
- Link back to login
- Loading state with spinner

### Auth Guard
- Protects routes that require authentication
- Redirects to login if not authenticated
- Preserves return URL for post-login navigation

### Protected Routes
```
/login          - Public (no guard)
/signup         - Public (no guard)
/products       - Protected by AuthGuard
/product/:id    - Protected by AuthGuard
/cart           - Protected by AuthGuard
/checkout       - Protected by AuthGuard & CartGuard
```

## Form Validations

### Login Form
- **Username**: Required, minimum 3 characters
- **Password**: Required, minimum 6 characters

### Signup Form
- **First Name**: Required, minimum 2 characters
- **Last Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Username**: Required, minimum 3 characters, alphanumeric + underscore only
- **Password**: Required, minimum 6 characters, must contain uppercase, lowercase, and digit
- **Confirm Password**: Must match password field
- **Form-level**: Passwords must match

## API Endpoints (via json-server)

```
GET    /users                          - Get all users
GET    /users/:id                      - Get user by ID
GET    /users?username=X&password=Y   - Get user by credentials
POST   /users                          - Create new user
PUT    /users/:id                      - Update user
DELETE /users/:id                      - Delete user
```

## State Management

### User Authentication
- Stored in BehaviorSubject (`currentUser$`)
- Persisted to localStorage as `currentUser`
- Observable stream for reactive updates

### Shopping Cart
- Managed by existing CartService
- Persisted to localStorage as `cart_v1`
- Synced with user's cart in database

## Security Notes

**⚠️ Important: This is a development setup and should NOT be used in production.**

In a production environment:
- Use proper JWT authentication with secure token storage
- Hash passwords using bcrypt or similar
- Use HTTPS only
- Implement proper CORS policies
- Set secure HTTP-only cookies
- Add rate limiting to prevent brute force attacks
- Use OAuth2 or similar industry-standard protocols

## Material Design Components Used

- MatCard - Login/Signup containers
- MatFormField - Form field styling
- MatInput - Text input fields
- MatButton - Action buttons
- MatProgressSpinner - Loading indicator
- MatToolbar - Header bar
- MatIcon - Icons throughout
- MatBadge - Cart item count
- MatMenu - User dropdown menu
-MatDivider - Menu separator

## Testing

### Run Unit Tests
```bash
npm test
```

### Key Test Files
- `auth.service.spec.ts` - Service tests
- `login.component.spec.ts` - Login component tests
- `signup.component.spec.ts` - Signup component tests

Tests cover:
- Form initialization and validation
- API integration (mocked)
- Error handling
- User feedback
- Navigation flows

## Troubleshooting

### JSON Server Not Running
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process using port 3000
taskkill /PID <PID> /F

# Start json-server again
npm run json-server
```

### Can't Login
- Ensure json-server is running on port 3000
- Check network tab in browser DevTools
- Verify db.json exists in project root
- Try one of the test credentials above

### Form Validation Issues
- Check browser console for errors
- Ensure all Material modules are imported
- Clear browser cache and reload

## NPM Scripts

```bash
npm start              # Start development server
npm run json-server    # Start JSON database server
npm run build          # Build for production
npm run watch          # Build in watch mode
npm test              # Run unit tests
npm run lint          # Run linter
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Login/signup forms are lightweight and responsive
- Auth Guard prevents unnecessary component loading
- Reactive forms are efficient with change detection
- JSON Server is suitable for development only

## Next Steps

To enhance this authentication system further:

1. Add "Forgot Password" functionality
2. Implement email verification
3. Add user profile management page
4. Implement role-based access control (RBAC)
5. Add two-factor authentication (2FA)
6. Create user settings/preferences page
7. Implement session timeout
8. Add login history/activity log
9. Create admin dashboard
10. Implement refresh tokens for longer sessions

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all services are running (ng serve, json-server)
3. Ensure all dependencies are installed (`npm install`)
4. Clear browser cache and localStorage
5. Review the component source code in `src/app/`

---

**Last Updated**: March 25, 2026
**Angular Version**: 21.x
**Node Version**: 14.x or higher
