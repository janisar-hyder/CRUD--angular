import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppMode = 'list' | 'create' | 'edit';

export interface AppState {
  mode: AppMode;
  editingProductId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private stateSubject = new BehaviorSubject<AppState>({ mode: 'list' });
  public state$ = this.stateSubject.asObservable();

  setMode(mode: AppMode, editingProductId?: string): void {
    this.stateSubject.next({ mode, editingProductId });
  }

  getCurrentState(): AppState {
    return this.stateSubject.value;
  }
}