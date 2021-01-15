module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },

    isNotLoggedIn (req, res, next) {
        if (!req.user) {
            return next();
        }
        return res.redirect('/profile');
    },


    isEmployee (req, res, next) {
        if (req.user.tipo_perfil===2) {
            return next();
        }
        req.flash('message','No tienes los permisos necesarios para entrar a esta seccion')
        return res.redirect('/profile');
    },
    


    
    isCompany(req, res, next) {
        if (req.user.tipo_perfil===3) {
            return next();
        }
        req.flash('message','No tienes los permisos necesarios para entrar a esta seccion')
        return res.redirect('/profile');
    }

};