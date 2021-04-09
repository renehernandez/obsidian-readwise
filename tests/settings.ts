import "mocha";
import { assert } from "chai";
import { ObsidianReadwiseSettings } from '../src/settings';
import { before } from "mocha";

describe("Settings", () => {
    context("defaultSettings", () => {
        var settings: ObsidianReadwiseSettings;

        before(() => {
            settings = ObsidianReadwiseSettings.defaultSettings();
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

        it('headerTemplate path is empty', () => {
            assert.isEmpty(settings.headerTemplate);
        });
    });

    context("withData", () => {
        var settings: ObsidianReadwiseSettings;
        before(() => {
            settings = ObsidianReadwiseSettings.withData({
                lastUpdate: 10,
                syncOnBoot: true,
                headerTemplate: 'Hello World',
                disableNotifications: true
            });
        });

        it('overrides the lastUpdate field', () => {
            assert.equal(settings.lastUpdate, 10);
        });

        it('overrides the syncOnBoot field', () => {
            assert.isTrue(settings.syncOnBoot);
        });

        it('overrides the headerTemplate field', () => {
            assert.equal(settings.headerTemplate, "Hello World");
        });

        it('overrides the disableNotifications field', () => {
            assert.isTrue(settings.disableNotifications);
        });
    });
})