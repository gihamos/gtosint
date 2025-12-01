/* eslint-disable eol-last */
import { SteamId, SteamCustomPseudo } from '../../Models/SteamModel';
import { steamIdentifierValidatorFn } from '../../steamValidator/SteamIdentifierValidatorDirective';
import { SteamGetSteamIdService } from '../../Services/steam_getSteamId/steam-getsteamid.service';
import { SteamFormControl } from '../../Models/SteamFormControl';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SteamGetProfileInfoService } from '../../Services/SteamProfile/steam-get-profile-info.service';
import { SteamUserHomeComponent } from '../steam-user-home/steam-user-home.component';

@Component({
  selector: 'app-steam-home',
  standalone: true,
  imports: [ReactiveFormsModule, SteamUserHomeComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class SteamHomeComponent implements OnInit {

  @Output() responseDataChange = new EventEmitter<any>();
  private formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  steamFormControl: FormGroup<SteamFormControl> = this.formBuilder.group({
    customPseudo: this.formBuilder.control('', [Validators.required, Validators.minLength(4), steamIdentifierValidatorFn])
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
    this.submitForm();
  }

  handleDataFromChild(data: string) {
    this.steamid = data;
  }

  private steamGetSteamIdService: SteamGetSteamIdService = inject(SteamGetSteamIdService);
  private steamUserService :SteamGetProfileInfoService=inject(SteamGetProfileInfoService);
  public steamid!:string;

  submitForm(): void {
    // Vérification que le formulaire est valide
    if (this.steamFormControl.valid) {
      const value = this.steamGetSteamIdService.extractSteamIdentifier(this.steamFormControl.getRawValue().customPseudo);

      if (value) {
        // Vérification si c'est un pseudo Steam (ne contient que des chiffres)
        if (!(/^\d+$/.test(value))) {
          const form: SteamCustomPseudo = { customPseudo: value };

          // Récupérer l'ID Steam à partir du pseudo personnalisé
          this.steamGetSteamIdService.getSteamIdByCustomPseudo(form).subscribe({
            next: (data) => {
              if (data.response.success == 1) {
                const steamId: SteamId = { steamid: data.response.steamid };

                // Récupérer les jeux du joueur
                this.steamUserService.getGames(steamId).subscribe({
                  next: (gamesData) => {
                    if (gamesData.length > 0) {
                      this.steamid = steamId.steamid;
                    } else {
                      const message = 'The profile does not have a game in its steam library whose statistics are visible to the community or its profile is not public';
                      this.steamFormControl?.get('customPseudo')?.setErrors({ NoGameError: message });
                    }
                  },
                  error: (err) => {
                    const message = 'Error when recovering games owned by the player. ' + err.status;
                    this.steamFormControl?.get('customPseudo')?.setErrors({ serverError: message });
                  }
                });

              } else {
                this.steamFormControl?.get('customPseudo')?.setErrors({ pseudoError: 'The pseudo seized does not exist or was not found on Steam.' });
              }

              // Émettre les données de la réponse
              this.responseDataChange.emit(data);
            },
            error: (err: HttpErrorResponse) => {
              const message = 'Error when recovering the profile on the server.Code: ' + err.status;
              this.steamFormControl?.get('customPseudo')?.setErrors({ serverError: message });
            }
          });

        } else {
          // Si c'est un ID Steam, récupérer le profil directement
          this.steamUserService.getProfileInfo({ steamid: value }).subscribe({
            next: (data1) => {
              this.steamUserService.getGames({ steamid: data1.steamid }).subscribe({
                next: (gamesData) => {
                  if (gamesData.length > 0) {
                    this.steamid = data1.steamid;
                  } else {
                    const message = 'The profile does not have a game in its Steam library whose statistics are visible to the community or its profile is not public';
                    this.steamFormControl?.get('customPseudo')?.setErrors({ NoGameError: message });
                  }
                },
                error: (err) => {
                  const message = 'Error when recovering games owned by the player. ' + err.status;
                  this.steamFormControl?.get('customPseudo')?.setErrors({ serverError: message });
                }
              });
            },
            error: (err) => {
              const message = ' Error ID Steam seized was not able to be verified at Steam Code: ' + err.status;
              this.steamFormControl?.get('customPseudo')?.setErrors({ SteamIdError: message });
            }
          });
        }
      }
    }
  }
}
