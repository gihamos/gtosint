import { Component,Input, OnInit, HostListener, ElementRef} from '@angular/core';
import { Category, GameStats, OverfastResponse, playStats, Stats, Stat } from '../../models/overfast-response.model';

@Component({
  selector: 'app-overfast-result',
  imports: [],
  templateUrl: './overfast-result.component.html',
  styleUrls: ['./overfast-result.component.scss']
})

export class OverfastResultComponent implements OnInit {

  @Input() overData!: OverfastResponse | null;

  /**
   * La carrière sélectionné selon la plateforme et le mode de jeu.
   */
  career: GameStats | null =null;

  /**
   * La plateforme sélectionné par défaut pc.
   */
  selectedPlatform: 'pc' | 'console' = 'pc';

  /**
   * Le mode sélectionné par défaut quickplay.
   */
  selectedMode: 'quickplay' | 'competitive' = 'quickplay';

  /**
   * Les stats du héro selectionner selon la plateforme et le mode de jeu.
   */
  stats: Stat[] | null | undefined = null;

  /**
   * Représente si le menu déroulant est ouvert ou non
   */
  dropdownOpen = false;

  /**
   * Le héro selectionné par défaut allHeroes.
   */
  selectedHero = 'allHeroes';

  /**
   * Les categories du héro selectionner selon la plateforme et le mode de jeu.
   */
  categorys: Category[] | null | undefined = null;

  /**
   * La catégorie sélectionné.
   */
  selectedCategori: string | null = null;

  constructor(private elemRef: ElementRef){}

  /**
   * Réinitialise les categories et stats.
   */
  reinitCategStat(): void {
    this.stats = null;
    this.selectedCategori = null;
  }

  /**
   * Déploie le menu si il est activer.
   */
  toggleDropdown(): void{
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Met a jour la catégorie selectionner.
   * @param categ La catégorie selectionner.
   */
  selectCategorie(categ: string): void{
    this.selectedCategori = categ;
    this.stats = this.categorys?.find(cat => cat.label === categ)?.stats;
    this.dropdownOpen = false;
  }

  /**
   * Ferme le menu de choix de catégories si un clique est détecter autre part.
   * @param event
   */
  @HostListener('document:click',['$event'])
  onClickOutside(event: Event): void{
    if (!this.elemRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  /**
   * Met à jour le héros sélectionné.
   */
  updateSelectedHero(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedHero = target.value;
    this.reinitCategStat();
    this.updateCategorys();
  }

  /**
   * Met a jour le chemin avec la plateforme -> Le mod -> Le héro.
   */
  updateCategorys():void {
    if (!this.overData) return;
    if (this.career) {
      if (this.selectedHero === 'allHeroes') {
        this.categorys = this.career?.allHeroes;
      } else {
        this.categorys= this.career?.heroSpecific[this.selectedHero];
      }
    } else {
      this.categorys = null;
    }
  }

  /**
   * Récupère l'icône du héros.
   * @returns Le chemin de l'icône.
   */
  getHeroIcon(): string {
    return `./Overwatch-Icons/${this.selectedHero}.png`; // Modifie selon ton système d'icônes
  }

  /**
   * Récupère le nom de tout les héros jouer selon la plateforme et le mode choisi.
   * @returns Le tableau des noms des héros.
   */
  getHeroNames(): string[] {
    if (!this.overData) return [];

    const heroSpecific = this.career?.heroSpecific;
    if (!heroSpecific) return [];

    return Object.keys(heroSpecific).filter(hero => heroSpecific[hero] && heroSpecific[hero].length > 0);
  }

  /**
   * Initialise le chemin vers la carrière selon la plateforme et le mod de jeu données.
   * @param plat La plateforme voulu.
   * @param mod Le mod voulu.
   */
  updateCareer<P extends keyof Stats, M extends keyof Stats[P]>(plat: P, mod: M): void {
    const platData = this.overData?.stats[plat];
    if (platData) {
      const modData = platData[mod];
      if (modData) {
        const careerStats = (modData as unknown as playStats).career_stats;
        if (careerStats) {
          this.career = careerStats;
          this.updateCategorys();
          return;
        }
      }
    }
    this.career = null;
    this.updateCategorys();
  }

  /**
   * Récupère toutes les catégories.
   * @returns Le tableau des label des catégories.
   */
  getAllCategory(): string[] {
    const labels: string[] = [];

    if (this.categorys) {
      this.categorys.forEach(cat => {
        labels.push(cat.label);
      });
    }

    return labels;
  }

  /**
   * Fonction pour sélectionner la plateforme.
   */
  selectPlatform(platform: 'pc' | 'console'): void {
    this.selectedPlatform = platform;
    this.selectedHero = 'allHeroes';
    this.reinitCategStat();
    this.updateCareer(this.selectedPlatform, this.selectedMode);
  }

  /**
   * Fonction pour sélectionner le mode de jeu.
   */
  selectMode(mode: 'quickplay' | 'competitive'): void {
    this.selectedMode = mode;
    this.selectedHero = 'allHeroes';
    this.reinitCategStat();
    this.updateCareer(this.selectedPlatform, this.selectedMode);
  }

  ngOnInit(): void {
    if(this.overData){
      this.updateCareer(this.selectedPlatform, this.selectedMode);
      this.updateCategorys();
    }
    console.log('res : ', this.overData);
  }
}