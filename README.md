# xiii-save-manager

Organize your FF13 practice save files and show them in the game in customized order.

## Planned Features

- [x] Organize save files and sort by chapter and file names
- [ ] Profile, allowing you to switch between different sets of saves (e.g. Any% and All Misions)
  - You can currently do this by manually renaming folders inside `ff13-saves` folder. `default` will be used by this program.

## Install

### Executable

Download the executable from [releases](https://github.com/Hoishin/xiii-save-manager/releases).

To run, double click the executable or run from Command Prompt or PowerShell.

### npm

If you already have Node.js installed, you can use npm to install.

```
npm install -g xiii-save-manager
```

To run, run command `xiii-save-manager` in Command Prompt or PowerShell.

## Usage

When you run for the first time, it will create `C:\Users\{USERNAME}\ff13-saves\default` folder with 13 folders for each chapter.

Put your practice saves into each folder. Next time you run the command, the saves will be copied to FF13 save files folder, sorted with chapter and file names.

You can name save files however you want, but I'd recommend `01.dat`, `02.dat` style of naming to make sure it works as intended.

**EXISTING SAVE FILES IN FF13'S SAVE FOLDER WILL BE OVERWRITTEN. BACKUP IF YOU NEED.**

You don't have to put saves into all folders. If a chapter folder is empty, it will simply be ignored.

### Put saves of all chapters

When you run with no options, it puts all saves from all chapter folders.

### Put saves of specific chapters

You need to use Command Prompt or PowerShell to specify chapters.

- Only Chapter 5:
  ```
  xiii-save-manager.exe 5
  ```
- Chapter 12 and 13
  ```
  xiii-save-manager.exe 12 13
  ```

## Under the hood

In-game save file list sorts them with `mtime`, the timestamp of when the save file was modified.
