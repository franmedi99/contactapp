const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('es');

const pool = require('../database');
const { isLoggedIn, isCompany,isEmployee } = require('../lib/auth');



//----------------------------INTENTO DE MERCADOPAGO-------------------------------
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
    access_token: 'PROD_ACCESS_TOKEN'
  });






//---------------------------------------------------------------------------------

//---------------------Aplicando el rol de compañía al usuario ingresado-------------------------
router.get('/new',isLoggedIn, async(req, res) => {
    const user = await pool.query('SELECT tipo_perfil FROM usuarios WHERE id = ? AND tipo_perfil=1', [req.user.id]);
    if (user.length===1) {
        await pool.query('UPDATE usuarios set tipo_perfil=3 WHERE id = ?', [req.user.id]);
        await res.redirect('/profile')
      }else{
          req.flash('message','Ha ocurrido un error inesperado, por favor intentelo Nuevamente')
        res.redirect('/profile')
      }
  
});


//--------------Registrando datos de Nueva Compañía----------------------------------------------------------
router.post('/new-company',isLoggedIn,isCompany, async(req,res)=>{

    const { nombre,descripcion} = req.body;  
    var {fecha} = req.body 
    if(nombre=="" ||fecha=="" || descripcion=="" ){
     
        req.flash('message', 'Por favor Completa todos los campos');
        res.redirect('/profile')
    }else{
       if( moment(fecha).isValid()){

     
    var fecha= moment(fecha).format('L')
  
    const id_informacion = req.user.id
    const empleador = {
        id_informacion,
        nombre,
        fecha,
        descripcion
        
    };


 await pool.query('INSERT INTO usuario_informacion SET ?', [empleador]);
    req.flash('success', 'Perfil Creado satisfactoriamente');
    res.redirect('/profile')
}else{//Fecha invalida
    req.flash('message', 'Fecha Invalida');
    res.redirect('/profile')
}//fin de fecha invalida
}
});


//--------------Renderizando el formulario de busqueda de empleados------------------------------------------
router.get('/search',isLoggedIn,isCompany, async (req,res)=>{
    res.render('empleador/forms/search_form');
});


//-------------------Enviando por AJAX resultados de busqueda------------------------------------------------
router.post('/search',isLoggedIn,isCompany, async(req,res)=>{
    var {empleo} = req.body;
    var empleo = '%'+empleo+'%'
    const results = await pool.query(' SELECT publicaciones.id_remitente, publicaciones.trabajo ,publicaciones.descripcion,publicaciones.horario,usuario_informacion.nombre,informacion_adicional.apellido FROM publicaciones INNER JOIN usuario_informacion ON publicaciones.id_remitente = usuario_informacion.id_informacion  INNER JOIN informacion_adicional ON usuario_informacion.id_informacion = informacion_adicional.id_informacion WHERE publicaciones.trabajo like ? LIMIT 100', [empleo]);
    await res.json(JSON.parse(JSON.stringify({results}))) 

})


//-------------------Renderizando el formulario de nueva oferta de trabajo----------------------------------- 
router.get('/new-post',isLoggedIn,isCompany, async(req,res)=>{

    res.render('empleador/forms/new_emp')
})


//-------------------Creando nuevo POST de oferta de trabajo-------------------------------------------------
router.post('/new-post',isLoggedIn,isCompany, async(req,res)=>{

    const { trabajo,descripcion,horario} = req.body;
    if(trabajo =="" || horario==""){
        req.flash('message','Por Favor Complete todos los campos obligatorios')
        res.redirect('/company/new-post')
    }else{
   if(horario==="FULL-TIME"||horario==="PART-TIME"){

    const tipo_de_publicacion = 2
const id_remitente = req.user.id
    const post = {
        trabajo,
        descripcion,
        horario,
        id_remitente,
        tipo_de_publicacion
        
    };
   await pool.query('INSERT INTO publicaciones SET ?', [post]);
    req.flash('success', 'Post ingresado satisfactoriamente');
    res.redirect('/profile')
}else{
    req.flash('message','Ocurrio un error inesperado')
    res.redirect('/company/new-post')
}
}//fin de la comprobacion
})


//-------------------------------Obteniendo todas las publicaciones de X usuario-------------------------------
router.get('/posts',isLoggedIn,isCompany,async(req,res)=>{
    const posts = await pool.query('SELECT * FROM publicaciones WHERE id_remitente = ?', [req.user.id]);
    res.render('empleador/all-posts', { posts });
})


//-----------------------------Renderiza el formulario de X post----------------------------------------------
router.get('/post/:id',isLoggedIn,isCompany, async (req, res) => {
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones WHERE id_post = ?', [id]);
    var post = JSON.parse(JSON.stringify(post[0]))

    const remitente = post.id_remitente

    if(req.user.id===remitente){

    res.render('empleador/edit-post', {post});
}else{
    req.flash('message','No tienes los permisos necesarios para editar esta publicacion');
    res.redirect('/company/posts');
}
});


//-----------------------------Actualizando datos de X post-------------------------
router.post('/post/:id',isLoggedIn,isCompany, async (req, res) => {
    const { trabajo, descripcion} = req.body; 
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones WHERE id_post = ?', [id]);
    var post = JSON.parse(JSON.stringify(post[0]))

    const remitente = post.id_remitente


    
    if(req.user.id===remitente){
    if(trabajo==""){

    req.flash('message','El campo Trabajo es obligatorio, por favor completelo')
    res.redirect('/company/post/'+id)
    }else{

    const newLink = {
        trabajo,
        descripcion
    
    };

    await pool.query('UPDATE publicaciones set ? WHERE id_post = ?', [newLink, id]);
    req.flash('success', 'Post Editado Satisfactoriamente');
    res.redirect('/company/posts');
}//fin de verificacion campo (trabajo) que no este vacio 
}else{//si el id es diferente del post
    req.flash('message','Hubo un error al modificar la publicacion, por favor intentelo nuevamente')
    res.redirect('/company/posts')
}
});


//-------------------------------Renderizando el perfil de X empleado-----------------------------------------
router.get('/public/:id',isLoggedIn,isEmployee, async(req, res) => {
    const { id } = req.params;
    const validacion = await pool.query('SELECT * FROM usuarios WHERE id = ? AND tipo_perfil=3 AND activacion=1 ', [id]);
    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Hubo un error inesperado, por favor vuelva a intentarlo');
        res.redirect('/profile')
    }else{
        var user = await pool.query('SELECT usuarios.email, usuario_informacion.nombre, usuario_informacion.fecha, usuario_informacion.descripcion,usuario_informacion.telefono FROM usuario_informacion INNER JOIN usuarios ON usuario_informacion.id_informacion = usuarios.id WHERE usuario_informacion.id_informacion = ?', [id]);
        const ofertas = await pool.query('SELECT * FROM publicaciones  WHERE id_remitente= ?',[id])

  
    var user = JSON.parse(JSON.stringify(user[0]))
    
     user.fecha = moment(user.fecha).fromNow();  

     const oferta = JSON.parse(JSON.stringify(ofertas))
   const resultados={ user,oferta}
   
 res.render('empleador/public',resultados )
}
});


//-------------------------Enviando notificacion a X empleado--------------------------------
router.post('/new-notification/:id',isLoggedIn,isEmployee, async(req,res)=>{
    const { id } = req.params;
    var {trabajo} = req.body;

    const validacion = await pool.query('SELECT trabajo FROM publicaciones WHERE id_remitente = ? AND trabajo= ?', [id,trabajo]);
    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        console.log('error en validacion 1')
        req.flash('message','Hubo un error inesperado, por favor vuelva a intentarlo');
        res.redirect('/profile')
    }else{
        
        const validacion2 = await pool.query('SELECT * FROM notificaciones WHERE id_remitente = ?', [req.user.id]);
        if( validacion2=="" || validacion2==null){
        const id_remitente = req.user.id;
        const id_receptor = id;
        const contenido = trabajo
        
                const post = {id_remitente,id_receptor,contenido}
       await pool.query('INSERT INTO notificaciones SET ?', [post]);
       req.flash('success','Solicitud enviada Satisfactoriamente');
       res.redirect('/employee/search')

        }else{
            req.flash('message','Ya has enviado una solicitud anteriormente a este empleado');
            res.redirect('/employee/search')
        }




    }
})


//------------------------Borrando una publicacion-----------------------------------------------------------
router.get('/delete/:id',isLoggedIn,isCompany, async (req, res) => {
    const { id } = req.params;

    var validacion = await pool.query('SELECT id_remitente FROM publicaciones WHERE id_post = ?', [id]);
    var validacion = JSON.parse(JSON.stringify(validacion[0]))
    var validacion= validacion.id_remitente
    if(validacion===req.user.id){
    await pool.query('DELETE FROM publicaciones WHERE id_post = ?', [id]);
    req.flash('success', 'Post Eliminado Satisfactoriamente');
    res.redirect('/company/posts');
    
}else{
    req.flash('message', 'Ocurrio Un error Inesperado, Por favor vuelva a intentarlo');
    res.redirect('/company/posts');
}
 
});

//-------------------------renderizando todas las notificaciones de X usuario--------------------------------
router.get('/notifications',isLoggedIn,isCompany, async(req,res)=>{
    var notificaciones = await pool.query('SELECT notificaciones.id_remitente, usuario_informacion.nombre,informacion_adicional.apellido,notificaciones.contenido FROM notificaciones INNER JOIN usuario_informacion ON notificaciones.id_remitente = usuario_informacion.id_informacion INNER JOIN informacion_adicional ON usuario_informacion.id_informacion = informacion_adicional.id_informacion  WHERE id_receptor  = ?', [req.user.id]);
    const employees = await pool.query('SELECT empleados_activos.id, empleados_activos.id_receptor, usuario_informacion.nombre ,informacion_adicional.apellido, empleados_activos.trabajo FROM empleados_activos INNER JOIN usuario_informacion ON empleados_activos.id_receptor = usuario_informacion.id_informacion INNER JOIN informacion_adicional ON usuario_informacion.id_informacion = informacion_adicional.id_informacion  WHERE empleados_activos.id_remitente = ? AND empleados_activos.mostrar=0', [req.user.id]);



    
    res.render('empleador/all-notifications', {notificaciones, employees});
})


//-------------------------aceptando/rechazando oferta de X empleado--------------------------------
router.post('/new-employee/:id',isLoggedIn,isCompany, async(req,res)=>{
        const {id} = req.params;
        const {respuesta,trabajo} = req.body;
        var id_remitente = id
        var id_receptor = req.user.id
        const validacion= await pool.query('SELECT * FROM notificaciones WHERE id_remitente = ?  AND id_receptor = ?',[id_remitente,id_receptor])
        if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Ha ocurrido un error inesperado, Por favor vuelva a intentarlo');
        res.redirect('/company/notifications')
        }else{
       
            if (respuesta==="accept") {
               var id_remitente =req.user.id
               var id_receptor = id
                const info={
                    id_remitente,
                    id_receptor,
                    trabajo
                }
                await pool.query('INSERT INTO empleados_activos SET ?', [info]);
                await pool.query('DELETE FROM notificaciones WHERE id_remitente = ?', [id]);
                req.flash('success','Felicitaciones, ya tienes un nuevo empleado')
                res.redirect('/company/notifications')

            }else if (respuesta==="deny") {
                await pool.query('DELETE FROM notificaciones WHERE id_remitente = ?', [id_remitente]);
                req.flash('success','Empleado Rechazado Satisfactoriamente')
                res.redirect('/company/notifications')
            }else{
                req.flash('message','Ha ocurrido un error inesperado, Por favor vuelva a intentarlo');
                res.redirect('/company/notifications')
            }




            


        }//en el caso de que todos los datos sean correctos
})


//------------------------Mostrando todos los empleados actuales de X empresa----------------------------------
router.get('/employees',isLoggedIn,isCompany, async(req,res)=>{
    const employees = await pool.query('SELECT empleados_activos.id, empleados_activos.id_receptor, usuario_informacion.nombre ,informacion_adicional.apellido, empleados_activos.trabajo FROM empleados_activos INNER JOIN usuario_informacion ON empleados_activos.id_receptor = usuario_informacion.id_informacion INNER JOIN informacion_adicional ON usuario_informacion.id_informacion = informacion_adicional.id_informacion  WHERE empleados_activos.id_remitente = ? AND empleados_activos.mostrar=1', [req.user.id]);

    res.render('empleador/all-employees', { employees });
})


//-------------------------Remderizando el formulario para calificar X empleado
router.get('/dismiss/:id/:id_receptor/:trabajo',isLoggedIn,isCompany, async (req, res) => {
        const {id,id_receptor,trabajo}= req.params

    const validacion = await pool.query('SELECT * FROM empleados_activos WHERE id_remitente = ? AND id = ? AND id_receptor = ?', [req.user.id,id,id_receptor]);

    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
    }else{
    const datos={id,id_receptor,trabajo}
        res.render('empleador/calificar',datos);
}
});


//--------------------------Borrando empleado de X empresa----------------------------------------------------
router.post('/dismiss/:id/:id_receptor/:trabajo',isLoggedIn,isCompany, async (req, res) => {
    var {id,id_receptor,trabajo}= req.params
    const {review,puntuacion} = req.body
    if( puntuacion==="1" ||puntuacion==="2" || puntuacion==="3"|| puntuacion==="4"||puntuacion==="5"){
    const validacion = await pool.query('SELECT * FROM empleados_activos WHERE id_remitente = ? AND id = ? AND id_receptor = ?', [req.user.id,id,id_receptor]);

    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
    }else{
        var id_remitente =req.user.id

         const info={
             id_remitente,
             id_receptor,
             puntuacion,
             trabajo,
             review
         }
  
       await pool.query('INSERT INTO puntuacion SET ?', [info]);
       await pool.query('DELETE FROM empleados_activos WHERE id_remitente = ? AND id= ?', [req.user.id,id]);
        req.flash('success','Felicitaciones, Empleado calificado Satisfactoriamente')
        res.redirect('/company/employees')
}
}else{//si puntuacion no es del 1 al 5
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
}
});


module.exports = router;