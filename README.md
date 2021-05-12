# Obsidian Readwise (Community Plugin)

**Obsidian Readwise (Community Plugin)** is an unofficial plugin to synchronize [Readwise](https://readwise.io) highlights into your Obsidian Vault.

## Features at glance

- Sync highlights on Obsidian startup
- Update existing notes with new highlights
- Customization for note header and highlights through templating

## Usage

After installation, it will ask for an [API token](https://readwise.io/access_token). This is required in order to pull the highlights from Readwise into your vault.

If you don't configure the API token on installation, you can always configure it on the Settings section.

**NOTE:** The token is stored using [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and it may have conflicts if the same vault were to be open on 2 different windows.

### Commands

`Readwise: Sync highlights`:  Will pull any new highlights from Readwise since the last time it was synced.

### Templating

The plugin supports templating the header of a note and each individual highlight. Templates are only evaluated during note creation and when adding new highlights.

The templating system in use is [Nunjucks](https://mozilla.github.io/nunjucks/).

#### Header Template

The default header template is:

```markdown
- **URL:** {{ source_url }}
- **Author:** {{ author }}
- **Tags:** #{{ category }}
- **Date:** [[{{ updated }}]]
---
```

This can be overwritten by configuring the `Custom Header Template Path` setting to the path of a different template. The available parameters for a custom header template are:

- `title`
- `source_url`
- `author`
- `category`
- `updated`
- `num_highlights`

#### Highlight Template

The default highlight template is:

```markdown
{{ text }} %% highlight_id: {{ id }} %%
{%- if note %}
Note: {{ note }}
{%- endif %}
```

This can be overwritten by configuring the `Custom Highlight Template Path` setting to the path of a different template. The available parameters for a custom highlight template are:

- `text`
- `note`
- `id`
- `location`

If the custom highlight template doesn't include `highlight_id: <id>`, then this will be appended at the end of the rendered content as `%% highlight_id: <id> %%` (<id> will be replaced by the actual highlight's id).

**Note:** You can find examples of custom templates under [tests/data](./tests/data) folder.

### Settings

- `Readwise API Token`: Add/update your Readwise API token.
- `Sync on startup`: If enabled, will sync highlights from Readwise when Obsidian starts
- `Custom Header Template Path`: Path to template note that overrides how the note header is written
- `Custom Highlight Template Path`: Path to template note that overrides how the highlights are written
- `Disable Notifications`: Toggle for pop-up notifications

## How the sync process work

The plugin will sync from Readwise only the new highlights since the last time it was executed (or since it was installed). The process works as follows:

1. Check if there is a file with the same name (it checks for notes in top level of the vault only. Issue [#22](https://github.com/renehernandez/obsidian-readwise/issues/22) tracks expanding support for customizing the location.
   1. If not, it creates a new file using the template from `Custom Note Header Template` or the default template.
2. Read the content of the note, and add the highlights if they are not found. The search for highlight is based on the `highlight_id` from Readwise and not the text of the highlight. The exact match the plugin looks for is of the form `highlight_id: <id>` where <id> is the actual id of the current highlight being rendered.

### Alternatives

In addition to this plugin, there is also another Readwise community plugin for Obsidian named **Readwise Mirror**, which can be found at: [https://github.com/jsonMartin/readwise-mirror](https://github.com/jsonMartin/readwise-mirror). Both plugins exist for different use cases, so please read below to determine which best suits your needs.

- Download the **Readwise Mirror** plugin if you want to mirror your entire Readwise Library into Obsidian and sync modifications to previous highlights
- Download this plugin to import highlights (new highlights only for now) to your library with full control over the ability to modify and format your notes

## Roadmap

You can check the project Roadmap [here](https://github.com/renehernandez/obsidian-readwise/projects/1)

## Installation

### From within Obsidian

You can install this plugin from `Settings > Community Plugins > Readwise`.

### Manual installation

Download zip archive from GitHub releases page. Extract the archive into `<vault>/.obsidian/plugins`.

### Limitations

* It can only pull the most recent 1000 highlights from Readwise (should be solved eventually as part of the implementation for this issue: [issues/7](https://github.com/renehernandez/obsidian-readwise/issues/7)

### Compatibility

To check for the compatibility of different versions, check [versions.json](https://github.com/renehernandez/obsidian-readwise/blob/main/versions.json). All plugin versions newer than the highest specified in the `versions.json` file should be compatible with the same Obsidian version and newer.
