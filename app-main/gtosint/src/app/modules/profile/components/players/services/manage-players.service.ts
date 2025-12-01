import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../../../../../shared/models/player';

@Injectable({
  providedIn: 'root',
})
export class ManagePlayersService {
  private listResultPlayers: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([
    {
      id: 1,
      name: 'Maelig',
      pseudos: 'pseudo',
      email: '',
      phone: '1234566789',
      games: null,
      country: 'France'
    },
    {
      id: 2,
      name: 'Michel',
      pseudos: 'Jason',
      email: '',
      phone: '1234566789',
      games: null,
      country: 'France'
    },
  ]);
  listResultPlayers$ = this.listResultPlayers.asObservable();

  // function createPlayer(id: number, mail: string, phone: string, pseudos: string[]): Player {
  //   return {
  //     id,
  //     mail,
  //     phone,
  //     pseudos,
  //     games: []
  //   };
  // }

  // function addGameToPlayer(player: Player, game: Game, hoursPlayed: number): void {
  //   const existingGame = player.games.find(pg => pg.game.id === game.id);

  //   if (existingGame) {
  //     existingGame.hoursPlayed += hoursPlayed;
  //   } else {
  //     player.games.push({ game, hoursPlayed });
  //   }
  // }
}