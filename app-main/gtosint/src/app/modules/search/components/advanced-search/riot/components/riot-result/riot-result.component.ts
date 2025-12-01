import { Component, Input, OnInit } from '@angular/core';
import { RiotResponse } from '../../models/riot-response.model';

@Component({
  selector: 'app-riot-result',
  templateUrl: './riot-result.component.html',
  styleUrl: './riot-result.component.scss',
})
export class RiotResultComponent implements OnInit {
  @Input() riotData!: RiotResponse | null;

  ngOnInit(): void {
    console.log('res : ', this.riotData);
  }
}