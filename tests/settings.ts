import "mocha";
import { assert } from "chai";
import { ObsidianReadwiseSettings, ObsidianReadwiseSettingsGenerator } from '../src/settings';
import { before } from "mocha";

describe("Settings", () => {
    context("defaultSettings", () => {
        var settings: ObsidianReadwiseSettings;

        before(() => {
            settings = ObsidianReadwiseSettingsGenerator.defaultSettings();
        });

        it('sets the lastUpdate to now timestamp', () => {
            assert.isNumber(settings.lastUpdate);
            assert.isAbove(settings.lastUpdate, 0);
        });

        it('syncOnBoot is disabled', () => {
            assert.isFalse(settings.syncOnBoot);
        });

        it('notifications are enabled', () => {
            assert.isFalse(settings.disableNotifications);
        });

        it('header template path is empty', () => {
            assert.isEmpty(settings.headerTemplatePath);
        });

        it('highlight template path is empty', () => {
            assert.isEmpty(settings.highlightTemplatePath);
        });

        it('intervalSync is set to zero', () => {
            assert.equal(settings.autoSyncInterval, 0);
        })
    });

    context("withData", () => {
        var settings: ObsidianReadwiseSettings;
        before(() => {
            settings = ObsidianReadwiseSettingsGenerator.withData({
                lastUpdate: 10,
                autoSyncInterval: 3,
                syncOnBoot: true,
                headerTemplatePath: 'Hello World',
                highlightTemplatePath: 'Good Bye',
                disableNotifications: true
            });
        });

        it('overrides the lastUpdate field', () => {
            assert.equal(settings.lastUpdate, 10);
        });

        it('overrides the syncOnBoot field', () => {
            assert.isTrue(settings.syncOnBoot);
        });

        it('overrides the headerTemplatePath field', () => {
            assert.equal(settings.headerTemplatePath, "Hello World");
        });

        it('overrides the highlightTemplatePath field', () => {
            assert.equal(settings.highlightTemplatePath, "Good Bye");
        });

        it('overrides the disableNotifications field', () => {
            assert.isTrue(settings.disableNotifications);
        });

        it('overrides the autoSyncInterval field', () => {
            assert.equal(settings.autoSyncInterval, 3);
        })
    });
})