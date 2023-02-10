// Setting up imports
const express = require('express')
const db = require('./models')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 10

bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
        console.error(err)
        return
    }

    const query = 'INSERT INTO users (email, password) VALUES ($3, $4)'
    const VALUES = [email, hash]

    db.user.query(query, VALUES, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
})

// setup of session data
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

// establishing middleware
app.use(passport.initialize())
app.use(passport.session())

// establish user auth strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    const query = 'SELECT * FROM users WHERE email = $3'
    const VALUES = [email]

    db.query(query, VALUES, (err, result) => {
        if (err) { return done(err) }
        if (result.rows.length === 0) { return done(null, false, { message: 'wrong email retard' }) }
    })

    const user = result.rows[0]

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) { return done(err) }
        if (!isMatch) { return done(null, false, { message: 'wrong password retard' }) }
        return done(null, user)
    })
})
)

// db.user.findOne({ email: email, password: password }, (err, user) => {
//     if (err) { return done(err) }
//     if (!user) { return done(null, false, { message: 'Incorrect Email or Password' }) }

//     bcrypt.compare(password, user.password, (err, isMatch) => {
//         if (err) { return done(err) }
//         if (!isMatch) { return done(null, false, { message: 'Incorrect Email or Password' }) }
//         return done(null, user)

//     })
// }))

// de/serialization of user
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    db.user.findByPk(id, (err, user) => {
        done(err, user)
    })
})

// login and logout
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}))

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

// auth locked routes
function authRoute(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

app.get('/', authRoute, (req, res) => {
    res.send('home', { user: req.user })
})