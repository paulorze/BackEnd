import { Router } from 'express';
import { usersModel } from '../dao/models/users.model.js';

const router = Router();

router.post('/signup', async (req, res)=> {
    try {
        const {username, first_name, last_name, email, age, password, password2 } = req.body;
        if (password !== password2) {
            return res.status(406).send({status:'error', message: 'Por favor, verifique que ambas contraseñas sean iguales.'})
        };
        const exists_username = await usersModel.findOne({username});
        const exists_email = await usersModel.findOne({email});
        if (exists_username || exists_email) {
            return res.status(400).send({ status: 'error', message: 'El usuario o el email ingresados ya existen.'});
        }
        await usersModel.create({
            username,
            first_name,
            last_name,
            email,
            age,
            password
        });
        return res.status(201).send({status: 'success', message: 'Usuario registrado.'});
    } catch (e) {
        res.status(500).send({status: 'error', message: e.message});
    }
});

router.post('/login', async (req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await usersModel.findOne({email, password});
        if (!user) {
            return res.status(400).send({status: 'error', message: 'Email o contraseña inválidos.'})
        };
        req.session.user = {
            username: user.username,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            isAdmin: user.role === 'admin' //calculo que para que esto sea mas seguro, se puede cambiar 'admin' por una contrasenia segura y que sea variable de entorno
        };
        res.status(200).send({status: 'success', message: 'Inicio de sesion exitoso'});
    } catch (e) {
        return res.status(500).send({status: 'error', message: e.message});
    }
});

router.get('/logout', (req, res)=>{
    req.session.destroy(error =>{
        if (error) return res.status(500).send({status: 'error', message: 'Fallo al cerrar sesion'});
        res.redirect('/');
    });
});

export default router;