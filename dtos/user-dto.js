
module.exports = class UserDto {
    userName;
    email;
    id;
    isActivated;
    arrPokemons;
    coins;
    selectedPokemon;
    stageInOfflineArena;

    constructor(model) {
        this.userName = model.userName;
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.arrPokemons = model.arrPokemons;
        this.coins = model.coins;
        this.selectedPokemon = model.selectedPokemon;
        this.stageInOfflineArena = model.stageInOfflineArena;
    }
}
