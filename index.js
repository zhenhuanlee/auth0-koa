const Koa = require('koa');
const Auth0Strategy = require('passport-auth0');
const passport = require('koa-passport');
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const route = require('koa-route')

const strategy = new Auth0Strategy({
  domain: 'salama.auth0.com',
  clientID: '540CExvEoXBrAo5NhuXZAhWjZTnNKior',
  clientSecret: 'XEO3_NoMIHfadTx7mbJ1O1UpLo3-x14gkXLMZ2OOH1KsuAMY2rPqEzF1a33QHUbi',
  callbackURL: 'http://localhost:3000/callback'
}, (accessToken, refreshToken, extraParams, profile, done) => {
  return done(null, profile);
});
passport.use(strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const app = new Koa();
// trust proxy
app.proxy = true

// sessions
app.keys = ['xxxxxyyyyy']
app.use(session({}, app))

// body parser
app.use(bodyParser())

// authentication
// require('./auth')
app.use(passport.initialize())
app.use(passport.session())

app.use(route.get('/', passport.authenticate('auth0')));

app.use(route.get('/callback', passport.authenticate('auth0', {
  successRedirect: '/profile'
})
));

app.use(route.get('/profile', (ctx) => {
  ctx.set('content-type', 'application/json');
  ctx.body = JSON.stringify(ctx.state.user);
}));

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on', port));