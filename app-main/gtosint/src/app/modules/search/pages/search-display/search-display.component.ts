import { Component } from '@angular/core';
import { SearchAdvancedComponent } from '../../components/advanced-search/search-advanced/search-advanced.component';
import { SearchLocalComponent } from '../../components/local-search/search-local/search-local.component';

@Component({
  selector: 'app-search-display',
  imports: [SearchAdvancedComponent, SearchLocalComponent],
  templateUrl: './search-display.component.html',
  styleUrl: './search-display.component.scss'
})
export class SearchDisplayComponent {

}