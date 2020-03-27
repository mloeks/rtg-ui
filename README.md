# RTG UI

## Current upgrades & TODOs

### Testing 2020

#### TODOs

* Manual testing, also in IE11!

#### Bugs

* White background in Paper of UserDetailsPopover (probably related to Paper default change in MUI)
* DialogTitle renders a h2 element (correct) with Typography-h6 class, why?
    * Ref: https://material-ui.com/api/dialog-title/
* Indeterminate progress bar in BetsStatusPanel is not shown

### Must-Haves 2020

#### React 17: Replace componentWillReceiveProps

Helpful resources:
    * https://code.tubitv.com/migrating-to-new-react-lifecycle-methods-f6a0cccdec95

Do this test first. Write UI tests which cover workflows in which each affected component is included.

* BetsStatusPanel: Show special "saving" state if save takes long (using 500ms timeout)
    * What breaks without: Long save indicator not shown
    * Solution: unclear
* BetStatsPanel: Fetch Bets to display stats about on (re-)open
    * What breaks without: bets are not updated / fetched (?)
    * Solution: unclear
* GameCardBet: determine if a save request affects this game (are there changes? also handles completed saves)
    * What breaks without: saving bets is not possible, hangs during "saving"...
    * Solution: unclear

#### Minor facelift

* Exchange some pictures
    * preferably with own pictures...

### Next

* Fix minor (but numerous) linter complaints
* [Optional] Try out new styling approach coming with Material UI 3.5.1
    * https://github.com/mui-org/material-ui/releases/tag/v3.5.1
* Find replacements for some apparently unmaintained NPM modules
    * canvas-toBlob
    * hsl-to-hex
    * jwt-decode
    * verge
    
### Testing

#### Explorative

* Do some more intensive explorative testing after the Material UI upgrade

## Toolchain

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app).

### Material UI

Material UI has been added as CSS Framework as described [here](https://stackoverflow.com/a/44197904).

### Sass

Sass support has been configured as described [here](https://create-react-app.dev/docs/adding-a-sass-stylesheet).

## Current Issues / Outstanding TODOs

### Registration

* configure backend field error messages to be better
* Style non-field-errors a bit nicer
* send form on Enter

* (first/last name info as icon + popup)

### Forgot Password

* (Style progress indicator and success message a bit nicer)

### Design

#### Header
* Make it V-shaped using SVG or CSS skewing, logo in the middle, apply fading leather texture on the top?

## Learnings during dev

#### Authentication

Implementation is inspired by [this documentation](https://reacttraining.com/react-router/web/example/auth-workflow).