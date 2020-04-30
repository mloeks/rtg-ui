# RTG UI

## Current upgrades & TODOs

### Cookie Consent

Laut EuGH nicht benötigt für Session Cookies (Login etc.)
Quelle: https://www.e-recht24.de/artikel/datenschutz/8451-hinweispflicht-fuer-cookies.html

Dennoch wenigstens folgenden Cookie-Hinweis (non-blocking):
```
Verwendung von Cookies

Um die Royale Tippgemeinschaft für Euch optimal zu gestalten, verwenden wir einige Cookies. Durch die weitere Nutzung dieser Webseite stimmt Ihr der Verwendung von Cookies zu.

Weitere Informationen zu Cookies erhaltet Ihr in unserer Datenschutzerklärung.
```

Eine Datenschutzerklärung sollte allerdings hinzugefügt werden, wo die Verwendung von Cookies erklärt wird. --> nur Session Cookies für Login und Userdaten lokal im Browser, werden nicht an Dritte weitergegeben. Keinerlei Analytics oder anderweitige
Tracking Cookies vorhanden!

### Testing 2020

#### TODOs

* Manual testing, also in IE11!

#### Bugs

* ...

### Must-Haves 2020

#### Minor facelift

* Exchange some pictures
    * preferably with own pictures...

### Next

* Fix minor (but numerous) linter complaints
* Look to improve page speed for home page
* Performance improvements on bet page (look for unnecessary render cycles and state updates)
* [Optional] Try out new styling approach coming with Material UI 3.5.1
    * https://github.com/mui-org/material-ui/releases/tag/v3.5.1
* Find replacements for some apparently unmaintained NPM modules
    * canvas-toBlob
    * hsl-to-hex
    * jwt-decode
    * verge

### Header Design

* Try to make it slightly V-shaped using SVG or CSS skewing, logo in the middle, apply fading leather texture on the top?

## Toolchain

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app).

### Material UI

Material UI has been added as CSS Framework as described [here](https://stackoverflow.com/a/44197904).

### Sass

Sass support has been configured as described [here](https://create-react-app.dev/docs/adding-a-sass-stylesheet).

## Learnings during dev

#### Authentication

Implementation is inspired by [this documentation](https://reacttraining.com/react-router/web/example/auth-workflow).