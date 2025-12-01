import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClashService } from '../../services/cr.service';
import { ClashRequest } from '../../models/cr-request';
import { ClashForm } from '../../models/cr-formgroup';

@Component({
  selector: 'app-clash-royale-form',
  templateUrl: './cr-api.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: ['./cr-api.component.scss']
})
export class ClashRoyaleFormComponent {


    @Output() responseDataChange = new EventEmitter<any>();

    private nnfb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
    clashRoyaleForm: FormGroup<ClashForm> = this.nnfb.group({
      clashId: this.nnfb.control('', [Validators.required])
    });

    private clashRoyaleService = inject(ClashService);

    submitForm(): void {
      if (this.clashRoyaleForm.valid) {
        const formValue: ClashRequest = this.clashRoyaleForm.getRawValue();
        this.clashRoyaleService.getPlayerData(formValue).subscribe({
          next: (response) => {
            console.log('Données reçues :', response);
            this.responseDataChange.emit(response);
          },
          error: (err) => console.error('Error:', err)
        });
      } else {
        alert('Veuillez remplir correctement le formulaire.');
      }
    }
}