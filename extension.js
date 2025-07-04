import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class Extension {
    _updateColorScheme(scheme) {
        Main.sessionMode.colorScheme = scheme;
        St.Settings.get().notify('color-scheme');
    }

    enable() {
        this._savedColorScheme = Main.sessionMode.colorScheme;
        this._updateColorScheme('prefer-light');
    }

    disable() {
        this._updateColorScheme(this._savedColorScheme);
    }
}
