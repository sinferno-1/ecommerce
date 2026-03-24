# 🧪 TESTING GUIDE - Bug Fixes

## Quick Start

### Prerequisites
Terminal 1: Start JSON Server
```bash
npm run json-server
```

Terminal 2: Start Angular Dev Server
```bash
npm start
```

Then open: http://localhost:4200

---

## Test #1: Cart Data Syncing with Database ✅

### What to Test
Verify that cart changes are saved to db.json in real-time.

### Steps
1. **Login**
   - Username: `john_doe`
   - Password: `password123`
   - Click "Login"

2. **Watch Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Keep filter on XHR/Fetch

3. **Add Item to Cart**
   - Browse products
   - Add a product to cart
   - **Expected**: See PUT request to `http://localhost:3000/users/1`
   - **Expected**: Request shows cart data being sent

4. **Verify db.json Updated**
   - Open file: `db.json` in your editor
   - Look at `users[0].cart`
   - **Expected**: New item appears in inventory with correct quantity

5. **Remove Item from Cart**
   - Go to cart page
   - Click remove on an item or reduce quantity
   - **Expected**: PUT request sent again
   - **Expected**: db.json updates immediately

6. **Clear Entire Cart**
   - Click "Clear Cart" button (if exists)
   - **Expected**: PUT request with empty cart array: `"cart": []`
   - **Expected**: db.json shows empty cart

7. **Test Persistence**
   - Close the browser tab
   - Re-open http://localhost:4200
   - Login again with same credentials
   - **Expected**: Cart shows the same items from previous session
   - This proves cart was saved and loaded from database

### Network Request Examples

#### Add to Cart Request
```
PUT /users/1
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
      "quantity": 2,
      "image": "laptop.jpg"
    }
  ]
}
```

---

## Test #2: Header Visibility Based on Auth ✅

### What to Test
Header should only show when logged in.

### Steps
1. **Fresh Browser / Incognito Window**
   - Open `http://localhost:4200`
   - **Expected**: Redirected to login page
   - **Expected**: NO header visible (no FakeStore logo, no cart icon)
   - **Expected**: Only sees login form

2. **Signup Page**
   - Click "Sign up here"
   - **Expected**: Still no header visible
   - **Expected**: Only signup form shown
   - **Expected**: No cart button present

3. **Login**
   - Click "Login here"
   - Enter: `john_doe` / `password123`
   - Click "Login"
   - **Expected**: Redirected to products page
   - **Expected**: Header NOW appears at top
   - **Expected**: See "John Doe" in top right corner
   - **Expected**: See user menu button (account icon)
   - **Expected**: See cart icon with badge

4. **Navigate Pages (with header)**
   - Click product
   - **Expected**: Header still visible
   - Add to cart
   - **Expected**: Header still visible, cart count updates
   - Go to cart page
   - **Expected**: Header still visible

5. **Logout**
   - Click user menu (account icon)
   - Click "Logout"
   - **Expected**: Redirected to login page
   - **Expected**: Header DISAPPEARS
   - **Expected**: Only login form visible
   - **Expected**: No cart button, no user name

### Visual Verification

**Before Login:**
```
┌────────────────────────────────────────────┐
│                                            │  ← NO HEADER
├────────────────────────────────────────────┤
│                                            │
│             SELECT ALTERNATIVE             │
│             [Laptop]  [Phone]              │
│                                            │
└────────────────────────────────────────────┘
```

**After Login:**
```
┌────────────────────────────────────────────┐
│ FakeStore    John Doe  👤  🛒 [2]         │  ← HEADER VISIBLE
├────────────────────────────────────────────┤
│                                            │
│             SELECT ALTERNATIVE             │
│             [Laptop]  [Phone]              │
│                                            │
└────────────────────────────────────────────┘
```

---

## Test #3: Login Error Handling ✅

### What to Test
Loading spinner stops immediately on error, error message displays.

### Steps
1. **Open Login Page**
   - Go to `http://localhost:4200`
   - (Will redirect to login)

2. **Enter Wrong Credentials**
   - Username: `john_doe`
   - Password: `wrongpassword123` (incorrect)
   - Click "Login"

3. **Monitor Spinner**
   - **Expected**: Spinner appears for ~1 second
   - **Expected**: Spinner STOPS completely
   - **Expected**: Button returns to normal ("Login" text shows)
   - **Expected**: Button is clickable again (not disabled)

4. **Verify Error Message**
   - **Expected**: Error message displays immediately
   - **Expected**: Message reads: "Invalid username or password"
   - **Expected**: Error message is clearly visible (red background)
   - **Expected**: No need to click any field for message to appear

5. **Error Auto-Clear**
   - Wait 5 seconds
   - **Expected**: Error message automatically disappears
   - **Expected**: No user action needed

6. **Form Still Functional**
   - Try again with correct credentials
   - Username: `john_doe`
   - Password: `password123`
   - **Expected**: Form processes normally
   - **Expected**: Login succeeds

### Timing Test

Incorrect password flow:
```
Time 0:00   Click Login button
Time 0:00   Spinner starts spinning
Time 0:01   Error callback triggered
Time 0:01   loading = false (spinner stops)
Time 0:01   errorMessage = "Invalid username or password" (displays)
Time 0:05   errorMessage auto-clears
```

### Error Message Verification

✅ **Should see:**
```
┌─────────────────────────────────────────┐
│ invalid username or password            │ ← Red box
├─────────────────────────────────────────┤
│ Username: [_____________]               │
│ Password: [_____________]               │
│ [        Login        ] ← Clickable     │
└─────────────────────────────────────────┘
```

❌ **Should NOT see:**
- Spinning loader (after ~1 second)
- Disabled button (can click again)
- Error needing field focus to appear

---

## Test #4: Signup Error Handling ✅

### What to Test
Same error handling improvements as login.

### Steps
1. **Go to Signup**
   - Click "Sign up here" from login page

2. **Enter Invalid Data**
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Username: `johndoe`
   - Password: `weak` (too weak, no uppercase/number)
   - Confirm: `weak`
   - Try to submit
   - **Expected**: Button disabled (form invalid)
   - **Expected**: Field hints showing validation errors

3. **Enter Valid Password But Username Exists**
   - Username: `john_doe` (already exists in db)
   - Password: `Strong123` (valid)
   - Confirm: `Strong123`
   - Click "Sign Up"

4. **Monitor Spinner**
   - **Expected**: Spinner appears
   - **Expected**: Spinner stops after ~1-2 seconds
   - **Expected**: Error message displays

5. **Test Auto-Clear**
   - Error shows: "Username already exists"
   - Wait 5 seconds
   - **Expected**: Error auto-clears

---

## Checklist: All Tests Passing

### Test 1: Cart Sync
- [ ] Network request sent when item added
- [ ] Network request sent when item removed
- [ ] db.json updates in real-time
- [ ] Cart persists after page reload
- [ ] Cart persists after logout/login
- [ ] Quantity updates sync correctly
- [ ] Clear cart syncs correctly

### Test 2: Header Visibility
- [ ] No header on login page
- [ ] No header on signup page
- [ ] Header shows after successful login
- [ ] Header shows user's first name
- [ ] Header shows user menu button
- [ ] Header shows cart with badge
- [ ] Header disappears after logout
- [ ] Header shows on all protected pages

### Test 3: Login Errors
- [ ] Spinner appears when clicked
- [ ] Spinner stops on error
- [ ] Error message visible without field focus
- [ ] Error message readable (good contrast)
- [ ] Can retry immediately
- [ ] Error auto-clears after 5 seconds
- [ ] Login works after error

### Test 4: Signup Errors
- [ ] Form validation shows errors
- [ ] Spinner stops on error
- [ ] Error message displays
- [ ] Can retry immediately
- [ ] Invalid data prevented before submission
- [ ] Strong password required
- [ ] Duplicate username detected

---

## Common Issues & Solutions

### Issue: Cart not syncing
**Solution:**
- Check json-server is running: `npm run json-server`
- Check Network tab for 404 or 500 errors
- Verify db.json is in project root
- Check browser console for JavaScript errors

### Issue: Header always visible
**Solution:**
- Hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check AppComponent subscription to authService
- Verify localStorage has no stale `currentUser`

### Issue: Spinner keeps spinning
**Solution:**
- Open DevTools Console
- Check for JavaScript errors
- Verify AuthService login method throws error on bad credentials
- Check Network tab for failed requests

### Issue: Error message doesn't appear
**Solution:**
- Check error handler is being called
- Verify errorMessage binding in template
- Ensure error callback sets `this.errorMessage`
- Check for console errors

---

## Advanced Testing

### Test with Different Users
Login with each test user and verify cart:
```
User 1: john_doe / password123
   - Has 1 laptop in cart

User 2: jane_smith / password456
   - Has 2 smartphones and 1 headphone in cart

User 3: bob_wilson / password789
   - Has empty cart
```

### Test Concurrent Operations
1. Add item
2. Before sync completes, add another item
3. Verify both requests sent and cart updates correctly

### Test Network Errors
1. Close json-server
2. Try to add item
3. Should handle gracefully with error message
4. Restart json-server and verify sync works again

### Performance Testing
1. Add 20+ items to cart
2. Monitor request size and response time
3. Verify UI remains responsive
4. Check for memory leaks (open DevTools Memory tab)

---

## Expected Results Summary

| Test | Expected | Status |
|------|----------|--------|
| Cart adds item | Request sent, db updates | ✅ |
| Cart removes item | Request sent, db updates | ✅ |
| Cart persists | Reload + login = same cart | ✅ |
| Header on login page | Not visible | ✅ |
| Header after login | Visible with user info | ✅ |
| Spinner on error | Stops in <2s | ✅ |
| Error message | Visible immediately | ✅ |
| Error auto-clear | Clears after 5s | ✅ |
| Form responsive | Can retry immediately | ✅ |

---

**All tests passing? You're good to go! 🎉**

If any test fails, check:
1. Browser console for error messages
2. Network tab for failed requests
3. json-server console for errors
4. db.json for unexpected data
5. localStorage (DevTools > Application > Storage)
