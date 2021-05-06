# Changelog

## [0.0.6](https://github.com/renehernandez/obsidian-readwise/tree/0.0.6) (2021-05-06)

**Implemented enhancements:**

- Expand metadata information available for the templates [\#42](https://github.com/renehernandez/obsidian-readwise/issues/42)
- Add option to customize location where notes should be saved [\#22](https://github.com/renehernandez/obsidian-readwise/issues/22)
- Add num\_highlights field to the metadata list available for header te… [\#47](https://github.com/renehernandez/obsidian-readwise/pull/47) ([renehernandez](https://github.com/renehernandez))

**Documentation Updates:**

- Append author in PR sections in Changelog and releases [\#48](https://github.com/renehernandez/obsidian-readwise/pull/48) ([renehernandez](https://github.com/renehernandez))

**Merged pull requests:**

- Add explicit storagepath for notes and handle URL titles [\#43](https://github.com/renehernandez/obsidian-readwise/pull/43) ([Zowie](https://github.com/Zowie))

## [0.0.5](https://github.com/renehernandez/obsidian-readwise/tree/0.0.5) (2021-05-03)

**Fixed bugs:**

- Update the cache name to account for the job id [\#46](https://github.com/renehernandez/obsidian-readwise/pull/46) ([renehernandez](https://github.com/renehernandez))

## [0.0.5-beta1](https://github.com/renehernandez/obsidian-readwise/tree/0.0.5-beta1) (2021-05-03)

**Fixed bugs:**

- Readwise Plugin not listed in Plugin option menu [\#44](https://github.com/renehernandez/obsidian-readwise/issues/44)

**Merged pull requests:**

- Restrict status bar loading to desktop mode only [\#45](https://github.com/renehernandez/obsidian-readwise/pull/45) ([renehernandez](https://github.com/renehernandez))

## [0.0.4](https://github.com/renehernandez/obsidian-readwise/tree/0.0.4) (2021-04-21)

**Implemented enhancements:**

- Change plugin name to Readwise Community [\#34](https://github.com/renehernandez/obsidian-readwise/issues/34)
- Change return type on `TryGet` [\#30](https://github.com/renehernandez/obsidian-readwise/issues/30)

**Documentation Updates:**

- Add Changelog generation for releases [\#39](https://github.com/renehernandez/obsidian-readwise/pull/39) ([renehernandez](https://github.com/renehernandez))
- README update [\#38](https://github.com/renehernandez/obsidian-readwise/pull/38) ([renehernandez](https://github.com/renehernandez))

**Merged pull requests:**

- Unify `tryGet` method into `get` [\#37](https://github.com/renehernandez/obsidian-readwise/pull/37) ([renehernandez](https://github.com/renehernandez))
- Change public facing name for readwise plugin [\#36](https://github.com/renehernandez/obsidian-readwise/pull/36) ([renehernandez](https://github.com/renehernandez))

## [0.0.3](https://github.com/renehernandez/obsidian-readwise/tree/0.0.3) (2021-04-15)

**Implemented enhancements:**

- Remove unnecessary casting for localStorage [\#20](https://github.com/renehernandez/obsidian-readwise/issues/20)
- Replace NodeJS path api usage in `fileDoc` [\#18](https://github.com/renehernandez/obsidian-readwise/issues/18)
- Support customizing the way a highlight is written in the note [\#15](https://github.com/renehernandez/obsidian-readwise/issues/15)
- Handle the note field associated with a highlight [\#14](https://github.com/renehernandez/obsidian-readwise/issues/14)

**Fixed bugs:**

- Return proper `ObsidianReadwiseSettings` from `withData` method [\#21](https://github.com/renehernandez/obsidian-readwise/issues/21)
- Check return from `localStorage` to avoid null values [\#19](https://github.com/renehernandez/obsidian-readwise/issues/19)
- Fixes nunjucks autoescaping html char and incorrect path location [\#29](https://github.com/renehernandez/obsidian-readwise/pull/29) ([renehernandez](https://github.com/renehernandez))

**Merged pull requests:**

- Highlight improvements [\#28](https://github.com/renehernandez/obsidian-readwise/pull/28) ([renehernandez](https://github.com/renehernandez))
- Improve name and description for custom template header [\#27](https://github.com/renehernandez/obsidian-readwise/pull/27) ([renehernandez](https://github.com/renehernandez))
- Remove NodeJS path api [\#26](https://github.com/renehernandez/obsidian-readwise/pull/26) ([renehernandez](https://github.com/renehernandez))
- Improvements in TokenManager [\#24](https://github.com/renehernandez/obsidian-readwise/pull/24) ([renehernandez](https://github.com/renehernandez))
- Split Settings into interface and Generator [\#23](https://github.com/renehernandez/obsidian-readwise/pull/23) ([renehernandez](https://github.com/renehernandez))

## [0.0.2](https://github.com/renehernandez/obsidian-readwise/tree/0.0.2) (2021-04-09)

**Implemented enhancements:**

- Store LastUpdate setting field as a unix timestamp [\#4](https://github.com/renehernandez/obsidian-readwise/issues/4)
- Update to better load mechanism [\#3](https://github.com/renehernandez/obsidian-readwise/issues/3)
- Store API token using localStorage instead of plaintext [\#2](https://github.com/renehernandez/obsidian-readwise/issues/2)
- Replace luxon library with moment.js [\#1](https://github.com/renehernandez/obsidian-readwise/issues/1)

**Fixed bugs:**

- Set initial timestamp to moment of plugin installation [\#13](https://github.com/renehernandez/obsidian-readwise/issues/13)

**Documentation Updates:**

- Explain sync process in Readme [\#9](https://github.com/renehernandez/obsidian-readwise/issues/9)

**Merged pull requests:**

- Set initial timestamp on plugin install [\#17](https://github.com/renehernandez/obsidian-readwise/pull/17) ([renehernandez](https://github.com/renehernandez))
- Explain how the sync process work and limitation [\#16](https://github.com/renehernandez/obsidian-readwise/pull/16) ([renehernandez](https://github.com/renehernandez))
- Switch to use localStorage to manage Readwise token [\#12](https://github.com/renehernandez/obsidian-readwise/pull/12) ([renehernandez](https://github.com/renehernandez))
- Refactor settings [\#11](https://github.com/renehernandez/obsidian-readwise/pull/11) ([renehernandez](https://github.com/renehernandez))
- Replace luxon [\#10](https://github.com/renehernandez/obsidian-readwise/pull/10) ([renehernandez](https://github.com/renehernandez))

## [0.0.1](https://github.com/renehernandez/obsidian-readwise/tree/0.0.1) (2021-04-06)



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
