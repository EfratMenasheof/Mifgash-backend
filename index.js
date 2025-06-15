import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import './passport.js';
import dotenv from 'dotenv';
import lessonsRoutes from './routes/lessonsRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // חשוב ל-Render

// הפוך את origin לדינמי לפי הסביבה
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    secure: true,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// כניסה עם גוגל
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// callback מהכניסה
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${CLIENT_ORIGIN}/home`);
  }
);

// משתמש מחובר
app.get('/api/current-user', (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send(null);
  }
});

// הרצת השרת
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.json());
app.use('/api/lessons', lessonsRoutes);
