import { Injectable } from '@angular/core';
import OBR from '@owlbear-rodeo/sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class OwlbearService {
  private isReady$ = new BehaviorSubject<boolean>(false);
  private isAvailable$ = new BehaviorSubject<boolean>(false);
  private player$ = new BehaviorSubject<any>(null);
  private isGM$ = new BehaviorSubject<boolean>(false);

  private readonly METADATA_KEY = 'com.oathhammer.character-sheet';

  constructor() {
    this.initialize();
  }

  private async initialize() {
    OBR.onReady(async () => {
      console.log('Owlbear SDK Ready');
      this.isReady$.next(true);
      
      if (OBR.isAvailable) {
        this.isAvailable$.next(true);
        
        try {
          // Build player object from individual API calls
          const playerId = await OBR.player.getId();
          const playerName = await OBR.player.getName();
          const playerRole = await OBR.player.getRole();
          const playerColor = await OBR.player.getColor();
          
          const player = {
            id: playerId,
            name: playerName,
            role: playerRole,
            color: playerColor
          };
          
          this.player$.next(player);
          this.isGM$.next(playerRole === 'GM');
          
          console.log('Player:', player.name, 'Role:', player.role);
        } catch (error) {
          console.error('Error getting player info:', error);
        }
      }
    });
  }

  // Observables for components to subscribe to
  get isReady(): Observable<boolean> {
    return this.isReady$.asObservable();
  }

  get isAvailable(): Observable<boolean> {
    return this.isAvailable$.asObservable();
  }

  get player(): Observable<any> {
    return this.player$.asObservable();
  }

  get isGM(): Observable<boolean> {
    return this.isGM$.asObservable();
  }

  // Save character to Owlbear room metadata (shared with all players)
  async saveCharacterToRoom(character: Character, playerId?: string): Promise<void> {
    if (!this.isReady$.value || !this.isAvailable$.value) {
      console.warn('Owlbear not available, saving to localStorage only');
      return;
    }

    try {
      const player = this.player$.value;
      const id = playerId || player?.id;
      
      if (!id) {
        throw new Error('No player ID available');
      }

      const key = `${this.METADATA_KEY}.${id}`;
      
      await OBR.room.setMetadata({
        [key]: {
          character,
          lastModified: new Date().toISOString()
        }
      });

      await OBR.notification.show('Character saved!', 'SUCCESS');
      
    } catch (error) {
      console.error('Error saving character to Owlbear:', error);
      await OBR.notification.show('Error saving character', 'ERROR');
      throw error;
    }
  }

  // Load character from Owlbear room metadata
  async loadCharacterFromRoom(playerId?: string): Promise<Character | null> {
    if (!this.isReady$.value || !this.isAvailable$.value) {
      return null;
    }

    try {
      const player = this.player$.value;
      const id = playerId || player?.id;
      
      if (!id) {
        return null;
      }

      const key = `${this.METADATA_KEY}.${id}`;
      const metadata = await OBR.room.getMetadata();
      
      const data = metadata[key] as any;
      return data?.character || null;
      
    } catch (error) {
      console.error('Error loading character from Owlbear:', error);
      return null;
    }
  }

  // Get all characters in the room (GM feature)
  async getAllCharacters(): Promise<{ playerId: string; playerName: string; character: Character }[]> {
    if (!this.isReady$.value || !this.isAvailable$.value) {
      return [];
    }

    try {
      const metadata = await OBR.room.getMetadata();
      const party = await OBR.party.getPlayers();
      const characters: { playerId: string; playerName: string; character: Character }[] = [];

      for (const player of party) {
        const key = `${this.METADATA_KEY}.${player.id}`;
        const data = metadata[key] as any;
        
        if (data?.character) {
          characters.push({
            playerId: player.id,
            playerName: player.name,
            character: data.character
          });
        }
      }

      return characters;
      
    } catch (error) {
      console.error('Error loading all characters:', error);
      return [];
    }
  }

  // Broadcast character update to other players
  async broadcastCharacterUpdate(character: Character): Promise<void> {
    if (!this.isReady$.value || !this.isAvailable$.value) {
      return;
    }

    try {
      await OBR.broadcast.sendMessage(`${this.METADATA_KEY}.update`, {
        playerId: this.player$.value?.id,
        character,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error broadcasting character update:', error);
    }
  }

  // Listen for character updates from other players
  onCharacterUpdate(callback: (data: any) => void): () => void {
    if (!this.isReady$.value || !this.isAvailable$.value) {
      return () => {};
    }

    return OBR.broadcast.onMessage(`${this.METADATA_KEY}.update`, (event) => {
      callback(event.data);
    });
  }

  // Show notification
  async showNotification(message: string, type: 'DEFAULT' | 'SUCCESS' | 'ERROR' | 'WARNING' = 'DEFAULT'): Promise<void> {
    if (!this.isReady$.value || !this.isAvailable$.value) {
      console.log(`Notification (${type}):`, message);
      return;
    }

    try {
      await OBR.notification.show(message, type);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Adjust popover size
  async setPopoverSize(width: number, height: number): Promise<void> {
    if (!this.isReady$.value || !this.isAvailable$.value) {
      return;
    }

    try {
      // OBR.action controls the extension action (not popover)
      await OBR.action.setWidth(width);
      await OBR.action.setHeight(height);
    } catch (error) {
      console.error('Error setting popover size:', error);
    }
  }

  // Export character as JSON
  exportCharacter(character: Character): void {
    const json = JSON.stringify(character, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'character'}-oath-hammer.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Import character from JSON file
  async importCharacter(file: File): Promise<Character> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const character = JSON.parse(json) as Character;
          resolve(character);
        } catch (error) {
          reject(new Error('Invalid character file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
}