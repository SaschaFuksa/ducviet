import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { TranslationPair } from '../../models/translation-pair.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-translation-list',
  templateUrl: './translation-list.component.html',
  styleUrls: ['./translation-list.component.css']
})
export class TranslationListComponent implements OnInit {
  pairs: TranslationPair[] = [];
  filteredPairs: TranslationPair[] = [];
  isFiltering = false;
  filterText = '';
  filterField: 'german' | 'vietnamese' | null = null;
  sortField: 'german' | 'vietnamese' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.findAll().subscribe(data => {
      this.pairs = data;
      this.filteredPairs = [...data];
    });
  }

  onEdit(pair: TranslationPair): void {
    console.log('Editing:', pair);
  }

  onDelete(id: number | undefined): void {
    if (!id) {
      console.error('Cannot delete: id is undefined');
      return;
    }
    this.translationService.delete(id).subscribe(() => {
      this.pairs = this.pairs.filter(pair => pair.id !== id);
      this.applyFilter(); // Reapply filter after deletion
    });
  }

  toggleFilter(field: 'german' | 'vietnamese'): void {
    if (this.filterField === field) {
      this.clearFilter();
    } else {
      this.filterField = field;
      this.isFiltering = true;
    }
  }

  applyFilter(): void {
    if (!this.filterField) return;
    this.filteredPairs = this.pairs.filter(pair =>
      pair[this.filterField!].toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  clearFilter(): void {
    this.isFiltering = false;
    this.filterText = '';
    this.filteredPairs = [...this.pairs];
  }

  sortBy(field: 'german' | 'vietnamese'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filteredPairs.sort((a, b) => {
      const valA = a[field].toLowerCase();
      const valB = b[field].toLowerCase();
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
