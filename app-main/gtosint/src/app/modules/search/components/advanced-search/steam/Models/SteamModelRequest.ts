/**
 * interface qui permet de rehercher les news d'un jeu
 */export interface SteamSearchGameNewsRequest{
  /**AppID du jeu auquel on veut connaître l’actualité */
  appid:string,
  /**Combien de nouvelles vous souhaitez retourner */
  count: number,
  /**Longueur maximale de chaque nouvelle. */
  maxlength:number,


}
/**
 * fonction permettant de creer un steamGameNewsRequest à partir de son appid
 * @param appid identifiant unique du jeu auquel on veut connaître l’actualité
 * @param count Combien de nouvelles vous souhaitez retourner
 * @param maxlength Longueur maximale de chaque nouvelle
 * @returns
 */
export function createSteamSearchGameNewsRequest(appid:string,count=10,maxlength=300):SteamSearchGameNewsRequest{
  return {appid:appid,count:count,maxlength:maxlength};

}


/**
 * interface permettant de rechercher les informations d'un jeu par rapport à un joueur
 */
export interface SteamProfileGamesInfoRequest{
  /** represente le steaid du joeur */
  steamid:string
  /**represnte l'identifiant unique du jeu */
  appid:string
  /**represente la langue du contenue des données ex: fr */
  language?:string
}


/** interface permettant de rechercher  les amis d'un profile steam si la visibilié du profile est publique
 *
 */
export interface SteamFrendProfileRequest{
  /**Identifiant Steam 64 bits pour qui recherche ses amis */
   steamid:string
   /**type de relation à rechercher */
   relationship:'friend'|'public',

}

/**
  * interface permettant de recuperer les jeux recements jouer par le joueur(dans les jeux)
  */
export interface SteamGetlastplayedRequest{
  /**represente l'identifiant steam du joueur */
  steamid:string,

  /**represente le nombre total de jeux à retourner */
  count?:number

}