import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect: 'fail-register'}), async (req, res)=> {
    res.send({status: 'success', message: 'Usuario registrado satisfactoriamente.'})
});

router.get('/fail-register', async (req, res) => {
    res.status(500).send({status: 'error', message: 'Falló el registro.'})
});

router.post('/login', passport.authenticate('login', {failureRedirect: 'fail-login'}), async (req, res) =>{
    if (!req.user) return res.status(401).send({status: 'error', message: 'Credenciales incorrectas.'});
    req.session.user = {
        username: req.user.username,
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        isAdmin: req.user.role === 'admin' //calculo que para que esto sea mas seguro, se puede cambiar 'admin' por una contrasenia segura y que sea variable de entorno
    };
    res.status(200).send({status: 'success', message: 'Inicio de sesión exitoso'});
});

router.get('/fail-login', async (req, res) => {
res.status(500).send({status: 'error', message: 'Falló el inicio de sesión.'});
});

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {
    res.send({status: 'success', message: 'user registered'});
});

router.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/user-profile');
});

router.get('/logout', (req, res)=>{
    req.session.destroy(error =>{
        if (error) return res.status(500).send({status: 'error', message: 'Fallo al cerrar sesion'});
        res.redirect('/');
    });
});

export default router;