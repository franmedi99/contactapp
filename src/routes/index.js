const express = require('express');
const { isNotLoggedIn } = require('../lib/auth');
const router = express.Router();
const pool = require('../database');
const moment = require('moment');
router.get('/',isNotLoggedIn, async (req, res) => {
    res.render('index');
});

router.get('/publico/:id', async(req, res) => {
    const { id } = req.params;
    const validacion = await pool.query('SELECT * FROM usuarios WHERE id = ? AND tipo_perfil=2 AND activacion=1 ', [id]);
    if(validacion==undefined || validacion=="" || validacion==null || validacion.length < 1){
        req.flash('message','Hubo un error inesperado, por favor vuelva a intentarlo');
        res.redirect('/profile')
    }else{
    var profile = await pool.query('SELECT usuarios.email, usuarios_empleado.nombre,usuarios_empleado.apellido, usuarios_empleado.fecha, usuarios_empleado.descripcion, usuarios_empleado.sexo,usuarios_empleado.estado_civil,usuarios_empleado.telefono,usuarios_empleado.video,usuarios_empleado.facebook,usuarios_empleado.instagram,usuarios_empleado.twitter FROM usuarios_empleado INNER JOIN usuarios ON usuarios_empleado.id_empleado = usuarios.id WHERE usuarios_empleado.id_empleado = ?', [id]);

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
    
     

    const resultados={profile,puntuacion,video}
    res.render('profile_public',resultados )


}
});



module.exports = router;