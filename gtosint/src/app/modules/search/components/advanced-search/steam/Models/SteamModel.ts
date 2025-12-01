

/**
 * interface contennat le steamid du joueur (profile) utile à la recherche des informations de ce dernier
 */
export interface SteamId{
  steamid:string
}


export interface SteamCarouselItem {
  link: string;             // Route interne sur votre site (ex. /game/1 ou /profile/3)
  backgroundImage: string;  // URL de l'image de fond
  title?: string;           // Titre optionnel
  description: string;      // Description ou informations spécifiques
}


/**
 * interface contenant les informations du profile du joueur
 */
export interface SteamUserInfo{
  steamid: string
  personaname: string
  avatar: string
  avatarmedium:string
  avatarfull:string
  lastlogoff:number
  communityvisibilitystate:1|0
  loccountrycode:string
  gamesInfos?:SteamGameInfos[]
}

/**interface representant un succès du coté joueur */
export interface SteamAchevement{
/**represnte le nom api du succès */
name:string
/**true si le succès à été debloqué */
achieved:true|false
/**Date à laquelle le succès a été débloqué en entier */
unlocktime?:number
/**Nom du succès localisé */
displayName:string
/**description du succès */
description:string
icon:string
}

/**
 * interface representant un ami d'un profile steam
 */
export interface SteamFrendProfile{
  /**Steam ID 64 bits de l’ami */
   steamid:string
   /**Qualificatif de relation */
   relationship:'friend'|'public',
   /**Horodatage Unix de l’heure à laquelle la relation a été créée */
   friend_since:number

}

/**
 * interface representant un news d'un jeux steam
 */
export interface  SteamNewsItem {
  /**identifiant de l'item */
  gid: string;
  /**le titre de la nouvelle */
  title: string;
  /**le lien externe de la nouvelle */
  url: string;
  /**verifie si il ya un lien externe */
  is_external_url: boolean;
  /**author de la nouvelle */
  author: string;
  /**le contenu de la nouvelle */
  contents: string;
  /**Il s'agit d'un libellé affiché à l'utilisateur qui décrit le groupe ou la catégorie du flux d'actualités. */
  feedlabel: string;
  /**il sagit de la date de la creation de l'actualité repsenter en Timestamp Unix (en secondes)  */
  date: number;
  feedname: string;
  /**il s'agit du niveau de priorité de l'information ex 1 pour les publications officiels*/
  feed_type: number;
  /**represente l'identifiant unique du jeu concerner */
  appid: number;
}


/**
 * interface contennat les informations d'un jeux steam
 */
export interface SteamGameInfos {
  /**Identifiant unique du jeu*/
  steamGameId: SteamGameId;
  /**represente Le nombre total de minutes jouées  par le joeur*/
  playtime_forever: number;
  /** Le nombre total de minutes jouées au cours des 2 dernières semaines*/
  playtime_2weeks: number;
  img_icon_url: string;
  /**permet de savoir si les statistiques du joueur concernant ce jeu sont visible  */
   has_community_visible_stats?: boolean;
  /**contient les actualité du jeu */
  newsItems?:SteamNewsItem[]
  steamGameDetails?:SteamGameDetails;
  rawgGameDetails?:RawgGameDetails

}
/**
 * interface contenant les informations d'indentification du jeu
 */
export interface SteamGameId{
   /**Identifiant unique du jeu*/
  appid: number;
  /**represente le titre du jeu*/
  title?: string;
}

/**interface representant une statistique d'un succès d'un jeu  */
export interface SteamGameStat{
  /**represnte le nom de la statistique */
  name:string
  /**represente  la valeur de la statistique  */
  value:number
  displayName?:string
  }


/**
   * interface representant l'ensemble des succès debloqué par le joueur ainsi que les statisques de ses succès
   */
export interface SteamGameProfilesStats{
     /**represente l'ensemble des succès debloqué par le joueur */
      steamProfileGamesAchevements:SteamProfileGamesAchevements,
    /**represente les statistique de ses succès */
    stats:SteamGameStat[]

  }

/**
 * interface representant tous les success d'un jeu debloqué ou qui doivent etre debloqué par un joeur et
 */
export interface SteamProfileGamesAchevements{
  /** represente le steaid du joeur */
  steamid:number
  /**represnte le titre du joueur */
  gameName:string
  /**represente la liste des succes du jeu */
  achievements:SteamAchevement[]
}

/**
 * interface permettant de rechercher un profile steam via son pseudo custom
 */
export interface SteamCustomPseudo{
  /**represente le pseudo custom du compte steam */
  customPseudo:string;
}

/**
 * interface contenant le l'url de l'image du fond d'un jeu
 */
export interface GameImage {
  appid:string;
  image: string;
}


export interface GameImagesResponse {
  images: GameImage[];
}

export interface RawgSearchResult {
  slug: string;
  name: string;
  background_image: string;
}

export interface RawgSearchResponse {
  results: RawgSearchResult[];
}

export interface RawgGameDetails {
  slug:string;
  name: string;
  description: string;      // Description en HTML
  description_raw: string;  // Description en texte brut
  background_image: string;
  released:string;
  genres:genre[];
  // Ajoutez d'autres propriétés si nécessaire
}
export interface genre{
  id:string ;
  name:string;
  slug: string;
  image_background:string;


}
/**interface contenant les details généraux d'un jeu steam */
export interface SteamGameDetails {
  steam_appid: string;
  name: string;
  is_free:1|0
  release_date: string;
  header_image: string;            // Image de couverture
  capsule_image: string;
  achievements:generalInfoAchevements;
  genres: string[];
  date_publication:string;
  short_description: string;
  detailed_description: string;
  website: string;
  developers: string[];
  publishers: string[];

}

export interface generalInfoAchevement{
  name:string;
  path:string;
}

export interface generalInfoAchevements{
 total:number;
 highlighted:generalInfoAchevement[];
}