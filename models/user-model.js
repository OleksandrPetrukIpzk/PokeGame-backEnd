const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    userName: {type: String, unique: true, require: true},
    email: {type: String, unique: true, require: true},
    password: {type: String, require: true},
    isActivated: {type: Boolean, default: false},
    selectedPokemon: {type:String, default: ''},
    arrPokemons: {type: Array, default: []},
    coins: {type: Number, default: 0},
    stageInOfflineArena: {type: Number, default: 1}
})

module.exports = model('User', UserSchema)
