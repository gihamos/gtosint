import { Component, inject, Input } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pseudo-selector',
  imports: [FormsModule],
  templateUrl: './pseudo-selector.component.html',
  styleUrl: './pseudo-selector.component.scss'
})
export class PseudoSelectorComponent{
  @Input() pseudos: string[] = [];
  @Input() userId = '';

  newPseudo = '';
  isModifyMode = false;
  private profileService = inject(ProfileService);

  toggleModifyMode(): void {
    this.isModifyMode = !this.isModifyMode;
  }

  addPseudo(): void {
    if (this.newPseudo.trim() && !this.pseudos.includes(this.newPseudo)) {
      this.profileService.addPseudo(this.userId, this.newPseudo);
      this.newPseudo = '';
      this.isModifyMode = false;
    } else {
      alert('Pseudo is empty or already exists!');
    }
  }

  deletePseudo(pseudo: string): void {
    this.profileService.deletePseudo(this.userId, pseudo);
  }
}