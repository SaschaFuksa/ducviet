import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslationPair } from '../models/translation-pair.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'http://localhost:3000/api/translations';

  constructor(private http: HttpClient) {}

  create(pair: TranslationPair): Observable<TranslationPair> {
    return this.http.post<TranslationPair>(this.apiUrl, pair);
  }

  findAll(): Observable<TranslationPair[]> {
    return this.http.get<TranslationPair[]>(this.apiUrl);
  }

  update(pair: TranslationPair): Observable<any> {
    return this.http.put(`${this.apiUrl}/${pair.id}`, pair);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
