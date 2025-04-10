const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: String,
    id: Number,
    level: Number,
    starLevel: Number,
    evolutionLevel: Number,
    maxLevel: Number,
    maxEvolutionLevel: Number,
    rarity: String,
    elixirCost: Number,
    iconUrls: {
        medium: String,
        evolutionMedium: String,
    },
});

const ClanSchema = new mongoose.Schema({
    tag: String,
    name: String,
    badgeId: Number,
});

const PlayerSchema = new mongoose.Schema({
    tag: String,
    name: String,
    trophyChange: Number,
    crowns: Number,
    kingTowerHitPoints: Number,
    princessTowersHitPoints: [Number],
    clan: ClanSchema,
    cards: [CardSchema],
    supportCards: [CardSchema],
    globalRank: Number,
    elixirLeaked: Number,
});

const ArenaSchema = new mongoose.Schema({
    id: Number,
    name: String,
});

const GameModeSchema = new mongoose.Schema({
    id: Number,
    name: String,
});

const BattleSchema = new mongoose.Schema({
    type: String,
    battleTime: Date,
    isLadderTournament: Boolean,
    arena: ArenaSchema,
    gameMode: GameModeSchema,
    deckSelection: String,
    team: [PlayerSchema],
    opponent: [PlayerSchema],
    isHostedMatch: Boolean,
    leagueNumber: Number,
});

module.exports = mongoose.model('Battle', BattleSchema);
