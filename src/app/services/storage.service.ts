import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character, CharacterSlot, MAX_CHARACTER_SLOTS, createNewCharacter } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'oath-hammer-characters';
  private readonly ACTIVE_SLOT_KEY = 'oath-hammer-active-slot';
  
  private characterSlots$ = new BehaviorSubject<CharacterSlot[]>([]);
  private activeSlotIndex$ = new BehaviorSubject<number>(0);
  private currentCharacter$ = new BehaviorSubject<Character | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  // Initialize slots from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const activeSlot = localStorage.getItem(this.ACTIVE_SLOT_KEY);
      
      if (stored) {
        const slots: CharacterSlot[] = JSON.parse(stored);
        this.characterSlots$.next(slots);
        
        const slotIndex = activeSlot ? parseInt(activeSlot, 10) : 0;
        this.activeSlotIndex$.next(slotIndex);
        
        if (slots[slotIndex]?.character) {
          this.currentCharacter$.next(slots[slotIndex].character);
        }
      } else {
        // Initialize with empty slots
        this.initializeEmptySlots();
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.initializeEmptySlots();
    }
  }

  // Create empty character slots
  private initializeEmptySlots(): void {
    const slots: CharacterSlot[] = Array.from({ length: MAX_CHARACTER_SLOTS }, (_, i) => ({
      id: i,
      character: null,
      lastModified: new Date()
    }));
    
    this.characterSlots$.next(slots);
    this.saveToStorage();
  }

  // Save slots to localStorage
  private saveToStorage(): void {
    try {
      const slots = this.characterSlots$.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(slots));
      localStorage.setItem(this.ACTIVE_SLOT_KEY, this.activeSlotIndex$.value.toString());
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Observables
  get characterSlots(): Observable<CharacterSlot[]> {
    return this.characterSlots$.asObservable();
  }

  get activeSlotIndex(): Observable<number> {
    return this.activeSlotIndex$.asObservable();
  }

  get currentCharacter(): Observable<Character | null> {
    return this.currentCharacter$.asObservable();
  }

  // Get current character (synchronous)
  getCurrentCharacter(): Character | null {
    return this.currentCharacter$.value;
  }

  // Get active slot index (synchronous)
  getActiveSlotIndex(): number {
    return this.activeSlotIndex$.value;
  }

  // Get all slots (synchronous)
  getSlots(): CharacterSlot[] {
    return this.characterSlots$.value;
  }

  // Create new character in slot
  createCharacter(slotIndex: number): Character {
    const character = createNewCharacter();
    this.saveCharacterToSlot(slotIndex, character);
    return character;
  }

  // Save character to specific slot
  saveCharacterToSlot(slotIndex: number, character: Character): void {
    const slots = [...this.characterSlots$.value];
    
    if (slotIndex < 0 || slotIndex >= MAX_CHARACTER_SLOTS) {
      console.error('Invalid slot index:', slotIndex);
      return;
    }

    slots[slotIndex] = {
      id: slotIndex,
      character: { ...character },
      lastModified: new Date()
    };

    this.characterSlots$.next(slots);
    
    if (slotIndex === this.activeSlotIndex$.value) {
      this.currentCharacter$.next(character);
    }
    
    this.saveToStorage();
  }

  // Load character from slot
  loadCharacterFromSlot(slotIndex: number): Character | null {
    const slots = this.characterSlots$.value;
    
    if (slotIndex < 0 || slotIndex >= MAX_CHARACTER_SLOTS) {
      console.error('Invalid slot index:', slotIndex);
      return null;
    }

    this.activeSlotIndex$.next(slotIndex);
    const character = slots[slotIndex]?.character || null;
    this.currentCharacter$.next(character);
    
    localStorage.setItem(this.ACTIVE_SLOT_KEY, slotIndex.toString());
    
    return character;
  }

  // Delete character from slot
  deleteCharacterFromSlot(slotIndex: number): void {
    const slots = [...this.characterSlots$.value];
    
    if (slotIndex < 0 || slotIndex >= MAX_CHARACTER_SLOTS) {
      console.error('Invalid slot index:', slotIndex);
      return;
    }

    slots[slotIndex] = {
      id: slotIndex,
      character: null,
      lastModified: new Date()
    };

    this.characterSlots$.next(slots);
    
    if (slotIndex === this.activeSlotIndex$.value) {
      this.currentCharacter$.next(null);
    }
    
    this.saveToStorage();
  }

  // Update current character (auto-save)
  updateCurrentCharacter(character: Character): void {
    const slotIndex = this.activeSlotIndex$.value;
    this.saveCharacterToSlot(slotIndex, character);
  }

  // Import character to slot
  importCharacterToSlot(slotIndex: number, character: Character): void {
    this.saveCharacterToSlot(slotIndex, character);
    this.loadCharacterFromSlot(slotIndex);
  }

  // Check if slot is empty
  isSlotEmpty(slotIndex: number): boolean {
    const slots = this.characterSlots$.value;
    return !slots[slotIndex]?.character;
  }

  // Get slot summary for UI
  getSlotSummary(slotIndex: number): string {
    const slot = this.characterSlots$.value[slotIndex];
    
    if (!slot?.character) {
      return 'Empty Slot';
    }

    const char = slot.character;
    const name = char.name || 'Unnamed';
    const lineage = char.lineage || '?';
    const charClass = char.class || '?';
    
    return `${name} - ${lineage} ${charClass}`;
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ACTIVE_SLOT_KEY);
    this.initializeEmptySlots();
    this.activeSlotIndex$.next(0);
    this.currentCharacter$.next(null);
  }
}