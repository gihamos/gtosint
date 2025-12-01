import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverfastService } from '../../services/overfast.service';
import { OverfastRequest } from '../../models/overfast-request';
import { OverfastForm } from '../../models/overfast-formgroup';

@Component({
  selector: 'app-overfast-form',
  templateUrl: './overfast-api.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: ['./overfast-api.component.scss'],
})
export class OverfastFormComponent {
  @Output() responseDataChange = new EventEmitter<any>();

  private nnfb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  overfastForm: FormGroup<OverfastForm> = this.nnfb.group({
    battleName: this.nnfb.control('', [Validators.required]),
    battleTag: this.nnfb.control('', [Validators.required]),
  });

  private overfastService = inject(OverfastService);

  submitForm(): void {
    if (this.overfastForm.valid) {
      const formValue: OverfastRequest = this.overfastForm.getRawValue();
      this.overfastService.sendOverReq(formValue).subscribe({
        next: (response) => {
          console.log('Success:', response);
          console.log('Emitting responseDataChange event:', response);
          this.responseDataChange.emit(response);
        },
        error: (err) => console.error('Error:', err),
      });
    } else {
      alert('Veuilez remplir correctement le formulaire.');
    }
  }
}