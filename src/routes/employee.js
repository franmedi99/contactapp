const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('es');
const pool = require('../database');
const { isLoggedIn, isCompany,isEmployee } = require('../lib/auth');
const fs = require('fs-extra')
const { getVideoDurationInSeconds } = require('get-video-duration');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})









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
    const verify1 = await pool.query('SELECT * FROM usuarios_firma WHERE id_firma = ?', [req.user.id]);
    const verify2 = await pool.query('SELECT * FROM usuarios_empleado WHERE id_empleado = ?', [req.user.id]);
    if(verify1===undefined || verify1==="" || verify1===null || verify1.length < 1 && verify2===undefined || verify2==="" || verify2===null || verify2.length < 1){
    
    
         const { nombre,apellido,sexo,estado_civil,descripcion,telefono} = req.body;   
    var {fecha,facebook,instagram,twitter} = req.body 
    if(nombre===""  || nombre===null  || nombre===undefined  || apellido===""  ||  apellido===null   ||  apellido===undefined  ||sexo==="" ||sexo===null ||sexo===undefined || estado_civil==="" || estado_civil===null || estado_civil===undefined || fecha==="" || fecha===null || fecha===undefined || descripcion==="" || descripcion===null || descripcion===undefined || telefono==="" || telefono===null || telefono===undefined){
     
        req.flash('message', 'Por favor Completa todos los campos');
        res.redirect('/profile')
    }else{
       if( moment(fecha).isValid()){

     if(instagram!==""){
        var instagram = "instagram.com/"+instagram
     }
     if(twitter!==""){
         var twitter = "twitter.com/"+twitter
     }
 

    if(req.fileValidationError) {
        req.flash('message', req.fileValidationError)
        res.redirect('/profile')
        }else{
            console.log(req.file)
    if(req.file!==undefined){
    await getVideoDurationInSeconds(req.file.path).then(async(duration) => {
    var a = Math.round(duration);
    if(a<10){
       const result = await cloudinary.v2.uploader.upload(req.file.path,{resource_type: "video"});
        await fs.unlink(req.file.path)
        const video= result.secure_url
        const id_empleado = req.user.id
        const trabajador = {
            id_empleado,
            nombre,
            apellido,
            descripcion,
            fecha,
           telefono,
            sexo,
            estado_civil,
            video,
            facebook,
            instagram,
            twitter
        };
        await pool.query('INSERT INTO usuarios_empleado SET ?', [trabajador]);
        await pool.query('UPDATE usuarios set perfil=1 WHERE id = ?', [req.user.id]);
        req.flash('success', 'Perfil Creado satisfactoriamente');
        res.redirect('/profile')
    }else{
        await fs.unlink(req.file.path)
        req.flash('message','el video no puede durar mas de 10 segundos')
        res.redirect('/profile')
    }
    //22mb de maximo
    }) .catch(error => {
    return res.send(error)
    })
    }else{


        const id_empleado = req.user.id
        const trabajador = {
            id_empleado,
            nombre,
            apellido,
            descripcion,
            fecha,
           telefono,
            sexo,
            estado_civil,
            facebook,
            instagram,
            twitter
       
        };
        await pool.query('INSERT INTO usuarios_empleado SET ?', [trabajador]);
        await pool.query('UPDATE usuarios set perfil=1 WHERE id = ?', [req.user.id]);
        req.flash('success', 'Perfil Creado satisfactoriamente');
        res.redirect('/profile')
    }
    }//fin de si no hay req.fileValidationError







}else{//Fecha invalida
    req.flash('message', 'Fecha Invalida');
    res.redirect('/profile')
}//fin de fecha invalida
}//fin de si estan todos los campos llenos
}else{//en el caso en el que exista su perfil
    req.flash('message','Ha ocurrido un error inesperado por favor vuelva a intentarlo')
    res.redirect('/profile')
}
});


//--------------Renderizando el formulario de busqueda de empleados------------------------------------------
router.get('/search',isLoggedIn,isEmployee, async(req,res)=>{
    res.render('trabajador/forms/search_form');
});


//-------------------Enviando por AJAX resultados de busqueda------------------------------------------------
router.post('/search',isLoggedIn,isEmployee, async(req,res)=>{
    var {empleo} = req.body;
    var empleo = '%'+empleo+'%'

        const results = await pool.query('SELECT publicaciones_firmas.id_publicacion, publicaciones_firmas.trabajo ,publicaciones_firmas.descripcion,publicaciones_firmas.horario,usuarios_firma.nombre,usuarios_firma.id_firma FROM publicaciones_firmas INNER JOIN usuarios_firma ON publicaciones_firmas.id_firma = usuarios_firma.id_firma  WHERE  publicaciones_firmas.trabajo like ? LIMIT 100',[empleo]);

    await res.json(JSON.parse(JSON.stringify({results}))) 

});


//-------------------------Enviando notificacion a X empleado--------------------------------
router.post('/new-notification/:id',isLoggedIn,isCompany, async(req,res)=>{
    const { id } = req.params; //es el id del usuario publicado
    var {trabajo} = req.body;

    const validacion = await pool.query('SELECT trabajo FROM publicaciones_empleados WHERE id_empleado = ? AND trabajo= ?', [id,trabajo]);
    if(validacion===undefined || validacion==="" || validacion===null || validacion.length < 1){
  
        req.flash('message','Hubo un error inesperado, por favor vuelva a intentarlo');
        res.redirect('/profile')
    }else{
        
        const validacion2 = await pool.query('SELECT * FROM notificaciones_empleados WHERE id_firma = ?', [req.user.id]);
        if( validacion2==="" || validacion2===null ||validacion2.length===0){
        const id_firma = req.user.id;
        const id_empleado = id;
        const contenido = trabajo
        
                const post = {id_firma,id_empleado,contenido}
       await pool.query('INSERT INTO notificaciones_empleados SET ?', [post]);
       req.flash('success','Solicitud enviada Satisfactoriamente');
       res.redirect('/company/search')

        }else{
            req.flash('message','Ya has enviado una solicitud anteriormente a este empleado, espera a que responda');
            res.redirect('/company/search')
        }




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
    var profile = await pool.query('SELECT usuarios.email, usuarios_empleado.nombre,usuarios_empleado.apellido, usuarios_empleado.fecha, usuarios_empleado.descripcion, usuarios_empleado.sexo,usuarios_empleado.estado_civil,usuarios_empleado.telefono,usuarios_empleado.video,usuarios_empleado.facebook,usuarios_empleado.instagram,usuarios_empleado.twitter FROM usuarios_empleado INNER JOIN usuarios ON usuarios_empleado.id_empleado = usuarios.id WHERE usuarios_empleado.id_empleado = ?', [id]);
    const ofertas = await pool.query('SELECT * FROM publicaciones_empleados  WHERE id_empleado= ?',[id])
    var puntuacion = await pool.query('SELECT puntuacion  AS "puntuacion" FROM usuarios_empleado WHERE id_empleado= ?',[id])
    var puntuacion = JSON.parse(JSON.stringify(puntuacion[0]))
    var puntuacion = puntuacion.puntuacion
   if(puntuacion==="" || puntuacion.length <1){
    var puntuacion=undefined
    
   }
    var video = profile[0].video
    var profile = JSON.parse(JSON.stringify(profile[0]))
  
    profile.fecha =  moment().diff(profile.fecha, 'years');
    
    profile.id = req.params.id
     const oferta = JSON.parse(JSON.stringify(ofertas))
     

     if(video==="" || video===undefined){
    const resultados={profile,oferta,puntuacion}
    res.render('trabajador/public',resultados )
     }else{
    const resultados={profile,oferta,puntuacion,video}
    res.render('trabajador/public',resultados )
}
 
}
});


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

  
const id_empleado = req.user.id
    const post = {
        trabajo,
        descripcion,
        horario,
        id_empleado,
        
    };
   await pool.query('INSERT INTO publicaciones_empleados SET ?', [post]);
    req.flash('success', 'Oferta Creada Satisfactoriamente');
    res.redirect('/profile')
}else{
    req.flash('message','Ocurrio un error inesperado')
    res.redirect('/employee/new-post')
}
}//fin de la comprobacion
})


//-------------------------------Obteniendo todas las publicaciones de X usuario-------------------------------
router.get('/posts',isLoggedIn,isEmployee,async(req,res)=>{
    const posts = await pool.query('SELECT * FROM publicaciones_empleados WHERE id_empleado = ?', [req.user.id]);
    res.render('trabajador/all-posts', { posts });
})


//-----------------------------Renderiza el formulario de X post----------------------------------------------
router.get('/post/:id',isLoggedIn,isEmployee, async (req, res) => {
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones_empleados WHERE id_publicacion = ? AND id_empleado = ?', [id,req.user.id]);
    if(post==undefined || post=="" || post==null || post.length < 1){
        req.flash('message','ha ocurrido un error inesperado por favor vuelva a intentarlo');
        res.redirect('/employee/posts')
    }
    var post = JSON.parse(JSON.stringify(post[0]))

    const empleado = post.id_empleado

    if(req.user.id===empleado){

    res.render('trabajador/edit-post', {post});
}else{
    req.flash('message','No tienes los permisos necesarios para editar esta publicacion');
    res.redirect('/employee/posts');
}
});


//-----------------------------Actualizando datos de X post-------------------------
router.post('/post/:id',isLoggedIn,isEmployee, async (req, res) => {
    const { trabajo, descripcion,horario} = req.body; 
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones_empleados WHERE id_publicacion = ? AND id_empleado = ?', [id,req.user.id]);

    if(post==undefined || post=="" || post==null || post.length < 1){
        req.flash('message','ha ocurrido un error inesperado por favor vuelva a intentarlo');
        res.redirect('/employee/posts')
    }

    var post = JSON.parse(JSON.stringify(post[0]))

    const empleado = post.id_empleado

    
    if(req.user.id===empleado){
    if(trabajo==="" || trabajo===" " || trabajo===null || trabajo===undefined){

    req.flash('message','El campo Trabajo es obligatorio, por favor completelo')
    res.redirect('/employee/post/'+id)


    }else{
        if(horario==="FULL-TIME"||horario==="PART-TIME"){
    const newLink = {
        trabajo,
        descripcion,
        horario
    
    };

    await pool.query('UPDATE publicaciones_empleados set ? WHERE id_publicacion = ?', [newLink, id]);
    req.flash('success', 'Post Editado Satisfactoriamente');
    res.redirect('/employee/posts');
}else{
    req.flash('message','El campo Horario solo puede ser PART-TIME/FULL-TIME')
    res.redirect('/employee/post/'+id)
}//si no es part-time o full-time
}//fin de verificacion campo (trabajo) que no este vacio 
}else{//si el id es diferente del post
    req.flash('message','Hubo un error al modificar la publicacion, por favor intentelo nuevamente')
    res.redirect('/employee/posts')
}
});


//------------------------Borrando una publicacion de X empleado----------------------------------------------
router.post('/delete/:id',isLoggedIn,isEmployee, async (req, res) => {
    const { id } = req.params;

    var post= await pool.query('SELECT id_empleado FROM publicaciones_empleados WHERE id_publicacion = ?  AND id_empleado = ?', [id,req.user.id]);
   
    if(post==undefined || post=="" || post==null || post.length < 1){
       
        req.flash('message','ha ocurrido un error inesperado por favor vuelva a intentarlo');
        res.redirect('/employee/posts')
    }
   var validacion =post
   
    var validacion = JSON.parse(JSON.stringify(validacion[0]))
    var validacion= validacion.id_empleado
    if(validacion===req.user.id){
    await pool.query('DELETE FROM publicaciones_empleados WHERE id_publicacion = ? and id_empleado = ?', [id, req.user.id]);
    req.flash('success', 'Post Eliminado Satisfactoriamente');
    res.redirect('/employee/posts');
    
}else{
    req.flash('message', 'Ocurrio Un error Inesperado, Por favor vuelva a intentarlo');
    res.redirect('/employee/posts');
}
 
});


//-------------------------renderizando todas las notificaciones de X usuario--------------------------------
router.get('/notifications',isLoggedIn,isEmployee, async(req,res)=>{
    const notificaciones = await pool.query('SELECT notificaciones_empleados.id_notificacion,notificaciones_empleados.contenido, usuarios_firma.nombre,usuarios_firma.id_firma FROM notificaciones_empleados INNER JOIN usuarios_firma ON notificaciones_empleados.id_firma = usuarios_firma.id_firma INNER JOIN usuarios ON usuarios_firma.id_firma = usuarios.id  WHERE notificaciones_empleados.id_empleado = ?', [req.user.id]);
    res.render('trabajador/all-notifications', { notificaciones });
});


//-------------------------aceptando/rechazando oferta de X empresa--------------------------------
router.post('/new-employee/:id_firma/:id_notificacion',isLoggedIn,isEmployee, async(req,res)=>{
        const {id_firma,id_notificacion} = req.params;
        const {respuesta,trabajo} = req.body;
        const id_empleado = req.user.id
        const validacion= await pool.query('SELECT * FROM notificaciones_empleados WHERE id_empleado=? AND id_firma=? AND id_notificacion=?',[req.user.id,id_firma,id_notificacion])
        if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Ha ocurrido un error inesperado, Por favor vuelva a intentarlo');
        res.redirect('/employee/notifications')
        }else{
       
            if (respuesta==="accept"){

                const info={
                    id_firma,
                    id_empleado,
                    trabajo
                }
                await pool.query('INSERT INTO confirmaciones SET ?', [info]);
                await pool.query('DELETE FROM notificaciones_empleados WHERE id_notificacion = ? AND id_empleado=?', [id_notificacion,req.user.id]);
                req.flash('success','Felicitaciones, Solo falta una confirmación de parte de la empresa')
                res.redirect('/employee/notifications')

            }else if (respuesta==="deny") {
                await pool.query('DELETE FROM notificaciones_empleados WHERE id_notificacion = ? AND id_empleado=?', [id_notificacion,req.user.id]);
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
    const employees = await pool.query('SELECT empleados_activos.id, empleados_activos.id_firma, usuarios_firma.nombre, empleados_activos.trabajo FROM empleados_activos INNER JOIN usuarios_firma ON empleados_activos.id_firma= usuarios_firma.id_firma WHERE empleados_activos.id_empleado =? AND empleados_activos.mostrar = 1', [req.user.id]);

    res.render('trabajador/all-companies', { employees });
})


//-------------------------enviando renuncia de X usuario
router.post('/give-up/:id/:trabajo',isLoggedIn,isEmployee, async (req, res) => {
        const {id,trabajo}= req.params

    const validacion = await pool.query('SELECT * FROM empleados_activos WHERE id= ? AND id_empleado = ? AND trabajo = ?', [id,req.user.id,trabajo]);

    if(validacion===undefined || validacion==="" || validacion===null || validacion.length < 1){
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
    }else{
        const mostrar=0
        const obj = {
            mostrar,
           
        
        };
    
    
        await pool.query('UPDATE empleados_activos set ? WHERE id = ? AND id_empleado=?', [obj,id,req.user.id]);
        req.flash('success','Has Renunciado satisfactoriamente');
        res.redirect('/employee/companies');


}
});


module.exports = router;