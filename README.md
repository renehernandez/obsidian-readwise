# Obsidian Readwise

An experimental plugin to synchronize [Readwise](https://readwise.io) highlights into your Obsidian Vault.

## How the sync process work

The plugin will sync from Readwise only the new highlights since the last time it was executed (or since it was installed). The process works as follows:

1. Check if there is a file with the same name.
   1. If not, it creates a new file using the template from `Custom Note Header Template` or the default template
2. Read the content of the note, and add the highlights if they are not found. The search for highlight is based on the `highlight_id` from Readwise and not the text of the highlight. The exact match the plugin looks for is of the form `%% highlight_id: <highlight_id> %%`

### Limitations

* It can only pull the most recent 1000 highlights from Readwise (should be solved eventually as part of the implementation for this issue: [issues/7](https://github.com/renehernandez/obsidian-readwise/issues/7)
* It doesn't handle the note associated with a highlight [issues/14](https://github.com/renehernandez/obsidian-readwise/issues/14)
* Customization of how each highlight is stored in the note through another template option [issues/15](https://github.com/renehernandez/obsidian-readwise/issues/15)

## Installation

### From within Obsidian

You can install this plugin from `Settings > Community Plugins > Readwise`.

### Manual installation

Download zip archive from GitHub releases page. Extract the archive into `<vault>/.obsidian/plugins`.

## Usage

After installation, it will ask for an [API token](https://readwise.io/access_token). This is required in order to pull the highlights from Readwise into your vault.

**NOTE:** The token is stored using [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and it may have conflicts if the same vault were to be open on 2 different windows.

### Templating

The built-in template will generate a note with the following structure:

```markdown
- **URL:** {{ source_url }}
- **Author:** {{ author }}
- **Tags:** #{{ category }}
- **Date:** [[{{ updated }}]]
---
```

This can be overwritten by configuring the `Custom Note Header Template` setting to point to a different template. The templating system in use is [Nunjucks](https://mozilla.github.io/nunjucks/).

The available parameters for the templates are:

- title
- source_url
- author
- category
- updated

**Note:** You can find examples of custom templates under [tests/data](./tests/data) folder.

### Settings

- `Readwise API Token`: Add/update your Readwise API token.
- `Sync on startup`: If enabled, will sync highlights from Readwise when Obsidian starts
- `Custom Note Header Template Path`: Path to template note that overrides how the note header is written
- `Custom Highlight Template Path`: Path to template note that overrides how the highlights are written
- `Disable Notifications`: Toggle for pop-up notifications

### Commands

`Readwise: Sync highlights`:  Will pull any new highlights from Readwise since the last time it was synced.

### Features

- Sync highlights on Obsidian startup
- Update existing notes with new highlights
- Support templating note's header

### Compatibility

This plugin is being tested with Obsidian v0.11.9 and up
