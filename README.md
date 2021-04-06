# Obsidian Readwise

A plugin to synchronize [Readwise](https://readwise.io) highlights into your Obsidian Vault.

## Installation

### From within Obsidian

You can install this plugin from `Settings > Third Party Plugins > Readwise`.

### Manual installation

Download zip archive from GitHub releases page. Extract the archive into `<vault>/.obsidian/plugins`.

## Usage

After installation, it will ask for an [API token](https://readwise.io/access_token). This is required in order to pull the highlights from Obsidian into your vault.

### Settings

- `Readwise API Token`: Add/update your Readwise API token.
- `Sync on startup`: If enabled, will sync highlights from Readwise when Obsidian starts
- 

### Commands

`Readwise: Sync highlights`:  Will pull any new highlights from Readwise since the last time it was synced.

### Features

- Sync highlights on Obsidian startup
- Update existing notes with new highlights
- Support templating note's header

### Compatibility

This plugin is being tested with Obsidian v0.11.9 and up

