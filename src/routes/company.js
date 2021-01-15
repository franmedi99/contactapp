const express = require('express');
const router = express.Router();
const moment = require('moment');
const request = require('request');
const https = require('https');
moment.locale('es');

const pool = require('../database');
const { isLoggedIn, isCompany,isEmployee } = require('../lib/auth');


//----------------------------INTENTO DE MERCADOPAGO-------------------------------
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-4799699007120477-122114-57f59901256952cb3879c03725469d62-584130093',
});


router.get('/suscription',isLoggedIn,isCompany, async(req,res)=>{
    var sub = await pool.query('SELECT id_suscripcion FROM usuario_informacion WHERE id_informacion = ?', [req.user.id]);
    var sub = JSON.parse(JSON.stringify(sub[0]))
    var sub = sub.id_suscripcion
    if(sub==="" || sub===undefined){
        request.get({
            "headers": { "Authorization": "Bearer APP_USR-7373336386837931-122318-7b0464d82f7f09257558d83eccf165bb-692207214"},
            "url": "https://api.mercadopago.com/preapproval/search?status=authorized&payer_email="+req.user.email,
    
        }, async(error,response, body) => {
            if(error) {
                return res.send("error");
            }
            if(body){            
            
            var object = JSON.parse(body)
           var object = object.results[0];
           if(object===undefined || object===""){
             
              res.render('empleador/suscription/plans')
          }else{
              
            const id_suscripcion = object.id
            await pool.query('UPDATE usuario_informacion set id_suscripcion=? WHERE id_informacion = ?', [id_suscripcion,req.user.id]);
            await res.redirect('/company/suscription')
  
          
          }
    
            
        
        
            }
        });
      
        
    }else{//en el caso de que haya un id de suscripcion

        res.render('empleador/suscription/cancel');
      
    }
    
});

router.post('/mercadopago',isLoggedIn,isCompany, async(req, res) => {
    const id = req.user.id
       
   request.get({
        "headers": { "Authorization": "Bearer APP_USR-7373336386837931-122318-7b0464d82f7f09257558d83eccf165bb-692207214"},
        "url": "https://api.mercadopago.com/preapproval/search?status=authorized&payer_email="+req.user.email,

    }, async(error,response, body) => {
        if(error) {
            return res.send("error");
        }

        if(body){            
        
        var object = JSON.parse(body)
       var object = object.results[0];
       if(object===undefined || object===""){
           res.redirect("https://www.mercadopago.com/mla/debits/new?preapproval_plan_id=2c93808476adade80176af60847f048b")
          
      }else{
           
        const user = await pool.query('SELECT usuario_informacion.nombre, puntuacion.review,puntuacion.trabajo,puntuacion.puntuacion FROM usuario_informacion INNER JOIN puntuacion ON  usuario_informacion.id_informacion = puntuacion.id_remitente  WHERE puntuacion.id_receptor = ?', [id])

        if(user===undefined || user==="" || user===null || user.length < 1){
        
            req.flash('message', 'Ha ocurrido un error inesperado, por favor vuelva a intentarlo');
            res.redirect('/profile');
        
        }else{
            const datos = JSON.parse(JSON.stringify(user))
           
            res.render('empleador/historial',{datos});
        }
      
      }

        
    
    
        }
    });
  
});



router.post('/cancel-suscription',isLoggedIn,isCompany, async(req, res) => {
    var sub = await pool.query('SELECT id_suscripcion FROM usuario_informacion WHERE id_informacion = ?', [req.user.id]);
    var sub = JSON.parse(JSON.stringify(sub[0]))
    var sub = sub.id_suscripcion
    request.put({
        "headers": { "Authorization": "Bearer APP_USR-7373336386837931-122318-7b0464d82f7f09257558d83eccf165bb-692207214", "Content-Type": "application/json"},
        "url": "https://api.mercadopago.com/preapproval/"+sub,
        "body" : JSON.stringify({"status": "cancelled"})
        
        

    }, async(error,response, body) => {
        if(error) {
            return res.send("error");
        }

        if(body){            
        
            const id_suscripcion = ""
            await pool.query('UPDATE usuario_informacion set id_suscripcion=? WHERE id_informacion = ?', [id_suscripcion,req.user.id]);
            req.flash('success','Plan Cancelado Satisfactoriamente')
            res.redirect('/company/suscription')


      }

        
    
    
        
    });
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

    const { nombre,descripcion,telefono} = req.body;  
    var {fecha} = req.body 
    if(nombre==="" ||nombre===null  || nombre===undefined || fecha==="" || fecha===null || fecha===undefined || descripcion==="" || descripcion===null || descripcion===undefined || telefono==="" ||telefono===null || telefono===undefined){
     
        req.flash('message', 'Por favor Completa todos los campos');
        res.redirect('/profile')
    }else{
       if( moment(fecha).isValid()){

  
    const id_firma = req.user.id
    const firma = {
        id_firma,
        nombre,
        fecha,
        descripcion,
        telefono
        
    };


 await pool.query('INSERT INTO usuarios_firma SET ?', [firma]);
 await pool.query('UPDATE usuarios set perfil=1 WHERE id = ?', [req.user.id]);
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
    const results = await pool.query('SELECT  publicaciones_empleados.id_empleado, publicaciones_empleados.trabajo ,publicaciones_empleados.descripcion,publicaciones_empleados.horario,usuarios_empleado.nombre,usuarios_empleado.apellido,usuarios_empleado.apellido,usuarios_empleado.puntuacion FROM publicaciones_empleados INNER JOIN usuarios_empleado ON publicaciones_empleados.id_empleado =  usuarios_empleado.id_empleado WHERE publicaciones_empleados.trabajo like ? ORDER BY puntuacion DESC LIMIT 100', [empleo]);

    await res.json(JSON.parse(JSON.stringify({results}))) 

});

//-------------------------------Renderizando el perfil de X empresa-----------------------------------------
router.get('/public/:id',isLoggedIn,isEmployee, async(req, res) => {
    const { id } = req.params;
    const validacion = await pool.query('SELECT * FROM usuarios WHERE id = ? AND tipo_perfil=3 AND activacion=1 ', [id]);
    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Hubo un error inesperado, por favor vuelva a intentarlo');
        res.redirect('/profile')
    }else{
        var profile = await pool.query('SELECT usuarios.email, usuarios_firma.nombre,  usuarios_firma.fecha, usuarios_firma.descripcion, usuarios_firma.telefono FROM usuarios_firma INNER JOIN usuarios ON  usuarios_firma.id_firma = usuarios.id WHERE  usuarios_firma.id_firma = ?', [id]);
        const ofertas = await pool.query('SELECT * FROM publicaciones_firmas  WHERE id_firma = ?',[id])

  
        var profile = JSON.parse(JSON.stringify(profile[0]))
    
        profile.fecha =  moment().diff(profile.fecha, 'years');
       
        if(profile.fecha==="0" || profile.fecha===0){
            profile.fecha = "este año"
         
        }else if(profile.fecha==="1" || profile.fecha===1){
            profile.fecha = "hace "+profile.fecha+" año"
        }else{
            profile.fecha = "hace "+profile.fecha+" años"
        }
        profile.id = req.params.id
         
     const oferta = JSON.parse(JSON.stringify(ofertas))
   const resultados={ profile,oferta}

 res.render('empleador/public',resultados )
}
});


//-------------------------Enviando notificacion a X empresa--------------------------------
router.post('/new-notification/:id',isLoggedIn,isEmployee, async(req,res)=>{
    const { id } = req.params;
    var {trabajo} = req.body;

    const validacion = await pool.query('SELECT trabajo FROM publicaciones_firmas WHERE id_firma = ? AND trabajo= ?', [id,trabajo]);
    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Hubo un error inesperado');
        res.redirect('/employee/search')
    }else{
        
        const validacion2 = await pool.query('SELECT * FROM notificaciones_firmas WHERE id_empleado = ?', [req.user.id]);
       
        if( validacion2==="" || validacion2.length<1){
        const id_firma = id;
        const id_empleado = req.user.id;
        const contenido = trabajo
        
        const post = {id_firma,id_empleado,contenido}
       await pool.query('INSERT INTO notificaciones_firmas SET ?',[post]);
       req.flash('success','Solicitud enviada Satisfactoriamente');
       res.redirect('/employee/search')

        }else{
            req.flash('message','Ya has enviado una solicitud anteriormente a esta empresa');
            res.redirect('/employee/search')
        }




    }
})


//-------------------Renderizando el formulario de nueva oferta de trabajo----------------------------------- 
router.get('/new-post',isLoggedIn,isCompany, async(req,res)=>{

    res.render('empleador/forms/new_emp')
});


//-------------------Creando nuevo POST de oferta de trabajo-------------------------------------------------
router.post('/new-post',isLoggedIn,isCompany, async(req,res)=>{

    const { trabajo,descripcion,horario} = req.body;
    if(trabajo==="" || trabajo===undefined  || trabajo===null || horario==="" || horario===null || horario===undefined){
        req.flash('message','Por Favor Complete todos los campos obligatorios')
        res.redirect('/company/new-post')
    }else{
   if(horario==="FULL-TIME"||horario==="PART-TIME"){

    const id_firma = req.user.id
    const post = {
        id_firma,
        trabajo,
        descripcion,
        horario 
    };
   await pool.query('INSERT INTO publicaciones_firmas SET ?', [post]);
    req.flash('success', 'Oferta de empleo creada Satisfactoriamente');
    res.redirect('/profile')
}else{
    req.flash('message','Ocurrio un error inesperado')
    res.redirect('/company/new-post')
}
}//fin de la comprobacion
});


//-------------------------------Obteniendo todas las publicaciones de X usuario-------------------------------
router.get('/posts',isLoggedIn,isCompany,async(req,res)=>{
    const posts = await pool.query('SELECT * FROM publicaciones_firmas WHERE id_firma = ?', [req.user.id]);
    res.render('empleador/all-posts', { posts });
});


//-----------------------------Renderiza el formulario de X post----------------------------------------------
router.get('/post/:id',isLoggedIn,isCompany, async (req, res) => {
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones_firmas WHERE id_publicacion = ?', [id]);
    var post = JSON.parse(JSON.stringify(post[0]))

    const firma= post.id_firma

    if(req.user.id===firma){

    res.render('empleador/edit-post', {post});
}else{
    req.flash('message','No tienes los permisos necesarios para editar esta publicacion');
    res.redirect('/company/posts');
}
});


//-----------------------------Actualizando datos de X post-------------------------
router.post('/post/:id',isLoggedIn,isCompany, async (req, res) => {
    const { trabajo, descripcion,horario} = req.body; 
    const { id } = req.params;
    var post = await pool.query('SELECT * FROM publicaciones_firmas WHERE id_publicacion = ?', [id]);
    var post = JSON.parse(JSON.stringify(post[0]))

    const firma = post.id_firma


    
    if(req.user.id===firma){
    if(trabajo===""){

    req.flash('message','El campo Trabajo es obligatorio')
    res.redirect('/company/post/'+id)
    }else{

    const newLink = {
        trabajo,
        descripcion,
        horario
    
    };

    await pool.query('UPDATE publicaciones_firmas set ? WHERE id_publicacion = ?', [newLink, id]);
    req.flash('success', 'Publicacion editada Satisfactoriamente');
    res.redirect('/company/posts');
}//fin de verificacion campo (trabajo) que no este vacio 
}else{//si el id es diferente del post
    req.flash('message','Hubo un error al modificar la publicacion, por favor intentelo nuevamente')
    res.redirect('/company/posts')
}
});


//------------------------Borrando una publicacion-----------------------------------------------------------
router.get('/delete/:id',isLoggedIn,isCompany, async (req, res) => {
    const { id } = req.params;

    var validacion = await pool.query('SELECT id_firma FROM publicaciones_firmas WHERE id_publicacion = ?', [id]);
    var validacion = JSON.parse(JSON.stringify(validacion[0]))
    var validacion= validacion.id_firma
    if(validacion===req.user.id){
    await pool.query('DELETE FROM publicaciones_firmas WHERE id_publicacion = ?', [id]);
    req.flash('success', 'Publicacion elimitada Satisfactoriamente');
    res.redirect('/company/posts');
    
}else{
    req.flash('message', 'Ocurrio Un error Inesperado, Por favor vuelva a intentarlo');
    res.redirect('/company/posts');
}
 
});

//-------------------------renderizando todas las notificaciones de X usuario--------------------------------
router.get('/notifications',isLoggedIn,isCompany, async(req,res)=>{
    var notificaciones = await pool.query('SELECT notificaciones_firmas.id_empleado, usuarios_empleado.nombre,usuarios_empleado.apellido,notificaciones_firmas.contenido FROM notificaciones_firmas INNER JOIN usuarios_empleado ON notificaciones_firmas.id_empleado = usuarios_empleado.id_empleado WHERE id_firma  = ?', [req.user.id]);
    const employees = await pool.query('SELECT empleados_activos.id, empleados_activos.id_empleado, usuarios_empleado.nombre ,usuarios_empleado.apellido, empleados_activos.trabajo FROM empleados_activos INNER JOIN usuarios_empleado ON empleados_activos.id_empleado = usuarios_empleado.id_empleado  WHERE empleados_activos.id_firma = ? AND empleados_activos.mostrar=0', [req.user.id]);
    const confirmaciones = await pool.query('SELECT usuarios_empleado.id_empleado,usuarios_empleado.nombre,usuarios_empleado.apellido,confirmaciones.trabajo FROM confirmaciones INNER JOIN usuarios_empleado ON confirmaciones.id_empleado = usuarios_empleado.id_empleado WHERE id_firma = ?',[req.user.id])


    
    res.render('empleador/all-notifications', {notificaciones, employees,confirmaciones});
})


//-------------------------aceptando/rechazando oferta de X empleado--------------------------------
router.post('/new-employee/:id',isLoggedIn,isCompany, async(req,res)=>{
        const {id} = req.params;
        const {respuesta,trabajo} = req.body;
        const validacion= await pool.query('SELECT * FROM confirmaciones WHERE id_firma = ? AND  id_empleado = ? AND trabajo=?',[req.user.id,id,trabajo])
        if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Ha ocurrido un error inesperado, Por favor vuelva a intentarlo');
        res.redirect('/company/notifications')
        }else{
       
            if (respuesta==="accept") {
               var id_firma =req.user.id
               var id_empleado = id
                const info={
                    id_firma,
                    id_empleado,
                    trabajo
                }
                await pool.query('INSERT INTO empleados_activos SET ?', [info]);
                await pool.query('DELETE FROM confirmaciones WHERE id_empleado = ? AND id_firma=? AND trabajo=?', [id,req.user.id,trabajo]);
                req.flash('success','Felicitaciones, ya tienes un nuevo empleado')
                res.redirect('/company/notifications')

            }else if (respuesta==="deny") {
                await pool.query('DELETE FROM confirmaciones WHERE id_empleado = ? AND id_firma=? AND trabajo=?', [id,req.user.id,trabajo]);
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
    const employees = await pool.query('SELECT empleados_activos.id, empleados_activos.id_empleado, usuarios_empleado.nombre ,usuarios_empleado.apellido, empleados_activos.trabajo FROM empleados_activos INNER JOIN usuarios_empleado ON empleados_activos.id_empleado = usuarios_empleado.id_empleado WHERE empleados_activos.id_firma= ? AND empleados_activos.mostrar=1', [req.user.id]);

    res.render('empleador/all-employees', { employees });
})


//-------------------------Remderizando el formulario para calificar X empleado
router.get('/dismiss/:id/:id_empleado/:trabajo',isLoggedIn,isCompany, async (req, res) => {
        const {id,id_empleado,trabajo}= req.params

    const validacion = await pool.query('SELECT * FROM empleados_activos WHERE  id = ? AND  id_firma = ?  AND id_empleado = ?', [id,req.user.id,id_empleado]);

    if(validacion===undefined || validacion==="" || validacion===null || validacion.length < 1){
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
    }else{
    const datos={id,id_empleado,trabajo}
        res.render('empleador/calificar',datos);
}
});


//--------------------------Borrando empleado de X empresa----------------------------------------------------
router.post('/dismiss/:id/:id_empleado/:trabajo',isLoggedIn,isCompany, async (req, res) => {
    var {id,id_empleado,trabajo}= req.params
    const {review,puntuacion} = req.body
    if( puntuacion==="1" ||puntuacion===1 ||  puntuacion==="2" || puntuacion===2 || puntuacion==="3"|| puntuacion===3 || puntuacion==="4" || puntuacion===4 || puntuacion==="5" || puntuacion===5 && puntuacion){
    const validacion = await pool.query('SELECT * FROM empleados_activos WHERE id = ? AND  id_firma = ?  AND id_empleado = ?', [id,req.user.id,id_empleado]);

    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
    }else{
        var id_firma =req.user.id

         const info={
             id_firma,
             id_empleado,
             puntuacion,
             trabajo,
             review
         }
  
       await pool.query('INSERT INTO puntuacion SET ?', [info]);
       await pool.query('DELETE FROM empleados_activos WHERE id= ? AND id_firma = ?', [id,req.user.id]);
       var nota = await pool.query('SELECT ROUND(AVG(puntuacion) ,1) AS "puntuacion" FROM puntuacion WHERE id_empleado= ?',[id_empleado])
       var nota = JSON.parse(JSON.stringify(nota[0]))
       var nota = nota.puntuacion

       await pool.query('UPDATE usuarios_empleado set puntuacion=? WHERE id_empleado = ?', [nota,id_empleado]);
        req.flash('success','Empleado calificado Satisfactoriamente')
        res.redirect('/company/employees')
}
}else{//si puntuacion no es del 1 al 5
    req.flash('message','Ha ocurrido un error inesperado Por favor vuelve a intentarlo');
    res.redirect('/company/employees')
}
});

module.exports = router;