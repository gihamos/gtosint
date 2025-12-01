export interface Player {
    tag: string;
    name: string;
    level: number;
    trophies: number;
    bestTrophies: number;
    wins: number;
    losses: number;
    battleCount: number;
    threeCrownWins: number;
    challengeCardsWon: number;
    challengeMaxWins: number;
    tournamentCardsWon: number;
    tournamentBattleCount: number;

    arenaName: string;

    leagueStatistics: {
        currentSeason: {
            trophies: number;
            bestTrophies: number;
        };
        bestSeason: {
            trophies: number;
        };
    };

    // Le clan est maintenant un objet séparé
    clan: {
        name: string;
        donations: number;
        donationsReceived: number;
        totalDonations: number;
    };
}

export interface Chest {
    index: number;
    name: string;
}

export interface ClashResponse {
    player: Player;
    chests: Chest[];
}