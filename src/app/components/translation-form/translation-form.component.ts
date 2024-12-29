import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { TranslationPair } from '../../models/translation-pair.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-translation-form',
  templateUrl: './translation-form.component.html',
  styleUrls: ['./translation-form.component.css']
})
export class TranslationFormComponent {
  german = '';
  vietnamese = '';
  savedMessageVisible = false;
  duplicateMessageVisible = false;

  constructor(private translationService: TranslationService) {}

  onSave(): void {
    const newPair: TranslationPair = { german: this.german, vietnamese: this.vietnamese };
    this.translationService.create(newPair).subscribe({
      next: () => {
        this.savedMessageVisible = true;
        this.german = '';
        this.vietnamese = '';
        setTimeout(() => (this.savedMessageVisible = false), 3000);
      },
      error: err => {
        if (err.status === 400) {
          this.duplicateMessageVisible = true;
          setTimeout(() => (this.duplicateMessageVisible = false), 3000);
        }
      }
    });
  }
}
