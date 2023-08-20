"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Stats_entity_1 = require("../../utils/typeorm/Stats.entity");
let StatsService = exports.StatsService = class StatsService {
    constructor(statsRepository) {
        this.statsRepository = statsRepository;
    }
    async createStats(newStats) {
        try {
            const stats = await this.statsRepository.save(newStats);
            return stats;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async updateStats(userId, type, mode, side, score, nbRound) {
        try {
            let stats = await this.statsRepository.findOne({
                where: { userId: userId },
            });
            if (!stats) {
                throw new Error('Stats not found');
            }
            if (mode === 'League') {
                stats = this.defineLeagueStats(stats, side, type, score, nbRound);
            }
            else if (mode === 'Party') {
                stats = this.definePartyStats(stats, side, type, score, nbRound);
            }
            else if (mode === 'Training') {
                stats = this.defineTrainingStats(stats, side, type, score, nbRound);
            }
            return await this.statsRepository.save(stats);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getStatsByUserId(userId) {
        const ret = {
            success: false,
            message: 'Catched an error',
        };
        try {
            const stats = await this.statsRepository.findOne({
                where: { userId: userId },
            });
            if (!stats) {
                ret.message = 'Stats not found';
                return ret;
            }
            ret.success = true;
            ret.message = 'Stats found';
            const statsImproved = {
                statsDB: stats,
                gameWon: 0,
                gameLost: 0,
                classicWon: stats.leagueClassicWon +
                    stats.partyClassicWon +
                    stats.trainingClassicWon,
                classicLost: stats.leagueClassicLost +
                    stats.partyClassicLost +
                    stats.trainingClassicLost,
                best3Won: stats.leagueBest3Won + stats.partyBest3Won + stats.trainingBest3Won,
                best3Lost: stats.leagueBest3Lost +
                    stats.partyBest3Lost +
                    stats.trainingBest3Lost,
                best5Won: stats.leagueBest5Won + stats.partyBest5Won + stats.trainingBest5Won,
                best5Lost: stats.leagueBest5Lost +
                    stats.partyBest5Lost +
                    stats.trainingBest5Lost,
                customWon: stats.partyCustomWon + stats.trainingCustomWon,
                customLost: stats.partyCustomLost + stats.trainingCustomLost,
                rageQuitWin: stats.leagueRageQuitWin + stats.partyRageQuitWin,
                rageQuitLost: stats.leagueRageQuitLost + stats.partyRageQuitLost,
                disconnectWin: stats.leagueDisconnectWin + stats.partyDisconnectWin,
                disconnectLost: stats.leagueDisconnectLost + stats.partyDisconnectLost,
                roundWon: stats.leagueRoundWon + stats.partyRoundWon + stats.trainingRoundWon,
                roundLost: stats.leagueRoundLost +
                    stats.partyRoundLost +
                    stats.trainingRoundLost,
                pointWon: stats.leaguePointWon + stats.partyPointWon + stats.trainingPointWon,
                pointLost: stats.leaguePointLost +
                    stats.partyPointLost +
                    stats.trainingPointLost,
            };
            statsImproved.gameWon =
                statsImproved.classicWon +
                    statsImproved.best3Won +
                    statsImproved.best5Won +
                    statsImproved.customWon;
            statsImproved.gameLost =
                statsImproved.classicLost +
                    statsImproved.best3Lost +
                    statsImproved.best5Lost +
                    statsImproved.customLost;
            ret.data = statsImproved;
            return ret;
        }
        catch (error) {
            ret.error = error;
            return ret;
        }
    }
    defineLeagueStats(stats, side, type, score, nbRound) {
        if (score.leftRound > score.rightRound) {
            if (side === 'Left') {
                if (type === 'Classic')
                    stats.leagueClassicWon += 1;
                else if (type === 'Best3')
                    stats.leagueBest3Won += 1;
                else if (type === 'Best5')
                    stats.leagueBest5Won += 1;
            }
            else {
                if (type === 'Classic')
                    stats.leagueClassicLost += 1;
                else if (type === 'Best3')
                    stats.leagueBest3Lost += 1;
                else if (type === 'Best5')
                    stats.leagueBest5Lost += 1;
            }
        }
        else {
            if (side === 'Left') {
                if (type === 'Classic')
                    stats.leagueClassicLost += 1;
                else if (type === 'Best3')
                    stats.leagueBest3Lost += 1;
                else if (type === 'Best5')
                    stats.leagueBest5Lost += 1;
            }
            else {
                if (type === 'Classic')
                    stats.leagueClassicWon += 1;
                else if (type === 'Best3')
                    stats.leagueBest3Won += 1;
                else if (type === 'Best5')
                    stats.leagueBest5Won += 1;
            }
        }
        if (score.rageQuit) {
            if (side === score.rageQuit)
                stats.leagueRageQuitLost += 1;
            else
                stats.leagueRageQuitWin += 1;
        }
        stats.leagueRoundWon +=
            side === 'Left' ? score.leftRound : score.rightRound;
        stats.leagueRoundLost +=
            side === 'Left' ? score.rightRound : score.leftRound;
        let leftPointWin = 0;
        let rightPointWin = 0;
        for (let i = 0; i < nbRound; i++) {
            leftPointWin += score.round[i].left;
            rightPointWin += score.round[i].right;
        }
        stats.leaguePointWon += side === 'Left' ? leftPointWin : rightPointWin;
        stats.leaguePointLost += side === 'Left' ? rightPointWin : leftPointWin;
        return stats;
    }
    definePartyStats(stats, side, type, score, nbRound) {
        if (score.rageQuit === 'Right' ||
            score.disconnect === 'Right' ||
            (score.leftRound > score.rightRound &&
                !score.rageQuit &&
                !score.disconnect)) {
            if (side === 'Left') {
                if (type === 'Classic')
                    stats.partyClassicWon += 1;
                else if (type === 'Best3')
                    stats.partyBest3Won += 1;
                else if (type === 'Best5')
                    stats.partyBest5Won += 1;
                else if (type === 'Custom')
                    stats.partyCustomWon += 1;
            }
            else {
                if (type === 'Classic')
                    stats.partyClassicLost += 1;
                else if (type === 'Best3')
                    stats.partyBest3Lost += 1;
                else if (type === 'Best5')
                    stats.partyBest5Lost += 1;
                else if (type === 'Custom')
                    stats.partyCustomLost += 1;
            }
        }
        else if (score.rageQuit === 'Left' ||
            score.disconnect === 'Left' ||
            (score.leftRound < score.rightRound &&
                !score.rageQuit &&
                !score.disconnect)) {
            if (side === 'Left') {
                if (type === 'Classic')
                    stats.partyClassicLost += 1;
                else if (type === 'Best3')
                    stats.partyBest3Lost += 1;
                else if (type === 'Best5')
                    stats.partyBest5Lost += 1;
                else if (type === 'Custom')
                    stats.partyCustomLost += 1;
            }
            else {
                if (type === 'Classic')
                    stats.partyClassicWon += 1;
                else if (type === 'Best3')
                    stats.partyBest3Won += 1;
                else if (type === 'Best5')
                    stats.partyBest5Won += 1;
                else if (type === 'Custom')
                    stats.partyCustomWon += 1;
            }
        }
        if (score.rageQuit) {
            if (side === score.rageQuit)
                stats.partyRageQuitLost += 1;
            else
                stats.partyRageQuitWin += 1;
        }
        else if (score.disconnect) {
            if (side === score.disconnect)
                stats.partyDisconnectLost += 1;
            else
                stats.partyDisconnectWin += 1;
        }
        stats.partyRoundWon += side === 'Left' ? score.leftRound : score.rightRound;
        stats.partyRoundLost +=
            side === 'Left' ? score.rightRound : score.leftRound;
        let leftPointWin = 0;
        let rightPointWin = 0;
        for (let i = 0; i < nbRound; i++) {
            leftPointWin += score.round[i].left;
            rightPointWin += score.round[i].right;
        }
        stats.partyPointWon += side === 'Left' ? leftPointWin : rightPointWin;
        stats.partyPointLost += side === 'Left' ? rightPointWin : leftPointWin;
        return stats;
    }
    defineTrainingStats(stats, side, type, score, nbRound) {
        if (score.leftRound > score.rightRound) {
            if (side === 'Left') {
                if (type === 'Classic')
                    stats.trainingClassicWon += 1;
                else if (type === 'Best3')
                    stats.trainingBest3Won += 1;
                else if (type === 'Best5')
                    stats.trainingBest5Won += 1;
                else if (type === 'Custom')
                    stats.trainingCustomWon += 1;
            }
            else {
                if (type === 'Classic')
                    stats.trainingClassicLost += 1;
                else if (type === 'Best3')
                    stats.trainingBest3Lost += 1;
                else if (type === 'Best5')
                    stats.trainingBest5Lost += 1;
                else if (type === 'Custom')
                    stats.trainingCustomLost += 1;
            }
        }
        else {
            if (side === 'Left') {
                if (type === 'Classic')
                    stats.trainingClassicLost += 1;
                else if (type === 'Best3')
                    stats.trainingBest3Lost += 1;
                else if (type === 'Best5')
                    stats.trainingBest5Lost += 1;
                else if (type === 'Custom')
                    stats.trainingCustomLost += 1;
            }
            else {
                if (type === 'Classic')
                    stats.trainingClassicWon += 1;
                else if (type === 'Best3')
                    stats.trainingBest3Won += 1;
                else if (type === 'Best5')
                    stats.trainingBest5Won += 1;
                else if (type === 'Custom')
                    stats.trainingCustomWon += 1;
            }
        }
        stats.trainingRoundWon +=
            side === 'Left' ? score.leftRound : score.rightRound;
        stats.trainingRoundLost +=
            side === 'Left' ? score.rightRound : score.leftRound;
        let leftPointWin = 0;
        let rightPointWin = 0;
        for (let i = 0; i < nbRound; i++) {
            leftPointWin += score.round[i].left;
            rightPointWin += score.round[i].right;
        }
        stats.trainingPointWon += side === 'Left' ? leftPointWin : rightPointWin;
        stats.trainingPointLost += side === 'Left' ? rightPointWin : leftPointWin;
        return stats;
    }
    async getStats() {
        return await this.statsRepository.find();
    }
};
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Stats_entity_1.Stats)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map