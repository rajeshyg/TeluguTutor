# Security Rules Skill

## When This Skill Activates

**Auto-activation triggers**:

- Handling user input (forms, URL parameters, local storage)
- Implementing authentication/authorization
- Working with sensitive data (API keys, user preferences)
- Making external API calls
- Storing data in local storage or state

**Manual activation**: When you need to verify security compliance.

---

## Critical Security Rules

### 1. Input Validation & Sanitization

**DO**:

```javascript
// ✓ Validate user input before using it
const validatePracticeInput = (input) => {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 500) return null;
  return trimmed;
};

// ✓ Sanitize HTML if rendering user content
import DOMPurify from 'dompurify';
const cleanInput = DOMPurify.sanitize(userInput);

// ✓ Validate file uploads
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const validateImageUpload = (file) => {
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File too large');
  }
  return file;
};
```

**NEVER**:

```javascript
// ❌ Render user input without sanitization (XSS risk)
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // DANGEROUS

// ❌ Accept any file type
const file = input.files[0]; // No validation

// ❌ No length validation
const userResponse = event.target.value; // Could be extremely large
```

### 2. Environment Variables & Secrets

**DO**:

```javascript
// ✓ Use environment variables for API keys
const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✓ Provide defaults for development only
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ✓ Check for required secrets on app start
if (import.meta.env.PROD && !import.meta.env.VITE_API_KEY) {
  throw new Error('VITE_API_KEY must be set in production');
}

// ✓ Create .env.local (not committed to git)
// .env.local
// VITE_API_KEY=your-secret-key-here
// VITE_API_BASE_URL=https://api.example.com
```

**NEVER**:

```javascript
// ❌ Hardcode secrets in source code
const API_KEY = 'sk-prod-12345'; // NEVER commit this

// ❌ Commit .env files to git
// .gitignore should include:
.env
.env.local
.env.production.local

// ❌ Log secrets
console.log('API_KEY:', import.meta.env.VITE_API_KEY); // NEVER log secrets

// ❌ Send secrets to backend
fetch('/api/config', {
  body: JSON.stringify({ apiKey: API_KEY }) // NEVER expose secrets
});
```

### 3. Local Storage Security

**DO**:

```javascript
// ✓ Store only non-sensitive user preferences
const saveThemePreference = (theme) => {
  localStorage.setItem('theme-preference', theme);
};

// ✓ Validate data from local storage
const loadUserPreferences = () => {
  const stored = localStorage.getItem('user-preferences');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null; // Corrupted data, ignore
  }
};

// ✓ Clear sensitive data on logout
const logout = () => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user-session');
  sessionStorage.clear();
};
```

**NEVER**:

```javascript
// ❌ Store authentication tokens in localStorage
localStorage.setItem('auth-token', jwtToken); // Vulnerable to XSS

// ❌ Store passwords or sensitive data
localStorage.setItem('password', userPassword);
localStorage.setItem('ssn', socialSecurityNumber);

// ❌ Trust all data from localStorage
const userId = localStorage.getItem('user-id');
// User could manipulate this value

// ❌ Don't validate stored data
const prefs = JSON.parse(localStorage.getItem('prefs'));
// Could throw if malformed
```

### 4. API Communication Security

**DO**:

```javascript
// ✓ Use HTTPS only in production
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://api.example.com'; // HTTPS required
  }
  return 'http://localhost:3000';
};

// ✓ Validate API responses
const fetchPracticeData = async (id) => {
  try {
    const response = await fetch(`/api/practice/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    // Validate schema before using
    return validatePracticeSchema(data);
  } catch (error) {
    console.error('Failed to fetch practice data:', error.message);
    return null;
  }
};

// ✓ Use CORS headers properly
const apiCall = async (endpoint, options = {}) => {
  return fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin', // Include cookies if needed
  });
};
```

**NEVER**:

```javascript
// ❌ Allow HTTP in production
const API_URL = 'http://api.example.com'; // Should be HTTPS in prod

// ❌ Trust API response without validation
const data = await response.json();
setState(data); // Could be any shape

// ❌ Expose error details to users
.catch(error => {
  alert('Error: ' + error.stack); // Too technical, exposes internals
});

// ❌ Send sensitive data in URL params
fetch(`/api/user/search?email=${userEmail}&ssn=${ssn}`);
```

### 5. React Component Security

**DO**:

```javascript
// ✓ Use key prop correctly in lists
{items.map((item) => (
  <PracticeCard key={item.id} data={item} />
))} // Use unique ID, not index

// ✓ Escape user-generated content
const UserComment = ({ text }) => (
  <p>{text}</p> // React escapes by default (safe)
);

// ✓ Validate prop types
function GraphemeCard({ grapheme, confidence }) {
  if (typeof confidence !== 'number' || confidence < 0 || confidence > 100) {
    throw new Error('Invalid confidence value');
  }
  return <div>{grapheme}</div>;
}

// ✓ Clean up effects and listeners
useEffect(() => {
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize); // Cleanup
  };
}, []);
```

**NEVER**:

```javascript
// ❌ Use array index as key
{items.map((item, index) => (
  <Item key={index} data={item} /> // WRONG: index not stable
))}

// ❌ Render user content unsafely
<h1>{userTitle}</h1> // Usually OK, but avoid dangerouslySetInnerHTML

// ❌ Don't validate component props
function Card({ children, onClick }) {
  return <div onClick={onClick}>{children}</div>; // No validation
}

// ❌ Forget effect cleanup
useEffect(() => {
  window.addEventListener('resize', handler);
  // Missing cleanup causes memory leaks and duplicate listeners
}, []);
```

### 6. Third-Party Libraries

**DO**:

```javascript
// ✓ Use well-maintained libraries
import { clsx } from 'clsx'; // Popular, maintained
import { Button } from '@/components/ui/button'; // shadcn/ui (trusted)

// ✓ Pin library versions in package.json
// Use exact versions: "clsx": "2.0.0" (not "^2.0.0")

// ✓ Review dependencies periodically
// Run: npm audit
// Check for security vulnerabilities

// ✓ Use libraries for security-critical features
import DOMPurify from 'dompurify'; // For HTML sanitization
```

**NEVER**:

```javascript
// ❌ Use unmaintained or unknown libraries
import { weirdLibrary } from 'unmaintained-package';

// ❌ Use insecure patterns
// eval(), Function(), or dynamic code execution
eval(userInput); // EXTREMELY DANGEROUS

// ❌ Ignore security warnings
npm audit // Ignoring vulnerabilities found

// ❌ Implement security features from scratch
// Use libraries for crypto, sanitization, validation
```

### 7. Error Handling & Logging

**DO**:

```javascript
// ✓ Generic error messages to users
try {
  const result = await api.get('/data');
} catch (error) {
  showToast('Failed to load data. Please try again.');
  console.error('API error:', error); // Detailed log server-side
}

// ✓ Different messages for different scenarios
if (error.status === 404) {
  showToast('Data not found');
} else if (error.status === 403) {
  showToast('You do not have permission');
} else {
  showToast('An error occurred. Please try again.');
}

// ✓ Log errors for debugging
console.error('Practice session failed:', {
  grapheme: grapheme.id,
  confidence: confidence,
  error: error.message, // Not error.stack in production
});
```

**NEVER**:

```javascript
// ❌ Expose internal errors to users
alert('Error: ' + error.stack); // Exposes server internals

// ❌ Log sensitive data
console.log('User data:', { email, phone, ssn }); // NEVER log PII

// ❌ Ignore errors silently
try {
  fetchData();
} catch (error) {
  // Silent failure - at least log it
}

// ❌ Display file paths or server details
alert(`File not found at /home/user/data/file.json`);
```

---

## Security Checklist

Before committing or deploying code, verify:

- [ ] No hardcoded secrets or API keys
- [ ] All user input validated before use
- [ ] No `dangerouslySetInnerHTML` with user content
- [ ] No localStorage storage of authentication tokens
- [ ] All external API calls use HTTPS
- [ ] Error messages don't expose internal details
- [ ] No console.log of sensitive data
- [ ] .env files are in .gitignore
- [ ] Third-party libraries are up to date
- [ ] No eval() or dynamic code execution
- [ ] Component keys are stable (not index)
- [ ] useEffect cleanups are implemented

---

## Common Vulnerabilities (Frontend)

| Vulnerability                 | Prevention                                               |
| ----------------------------- | -------------------------------------------------------- |
| **XSS (Cross-Site Scripting)** | Never use dangerouslySetInnerHTML, sanitize with library |
| **Local Storage Token Theft**  | Don't store auth tokens in localStorage                  |
| **Man-in-the-Middle (MITM)**   | Always use HTTPS in production                           |
| **Sensitive Data Logging**     | Never log passwords, keys, tokens, or PII                |
| **Malicious Input**            | Validate and sanitize all user input                     |
| **Dependency Vulnerability**   | Keep dependencies updated, run `npm audit`               |
| **Component Key Bugs**         | Use unique IDs, never use array index as key             |
| **Missing Effect Cleanup**     | Always cleanup event listeners and timers                |

---

## Related Skills

- `.claude/skills/coding-standards/SKILL.md` - Input validation patterns
- `.claude/skills/project-constraints/SKILL.md` - Infrastructure security

## Related Commands

- `/prime-ui` - Component security patterns
- `/prime-learning-domain` - Domain-specific security considerations
