//const createUserToken = require('../helpers/create_user_token')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/Users')
const Territorio = require('../models/Territorios')
const jwt = require('jsonwebtoken')
const createUserToken = require('../helpers/create_user_token')

module.exports = class UserController {


    static async Login (req, res){

        const {email, password} = req.body

        console.log(email, password)

        if(!email){
            res.status(410).json({message: "Digite seu email"})
            return
        }
        if(!password){
            res.status(410).json({message: "Digite sua senha"})
            return
        }

        const user = await User.findOne({email: email})

        if(!user){
             res.status(410).json({message: "email nao cadastrado"})
             return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(410).json({message: 'Senha errada'})
            return
        }
        await createUserToken(user, req, res)
    }


    static async createUser (req, res){
        const {email, password} = req.body

        //res.status(210).json({name: name, password: password})
        if(!email){
            res.status(410).json({message: 'Digite seu e-mail'})
            return
        }
        if(!password){
            res.status(410).json({message: 'Digite sua senha'})
            return
        }

        //verificar se já existe alguem com esse nome
        const userExist = await User.findOne({email: email})

        if(userExist){
            res.status(422).json({message: "Já existe existe esse usuário !"})
            return
        }
        
        //criando uma senha criptografada
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User ({
            email: email,
            password: passwordHash
        })
        console.log(user)

        try {
            const newUser = await user.save()
            res.status(201).json({message: "deu tudo certo"})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}