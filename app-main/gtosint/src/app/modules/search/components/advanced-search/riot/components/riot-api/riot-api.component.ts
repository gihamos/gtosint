import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RiotService } from '../../services/riot.service';
import { RiotRequest } from '../../models/riot-request';
import { RiotForm } from '../../models/riot-formgroup';

@Component({
  selector: 'app-riot-form',
  templateUrl: './riot-api.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrl: './riot-api.component.scss',
})
export class RiotFormComponent {
  @Output() responseDataChange = new EventEmitter<any>();

  private nnfb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  riotForm: FormGroup<RiotForm> = this.nnfb.group({
    riotId: this.nnfb.control('', [Validators.required]),
    tagLine: this.nnfb.control('', [Validators.required]),
  });

  private riotService = inject(RiotService);

  submitForm(): void {
    if (this.riotForm.valid) {
      const formValue: RiotRequest = this.riotForm.getRawValue();
      this.riotService.getRiotData(formValue).subscribe({
        next: (response) => {
          console.log('Success:', response);
          console.log('Emitting responseDataChange event:', response);
          this.responseDataChange.emit(response);
        },
        error: (err) => console.error('Error:', err),
      });
    } else {
      alert('Please fill in all fields correctly.');
    }
  }
}