const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('es');
const pool = require('../database');
const { isLoggedIn, isCompany,isEmployee } = require('../lib/auth');


//---------------------Aplicando el rol de empleado al usuario ingresado-------------------------
router.get('/new',isLoggedIn, async(req, res) => {
    const user = await pool.query('SELECT tipo_perfil FROM usuarios WHERE id = ? AND tipo_perfil=1', [req.user.id]);
    if (user.length===1) {
        await pool.query('UPDATE usuarios set tipo_perfil=2 WHERE id = ?', [req.user.id]);
        await res.redirect('/profile')
      }else{
          req.flash('message','Ha ocurrido un error inesperado, por favor intentelo Nuevamente')
        res.redirect('/profile')
      }
  
});


//--------------Registrando datos de Nuevo empleado----------------------------------------------------------
router.post('/new',isLoggedIn,isEmployee, async(req,res)=>{

    const { nombre,apellido,sexo,estado_civil,descripcion} = req.body;   
    var {fecha} = req.body 
    if(nombre==""  || nombre==null  || nombre==undefined  || apellido==""  ||  apellido==null   ||  apellido==undefined  ||sexo=="" ||sexo==null ||sexo==undefined || estado_civil=="" || estado_civil==null || estado_civil==undefined || fecha=="" || fecha==null || fecha==undefined || descripcion=="" || descripcion==null || descripcion==undefined ){
     
        req.flash('message', 'Por favor Completa todos los campos');
        res.redirect('/profile')
    }else{
       if( moment(fecha).isValid()){

     
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
}else{//Fecha invalida
    req.flash('message', 'Fecha Invalida');
    res.redirect('/profile')
}//fin de fecha invalida
}//fin de si no estan todos los a
});


//--------------Renderizando el formulario de busqueda de empleados------------------------------------------
router.get('/search',isLoggedIn,isEmployee, async (req,res)=>{
    res.render('trabajador/forms/search_form');
});


//-------------------Enviando por AJAX resultados de busqueda------------------------------------------------
router.post('/search',isLoggedIn,isEmployee, async(req,res)=>{
    var {empleo} = req.body;
    var empleo = '%'+empleo+'%'

        const results = await pool.query('SELECT publicaciones.id_remitente, publicaciones.trabajo ,publicaciones.descripcion,publicaciones.horario,usuario_informacion.nombre FROM publicaciones INNER JOIN usuario_informacion ON publicaciones.id_remitente = usuario_informacion.id_informacion  INNER JOIN usuarios ON usuario_informacion.id_informacion = usuarios.id WHERE  publicaciones.trabajo like ? AND usuarios.tipo_perfil = 3  LIMIT 100',[empleo]);

    await res.json(JSON.parse(JSON.stringify({results}))) 

})


//-------------------Renderizando el formulario de nueva oferta de trabajo----------------------------------- 
router.get('/new-post',isLoggedIn,isEmployee, async(req,res)=>{

    res.render('trabajador/forms/new_emp')
})


//-------------------Creando nuevo POST de oferta de trabajo-------------------------------------------------
router.post('/new-post',isLoggedIn,isEmployee, async(req,res)=>{

    const { trabajo,descripcion,horario} = req.body;
    if(trabajo =="" || trabajo==null  || trabajo ==undefined || horario ==null ||  horario==undefined || horario=="" ){
        req.flash('message','Por Favor Complete todos los campos obligatorios')
        res.redirect('/employee/new-post')
    }else{
   if(horario==="FULL-TIME"||horario==="PART-TIME"){

    const tipo_de_publicacion =1
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
    res.redirect('/employee/new-post')
}
}//fin de la comprobacion
})


//-------------------------------Obteniendo todas las publicaciones de X usuario-------------------------------
router.get('/posts',isLoggedIn,isEmployee,async(req,res)=>{
    const posts = await pool.query('SELECT * FROM publicaciones WHERE id_remitente = ?', [req.user.id]);
    res.render('trabajador/all-posts', { posts });
})


//-----------------------------Renderiza el formulario de X post----------------------------------------------
router.get('/post/:id',isLoggedIn,isEmployee, async (req, res) => {
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones WHERE id_post = ? AND id_remitente = ?', [id,req.user.id]);
    if(post==undefined || post=="" || post==null || post.length < 1){
        req.flash('message','ha ocurrido un error inesperado por favor vuelva a intentarlo');
        res.redirect('/employee/posts')
    }
    var post = JSON.parse(JSON.stringify(post[0]))

    const remitente = post.id_remitente

    if(req.user.id===remitente){

    res.render('trabajador/edit-post', {post});
}else{
    req.flash('message','No tienes los permisos necesarios para editar esta publicacion');
    res.redirect('/employee/posts');
}
});


//-----------------------------Actualizando datos de X post-------------------------
router.post('/post/:id',isLoggedIn,isEmployee, async (req, res) => {
    const { trabajo, descripcion} = req.body; 
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones WHERE id_post = ? AND id_remitente = ?', [id,req.user.id]);

    if(post==undefined || post=="" || post==null || post.length < 1){
        req.flash('message','ha ocurrido un error inesperado por favor vuelva a intentarlo');
        res.redirect('/employee/posts')
    }

    var post = JSON.parse(JSON.stringify(post[0]))

    const remitente = post.id_remitente


    
    if(req.user.id===remitente){
    if(trabajo=="" || trabajo==null || trabajo== undefined){

    req.flash('message','El campo Trabajo es obligatorio, por favor completelo')
    res.redirect('/employee/post/'+id)
    }else{

    const newLink = {
        trabajo,
        descripcion
    
    };

    await pool.query('UPDATE publicaciones set ? WHERE id_post = ?', [newLink, id]);
    req.flash('success', 'Post Editado Satisfactoriamente');
    res.redirect('/employee/posts');
}//fin de verificacion campo (trabajo) que no este vacio 
}else{//si el id es diferente del post
    req.flash('message','Hubo un error al modificar la publicacion, por favor intentelo nuevamente')
    res.redirect('/employee/posts')
}
});


//------------------------Borrando una publicacion de X empleado----------------------------------------------
router.get('/delete/:id',isLoggedIn,isEmployee, async (req, res) => {
    const { id } = req.params;

    var post= await pool.query('SELECT id_remitente FROM publicaciones WHERE id_post = ?  AND id_remitente = ?', [id,req.user.id]);
   
    if(post==undefined || post=="" || post==null || post.length < 1){
        req.flash('message','ha ocurrido un error inesperado por favor vuelva a intentarlo');
        res.redirect('/employee/posts')
    }
   var validacion =post
   
    var validacion = JSON.parse(JSON.stringify(validacion[0]))
    var validacion= validacion.id_remitente
    if(validacion===req.user.id){
    await pool.query('DELETE FROM publicaciones WHERE id_post = ? and id_remitente = ?', [id, req.user.id]);
    req.flash('success', 'Post Eliminado Satisfactoriamente');
    res.redirect('/employee/posts');
    
}else{
    req.flash('message', 'Ocurrio Un error Inesperado, Por favor vuelva a intentarlo');
    res.redirect('/employee/posts');
}
 
});


//-------------------------------Renderizando el perfil de X usuario-----------------------------------------
router.get('/public/:id',isLoggedIn,isCompany, async(req, res) => {
    const { id } = req.params;
    const validacion = await pool.query('SELECT * FROM usuarios WHERE id = ? AND tipo_perfil=2 AND activacion=1 ', [id]);
    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Hubo un error inesperado, por favor vuelva a intentarlo');
        res.redirect('/profile')
    }else{
    var user = await pool.query('SELECT usuarios.email, usuario_informacion.nombre,informacion_adicional.apellido, usuario_informacion.fecha, usuario_informacion.descripcion, informacion_adicional.sexo,informacion_adicional.estado_civil,usuario_informacion.telefono FROM usuario_informacion INNER JOIN informacion_adicional ON usuario_informacion.id_informacion = informacion_adicional.id_informacion INNER JOIN usuarios ON usuario_informacion.id_informacion = usuarios.id WHERE usuario_informacion.id_informacion = ?', [id]);
    const ofertas = await pool.query('SELECT * FROM publicaciones  WHERE id_remitente= ?',[id])
    var puntuacion = await pool.query('SELECT ROUND(AVG(puntuacion) ,1) AS "puntuacion"FROM puntuacion WHERE id_receptor= ?',[id])
    var puntuacion = JSON.parse(JSON.stringify(puntuacion[0]))

    var user = JSON.parse(JSON.stringify(user[0]))
  
     user.fecha = moment(user.fecha).fromNow(true);  
     const oferta = JSON.parse(JSON.stringify(ofertas))
   const resultados={ user,oferta,puntuacion}
   
 res.render('trabajador/public',resultados )
}
});


//-------------------------Enviando notificacion a X empleado--------------------------------
router.post('/new-notification/:id',isLoggedIn,isCompany, async(req,res)=>{
    const { id } = req.params; //es el id del usuario publicado
    var {trabajo} = req.body;

    const validacion = await pool.query('SELECT trabajo FROM publicaciones WHERE id_remitente = ? AND trabajo= ?', [id,trabajo]);
    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
  
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
       res.redirect('/company/search')

        }else{
            req.flash('message','Ya has enviado una solicitud anteriormente a este empleado, espera a que responda');
            res.redirect('/company/search')
        }




    }
})


//-------------------------renderizando todas las notificaciones de X usuario--------------------------------
router.get('/notifications',isLoggedIn,isEmployee, async(req,res)=>{
    const notificaciones = await pool.query('SELECT notificaciones.id_remitente, usuario_informacion.nombre,notificaciones.contenido FROM notificaciones INNER JOIN usuario_informacion ON notificaciones.id_remitente = usuario_informacion.id_informacion INNER JOIN usuarios ON usuario_informacion.id_informacion = usuarios.id  WHERE usuarios.tipo_perfil =3 AND notificaciones.id_receptor = ?', [req.user.id]);
    res.render('trabajador/all-notifications', { notificaciones });
})


//-------------------------aceptando/rechazando oferta de X empresa--------------------------------
router.post('/new-employee/:id',isLoggedIn,isEmployee, async(req,res)=>{
        const {id} = req.params;
        const {respuesta,trabajo} = req.body;
        var id_remitente = id
        var id_receptor = req.user.id
        const validacion= await pool.query('SELECT * FROM notificaciones WHERE id_remitente = ?  AND id_receptor = ?',[id_remitente,id_receptor])
        if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Ha ocurrido un error inesperado, Por favor vuelva a intentarlo');
        res.redirect('/employee/notifications')
        }else{
       
            if (respuesta==="accept") {

                const info={
                    id_remitente,
                    id_receptor,
                    trabajo
                }
                await pool.query('INSERT INTO empleados_activos SET ?', [info]);
                await pool.query('DELETE FROM notificaciones WHERE id_remitente = ?', [id]);
                req.flash('success','Felicitaciones, ya tienes un nuevo empleo')
                res.redirect('/employee/notifications')

            }else if (respuesta==="deny") {
                await pool.query('DELETE FROM notificaciones WHERE id_remitente = ?', [id_remitente]);
                req.flash('success','Empleado Rechazado Satisfactoriamente')
                res.redirect('/employee/notifications')
            }else{
                req.flash('message','Ha ocurrido un error inesperado, Por favor vuelva a intentarlo');
                res.redirect('/employee/notifications')
            }




            


        }//en el caso de que todos los datos sean correctos
})


//------------------------Mostrando todos los empleos actuales de X empleado----------------------------------
router.get('/companies',isLoggedIn,isEmployee, async(req,res)=>{
    const employees = await pool.query('SELECT empleados_activos.id, empleados_activos.id_receptor, usuario_informacion.nombre, empleados_activos.trabajo FROM empleados_activos INNER JOIN usuario_informacion ON empleados_activos.id_remitente = usuario_informacion.id_informacion WHERE empleados_activos.id_receptor =? AND empleados_activos.mostrar = 1', [req.user.id]);

    res.render('trabajador/all-companies', { employees });
})


//-------------------------enviando renuncia de X usuario
router.post('/give-up/:id/:id_receptor/:trabajo',isLoggedIn,isEmployee, async (req, res) => {
        const {id,id_receptor}= req.params

    const validacion = await pool.query('SELECT * FROM empleados_activos WHERE id= ? AND id_receptor = ?', [id,req.user.id]);

    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
    }else{
        const mostrar=0
        const obj = {
            mostrar,
           
        
        };
    
    
        await pool.query('UPDATE empleados_activos set ? WHERE id = ? AND id_receptor = ?', [obj,id,id_receptor]);
        req.flash('success','Has Renunciado satisfactoriamente');
        res.redirect('/employee/companies');


}
});


module.exports = router;