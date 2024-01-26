const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-errors')
class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiError.BadRequest('Problems with validation', errors.array()))
            }
            const {userName, email, password} = req.body;
            const userData = await userService.registration(userName, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e);
        }
    }
    async getUsers(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const users = await userService.getAllUsers(refreshToken)
            return res.json(users)


        } catch (e) {
            next(e);
        }
    }
    async addPokemon(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const {selectedPokemon, coins} = req.body
            const userData = await userService.addPokemon(refreshToken, selectedPokemon,coins);
            return res.json(userData)
        }catch (e){
            next(e);
        }
    }
    async addCoins(req, res, next) {
        try {
            const {email, coins} = req.body;
            const userData = await userService.addCoins(email, coins);
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }
    async changeSelectPokemon(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const {selectedPokemon} = req.body
            const userData = await userService.changeSelectPokemon(refreshToken, selectedPokemon);
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async nextStep(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {stage} = req.body;
            const userData = await userService.nextStage(refreshToken, stage);
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new UserController()