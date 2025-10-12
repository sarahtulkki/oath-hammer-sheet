---
title: Oath Hammer Character Sheet
description: Comprehensive character sheet for Oath Hammer RPG with multi-character support, auto-save, and GM features
author: Sarah Tulkki
tags:
  - tool
  - character-sheet
  - rpg
manifest: https://github.com/sarahtulkki/oath-hammer-sheet/blob/main/public/manifest.json
learn-more: https://github.com/sarahtulkki/oath-hammer-character-sheet
---

# Oath Hammer Character Sheet

A full-featured character sheet extension for the Oath Hammer tabletop RPG system, designed for seamless integration with Owlbear Rodeo.

## Features

* **Multiple Character Slots** - Save up to 5 different characters with automatic slot management
* **Complete Character Tracking**
  - Basic info (Name, Lineage, Class, Experience, Luck, Grit)
  - Attributes (Might, Toughness, Agility, Willpower, Intelligence, Fate)
  - Oaths tracking
  - Magic Items (Focus Talismans, and Trinkets)
  - Magic and special abilities
  - Currency management (Copper, Silver, Gold)
  - Inventory slots
  - Armor (Armor Type, Value, Penalty, Traits)
  - Weapons grid with full details
  - Complete skills system with 26 skills
* **Auto-Save** - Changes are automatically saved to browser storage and synced with Owlbear Rodeo
* **Import/Export** - Share characters via JSON files
* **GM Features** - Game Masters can view all player character sheets in the room
* **Mobile Friendly** - Responsive design works great on phones and tablets
* **Offline Support** - Works with browser local storage when not in Owlbear

## How to Use

1. Click the Oath Hammer icon in your Owlbear Rodeo toolbar
2. Create a new character or load an existing one from the slot manager
3. Fill out your character information - changes are saved automatically
4. Use the options to export/import characters or view party sheets (GM only)

## Character Management

* Click the **folder icon** to access the slot manager
* Create up to 5 different characters
* Switch between characters easily
* Delete characters you no longer need

## Skills System

The character sheet includes all 26 Oath Hammer skills with space to track:
- Skill Ranks
- Modifiers
- Totals
- Dice Color

## Support

If you encounter any issues or have suggestions for improvements:
- Email: brokenbladepublishing@gmail.com
- GitHub: https://github.com/sarahtulkki/oath-hammer-character-sheet/issues

## Credits

This is an official tool created for the Oath Hammer RPG community.

---

// package.json
{
  "name": "oath-hammer-character-sheet",
  "version": "1.0.0",
  "description": "Character sheet for Oath Hammer RPG - Owlbear Rodeo Extension",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build --configuration production",
    "test": "ng test",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "@angular/router": "^17.0.0",
    "@ionic/angular": "^7.5.0",
    "@owlbear-rodeo/sdk": "^2.0.0",
    "rxjs": "^7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "^0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.0.0",
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "@ionic/angular-toolkit": "^11.0.1",
    "@types/jasmine": "^5.1.0",
    "@types/node": "^20.10.0",
    "jasmine-core": "^5.1.0",
    "karma": "^6.4.0",
    "karma-chrome-launcher": "^3.2.0",
    "karma-coverage": "^2.2.0",
    "karma-jasmine": "^5.1.0",
    "karma-jasmine-html-reporter": "^2.1.0",
    "typescript": "^5.2.0"
  }
}


// angular.json (build configuration snippet)
{
  "projects": {
    "oath-hammer": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ],
              "outputHashing": "all",
              "optimization": true,
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}


// tsconfig.json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}