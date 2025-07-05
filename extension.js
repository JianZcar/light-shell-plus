import Gio from 'gi://Gio';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class Extension {
    enable() {
        this._settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });

        // Watch for color-scheme changes
        this._settingsChangedId = this._settings.connect('changed::color-scheme', () => {
            this._onColorSchemeChanged();
        });

        // Apply if it's currently 'default'
        this._onColorSchemeChanged();

        // Save original sessionMode color scheme so we can restore it
        this._savedColorScheme = Main.sessionMode.colorScheme;
    }

    disable() {
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        if (this._savedColorScheme) {
            this._updateSessionColorScheme(this._savedColorScheme);
        }
    }

    _onColorSchemeChanged() {
        const current = this._settings.get_string('color-scheme');

        if (current === 'default') {
            // Force it to prefer-light
            this._settings.set_string('color-scheme', 'prefer-light');
        }
        // Else: user explicitly chose something; leave it alone
    }

    _updateSessionColorScheme(scheme) {
        Main.sessionMode.colorScheme = scheme;
        St.Settings.get().notify('color-scheme');
    }
}
