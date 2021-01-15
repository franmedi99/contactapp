const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const pool = require('../database');
const passport = require('passport');
const { isLoggedIn,isNotLoggedIn } = require('../lib/auth');


//--------------------------------Renderizado del formulario para registrarse-------------------------------------------------
router.get('/signup',isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});


//------ con passport-local estrategia(local.signup) Verifica si el email existe-Registrando usuario--------------------------
router.post('/signup',isNotLoggedIn, passport.authenticate('local.signup', {
  successRedirect: '/auth',
  failureRedirect: '/signup',
  failureFlash: true
}));


//-----------------------------Verifica si el email esta activado-------------------------------------------------------------
router.get('/auth',isLoggedIn, async(req, res) => {
  const email = req.user.email
   const rows = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activacion=1', [email]);
   if (rows.length > 0) {
     res.redirect('/profile');
   }else{
     req.logOut();
     res.render('auth/message');
   }
  
});


//---------------Reenviar el Email--------------------------------------------------------------------------------------------
router.post('/resend',isNotLoggedIn, async(req, res) => {
  const email = req.body.email
  const rows = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activacion=0', [email]);
  if (rows.length > 0) {
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
        subject: "Email reenviado de ConctactAPP",
        text: "Usa el siguiente enlace para finalizar tu registro en contactApp  http://localhost:4000/verify?email="+req.body.email+"&codigo="+rows.codigo
    }
    transporter.sendMail(mailOption, (error, info)=>{
        if(error){
            res.status(500).send(error.message)
        }else{
            res.render('auth/correct');
        }
    })
  }else{
  
  }
});


//-------------------------------------Formulario para Iniciar Sesion---------------------------------------------------------
router.get('/signin',isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
});


//-----------------------------Inciar Sesion----------------------------------------------------------------------------------
router.post('/signin',isNotLoggedIn, (req, res, next) => {
  req.check('email', 'El email y la contraseña son requeridos').notEmpty();
  req.check('password', 'El email y la contraseña son requeridos').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/auth',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});


//--------------------------activacion de email------------------------------------------------------------------------------
router.get('/verify',isNotLoggedIn, async(req, res) => {
email=req.query.email
codigo1=req.query.codigo
activacion= 0;
const rows = await pool.query('SELECT * FROM usuarios WHERE email= ? AND activacion= ?', [email,activacion]);

   if(rows.length > 0){
    email2=rows[0].email
    codigo2=rows[0].codigo
    id_perfil=rows[0].id
    tipo_perfil=1;
    activacion= 1;
     const act= {activacion};
    const perfil = {id_perfil,tipo_perfil}

     await pool.query('UPDATE usuarios set ? WHERE email = ?', [act, email2]);

     res.render('auth/verified');
   }else{
    res.redirect('/');
   }

});

//-------------------------Cerrar Sesion-------------------------------------------------------------------------------------
router.get('/logout',isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/');
});


//----------------Renderiza el archivo dependiendo de que tipo de cuenta tengas(1:indefinida/2:trabajador/3:empleador)-------
router.get('/profile', isLoggedIn, async(req, res) => {

    tipo=req.user.tipo_perfil
    profile= req.user.perfil
    //si el usuario todavia no define su rol
  if(tipo==1){
  
    res.render('profiles/undefined');

    //si el usuario es trabajador
  }else if(tipo==2){

    
    if(profile===0 || profile==="0"){
      res.render('trabajador/forms/form_trabajador')
    }else{
     
      res.render('profiles/trabajador.hbs');
    }
      //si el usuario es empleador
  }else if(tipo==3){


    if(profile===0 || profile==="0"){
      res.render('empleador/forms/form_empleador')
    }else{
    res.render('profiles/empleador.hbs');
    }
    
  }else{
    req.flash('message','hubo un error al autenficarte, por favor intentelo Nuevamente')
    res.redirect('/');
  }

});

module.exports = router;
