const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const userDto = require('../dtos/user-dto')
const ApiErrors = require('../exceptions/api-errors')
const jwt = require('jsonwebtoken')
class UserService {
    async registration(userName, email, password) {
    const candidate = await UserModel.findOne({email})
        if(candidate) {
            throw ApiErrors.BadRequest(`User with this email or name is exist`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({userName, email, password: hashPassword});
        const userData = new userDto(user);
        const tokens = tokenService.generateTokens({...userData});
        await tokenService.saveToken(userData.id, tokens.refreshToken);
        user.isActivated = true;
        user.coins = 20;
        await  user.save();

        return {
            ...tokens,
            user: userData
        }
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if(!user){
            throw ApiErrors.BadRequest('User does not exist');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiErrors.BadRequest('Password is not true')
        }
        const userData = new userDto(user);
        const tokens = tokenService.generateTokens({...userData});
        await tokenService.saveToken(userData.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userData
        }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiErrors.UnauthorizedError();
        }
        const userData = tokenService.validationRefreshToken(refreshToken);
        const tokenFromBd = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromBd){
            throw ApiErrors.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id);
        const UserData = new userDto(user);
        const tokens = tokenService.generateTokens({...UserData});
        await tokenService.saveToken(UserData.id, tokens.refreshToken);
        return {
            ...tokens,
            user: UserData
        }
    }
    async getAllUsers(refreshToken) {
        const userData = tokenService.validationRefreshToken(refreshToken);
        const currentUser = await UserModel.findById(userData.id);
        const users = await UserModel.find()
        const indexCurrentUser = users.findIndex(user => user.userName === currentUser.userName);
        if(indexCurrentUser > -1){
            const splicedUsers = users.splice(indexCurrentUser, 1);
        }
        return users
    }

    async addPokemon(refreshToken, selectedPokemon, coins) {
        if(!refreshToken){
            throw ApiErrors.UnauthorizedError();
        }
        const userData = tokenService.validationRefreshToken(refreshToken);
        const tokenFromBd = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromBd){
            throw ApiErrors.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id);
        user.arrPokemons.push(selectedPokemon);
        user.selectedPokemon = selectedPokemon;
        user.coins = coins;
        await user.save();
        const UserData = new userDto(user);
        return {
            user: UserData
        }
    }
    async addCoins(email, coins){
        const user = await UserModel.findOne({email});
        user.coins = coins;
        user.save();
        const UserData = new userDto(user);
        return {
            user: UserData
        }
    }
    async changeSelectPokemon(refreshToken, selectedPokemon){
        if(!refreshToken){
            throw ApiErrors.UnauthorizedError();
        }
        const userData = tokenService.validationRefreshToken(refreshToken);
        const tokenFromBd = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromBd){
            throw ApiErrors.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id);
        user.selectedPokemon = selectedPokemon;
        await user.save();
        const UserData = new userDto(user);
        return {
            user: UserData
        }
    }
    async nextStage(refreshToken, stage){
        if(!refreshToken){
            throw ApiErrors.UnauthorizedError();
        }
        const userData = tokenService.validationRefreshToken(refreshToken);
        const tokenFromBd = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromBd){
            throw ApiErrors.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id);
        user.stageInOfflineArena = stage;
        await user.save();
        const UserData = new userDto(user);
        return {
            user: UserData
        }
    }
}

module.exports = new UserService()
