const express = require('express');

const router = express.Router();
const moment = require('moment');
moment.locale('es');
const pool = require('../database');
const { isLoggedIn,isEmployee } = require('../lib/auth');


router.post('/new-employee',isLoggedIn, async(req,res)=>{

    const { nombre,apellido,sexo,estado_civil,descripcion} = req.body;  
    var {fecha} = req.body 
    if(nombre=="" || apellido=="" || sexo=="" || estado_civil=="" ||fecha=="" || descripcion=="" ){
     
        req.flash('message', 'Por favor Completa todos los campos');
        res.redirect('/profile')
    }else{
    var fecha= moment(fecha).format('L')
    const id_informacion = req.user.id
    const trabajador = {
        id_informacion,
        nombre,
        fecha,
        descripcion
        
    };
const extra={
    id_informacion,
    apellido,
    sexo,
    estado_civil
}


  await pool.query('INSERT INTO usuario_informacion SET ?', [trabajador]);
  await pool.query('INSERT INTO informacion_adicional SET ?', [extra]);
    req.flash('success', 'Perfil Creado satisfactoriamente');
    res.redirect('/profile')
}
})







router.get('/public/:id',isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM trabajadores WHERE id_trabajador = ?', [id]);
    const ofertas = await pool.query('SELECT * FROM posttrabajadores  WHERE id_trabajador = ?',[id])
    const user = JSON.parse(JSON.stringify(users[0]))
    const oferta = JSON.parse(JSON.stringify(ofertas))
   const resultados={ user,oferta}
   
 res.render('empleador/public',resultados )
  
});





router.get('/new',isLoggedIn, async(req, res) => {

    const user = await pool.query('SELECT tipo_perfil FROM profiles WHERE id_perfil = ? AND tipo_perfil=1', [req.user.id]);
    if (user.length===1) {
        await pool.query('UPDATE profiles set tipo_perfil=2 WHERE id_perfil = ?', [req.user.id]);
        await res.redirect('/profile')
      }else{
        res.redirect('/profile')
      }
  
});


router.post('/new-notificacion/:id_empleador',isLoggedIn, async(req, res) => {
    const { id_empleador } = req.params;
    var {contenido} = req.body
    const id_trabajador= req.user.id
var contenido = 'Te ha solicitado trabajar en el empleo de ('+contenido+')'
    const rows = await pool.query('SELECT * FROM empleadores_notificaciones WHERE id_trabajador = ?', [id_trabajador]);
  if(rows==undefined || rows=="" || rows==null || rows.length < 1){
    const data= {
        id_empleador,
        id_trabajador,
        contenido
    };
await pool.query('INSERT INTO empleadores_notificaciones SET ?', [data]);
req.flash('success', 'Solicitud de empleo Enviada Satisfactoriamente');
res.redirect('/profile')
}else{
    req.flash('message', 'Ya has enviador una solicitud a esta empresa');
    res.redirect('/profile') 
}
});




router.post('/newtrabajador',isLoggedIn, async(req,res)=>{

    const { trabajo,descripcion} = req.body;   
const id_trabajador = req.user.id
    const post = {
        trabajo,
        descripcion,
        id_trabajador
        
    };
   await pool.query('INSERT INTO posttrabajadores SET ?', [post]);
    req.flash('success', 'Post ingresado satisfactoriamente');
    res.redirect('/profile')
})

router.get('/search',isLoggedIn, async (req,res)=>{
    res.render('trabajador/forms/search_form');
})





router.post('/results',isLoggedIn,async(req,res)=>{
  
    const {empleo} = req.body;
    const results = await pool.query('SELECT empleadores.id_empleador,empleadores.name, postempleadores.trabajo,postempleadores.descripcion FROM empleadores INNER JOIN postempleadores ON empleadores.id_empleador = postempleadores.id_empleador WHERE postempleadores.trabajo like "%'+empleo+'%" limit 100');
    
    res.json(JSON.parse(JSON.stringify({results}))) 

})


router.get('/new-post',isLoggedIn,async(req,res)=>{

    res.render('trabajador/forms/new_emp')
})


router.get('/posts',isLoggedIn,async(req,res)=>{
    const posts = await pool.query('SELECT * FROM posttrabajadores WHERE id_trabajador = ?', [req.user.id]);
    res.render('trabajador/all-posts', { posts });
})


router.get('/post/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const posts = await pool.query('SELECT * FROM posttrabajadores WHERE id_post = ?', [id]);

    res.render('trabajador/edit-post', {post: posts[0]});
});


router.post('/post/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion} = req.body; 
    const newLink = {
        titulo,
        descripcion
    
    };
    await pool.query('UPDATE posttrabajadores set ? WHERE id_post = ?', [newLink, id]);
    req.flash('success', 'Post Editado Satisfactoriamente');
    res.redirect('/employee/posts');
});



router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM posttrabajadores WHERE id_post = ?', [id]);
    req.flash('success', 'Post Eliminado Satisfactoriamente');
    res.redirect('/employee/posts');
});












router.post('/add',isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});




router.get('/notifications',isLoggedIn,async(req,res)=>{
    const notificaciones = await pool.query('SELECT * FROM trabajadores_notificaciones WHERE id_trabajador = ?', [req.user.id]);
    res.render('trabajador/all-notifications', { notificaciones });
})


module.exports = router;