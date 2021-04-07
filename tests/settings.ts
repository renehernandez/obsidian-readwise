import "mocha";
import { assert } from "chai";
import { ObsidianReadwiseSettings } from '../src/settings';
import { before } from "mocha";

describe("Settings", () => {
    context("Default Settings", () => {
        var settings: ObsidianReadwiseSettings;

        before(() => {
            settings = ObsidianReadwiseSettings.defaultSettings();
        });

        it('sets the lastUpdate to zero', () => {
            assert.equal(settings.lastUpdateTimestamp, 0);
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
})