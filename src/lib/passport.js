const passport = require('passport');
const nodemailer = require('nodemailer');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');


//--------------------------Estrategia Iniciar Sesion-------------------------
passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Te doy la bienvenida  ' + user.email));
    } else {
      done(null, false, req.flash('message', 'Contraseña Incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'Este email no esta registrado.'));
  }
}));


// -------------------Estrategia para Registrarse-----------------------------
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  const {password2} = req.body;
  const newUser = {email,password,codigo};

  const rows = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (rows.length > 0) {
    done(null, false, req.flash('message', 'Este email ya esta registrado!!'));
  }else {

if(password !== password2){
  done(null, false, req.flash('message', 'las contraseñas no coinciden!!'));
}else{

//----------------------RANDOM NUMBER----------------------------
var r=0;
var a=100000000000000;
var b=999999999999999;
for(r=0; r<=1;r++){
  codigo =  Math.round(Math.random()*(b-a)+parseInt(a));
  
}
var codigo = codigo
var tipo_perfil = 1
newUser.tipo_perfil = tipo_perfil
newUser.codigo= codigo
//---------------------------NODEMAILER------------------------

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
      user: 'franmedi99@gmail.com',
      pass: 'franmedi1234'
  },
});
  const mailOption = {
      from: "remitente",
      to: req.body.email,
      subject: "Te doy la Bienvenida a Contactapp", //Asunto
      text: "Usa el siguiente enlace para finalizar tu registro en contactApp http://localhost:4000/verify?email="+req.body.email+"&codigo="+codigo//Texto
  }
  transporter.sendMail(mailOption, async(error, info)=>{
      if(error){
        done(null, false, req.flash('message', error.message));
      }else{
         
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT Into usuarios SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
 
      }
  })
//-------------------------------------------------------




}


  }


}));


// ---------------------Encriptar usuario-------------------------------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});


//----------------------Desencriptar usuario----------------------------------
passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  done(null, rows[0]);
});

