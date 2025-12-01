export function cleanData(data) {
  if (!data) {return {};}

  // Suppression des valeurs `null` dans la carrière
  function cleanCareerStats(response) {
    if (!response.stats) {return;}

    const paths = [
      ['stats', 'pc', 'quickplay'],
      ['stats', 'pc', 'competitive'],
      ['stats', 'console', 'quickplay'],
      ['stats', 'console', 'competitive']
    ];

    for (const path of paths) {
      let obj = response;

      // Vérifier si les clés existent avant d'y accéder
      for (const key of path) {
        if (!obj || obj[key] === null) {
          obj = null;
          break;
        }
        obj = obj[key];
      }

      // Si obj est valide et contient des statistiques de carrière
      if (obj && obj.career_stats && obj.career_stats.heroSpecific) {
        for (const hero in obj.career_stats.heroSpecific) {
          if (obj.career_stats.heroSpecific[hero] === null) {
            delete obj.career_stats.heroSpecific[hero];
          }
        }
      }
    }
  }

  cleanCareerStats(data);

  // Arrondi des valeurs numériques
  function roundNumbers(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'number') {
        obj[key] = Math.round(obj[key]);
      } else if (typeof obj[key] === 'object') {
        roundNumbers(obj[key]);
      }
    }
  }
  roundNumbers(data);

  // Formatage des timestamps
  if (data.summary?.last_updated_at) {
    const timestamp = data.summary.last_updated_at;
    data.summary.last_updated_at = new Date(timestamp * 1000).toISOString();
  }

  // Normalisation des noms des héros
  if (data.stats?.pc?.quickplay?.heroes_comparisons?.time_played?.values) {
    data.stats.pc.quickplay.heroes_comparisons.time_played.values.forEach(hero => {
      if (hero.hero) {
        hero.hero = hero.hero.replace('-', '').toLowerCase();
      }
    });
  }

  // Suppresion de herocomparisons qu'on trouve dans career_stats
  const tempPlat =data.stats.pc;
  if(tempPlat) {
    if (tempPlat.quickplay) {
      delete tempPlat.quickplay.heroes_comparisons;
    }
    if (tempPlat.competitive) {
      delete tempPlat.competitive.heroes_comparisons;
    }
  }

  const tempPlat2 =data.stats.console;
  if(tempPlat2) {
    if (tempPlat2.quickplay) {
      delete tempPlat2.quickplay.heroes_comparisons;
    }
    if (tempPlat2.competitive) {
      delete tempPlat2.competitive.heroes_comparisons;
    }
  }

  /**
     * Reformatage du json pour le model.
     * @param {*} obj
     */
  function transformToModel(obj) {
    for (const key in obj) {
      if (key === 'all-heroes') {
        obj['allHeroes'] = obj[key]; // Renomme "all-heroes" en "allHeroes"
        delete obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        transformToModel(obj[key]); // Récursion pour parcourir tout l'objet
      }
    }

    if (obj.career_stats) {
      const { allHeroes, ...heroSpecific } = obj.career_stats;
      obj.career_stats = {
        allHeroes: allHeroes || [],
        heroSpecific: heroSpecific
      };
    }
  }
  transformToModel(data);

  return data;
}