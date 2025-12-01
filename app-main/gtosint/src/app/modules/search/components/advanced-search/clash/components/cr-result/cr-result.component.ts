import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ClashResponse } from '../../models/cr-response.model';

@Component({
  selector: 'app-cr-result',
  imports: [],
  templateUrl: './cr-result.component.html',
  styleUrl: './cr-result.component.scss'
})
export class CrResultComponent implements OnInit {
  @Input() crData!: ClashResponse | null;

  ngOnInit(): void {
    console.log('res : ', this.crData);
  }

  constructor(private elemRef: ElementRef) { }

}