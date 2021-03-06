const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();

const { database } = require('./keys');







// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'

}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req,file,cb)=>{
    cb(null, new Date().getTime()+ path.extname(file.originalname));
  }
});
app.use(multer({
  storage,
  fileFilter(req, file, cb){
  
    if(file.mimetype==='video/mp4' || file.mimetype==='video/x-matroska'){
       
        cb(null, true);
     }else{
     
      return cb(null, false, req.fileValidationError = 'Solo se aceptan los archivos con extensiones .MP4 y .MKV');
     }
    
 },

}).single('video'));

app.use(session({
  secret: process.env.PALABRA_SECRETA,
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/company', require('./routes/company'));
app.use('/employee',require('./routes/employee'));

//app.use('/links', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
  console.log('Environment: ',process.env.NODE_ENV)
});

require('./helpers/cron.js');