# RTG UI

## Current upgrades & TODOs

* Material UI v1.x
    * [Migration Guide](https://material-ui.com/guides/migration-v0x/)
    * Schedule page: find replacements for Date and TimePicker (AddGameFormDisplay.jsx)
    * Bets page:
        * bets input: DONE except for select on focus (ref is null after 2-3 clicks?)
    * UserDetailsPopover: bottom margin; click away and close button not closing properly
    * Password reset page
    * Never use colours exported from RtgTheme directly, favour withTheme, remove exports
    * Check remaining linter complaints
    
### Follow-up Material UI upgrade

* Is Webpack able to correctly tree shake multi-component imports of material-ui?
    * For now, I changed it to use individual imports for each component
    * Maybe analyze bundle size with webpack bundle analyzer
    
### Testing

#### Explorative

* Do some more intensive explorative testing after the Material UI upgrade

#### Automated

* Start writing some basic "money path" Browser tests in a separate repo using Geb


## Toolchain

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app).

### Material UI

Material UI has been added as CSS Framework as described [here](https://stackoverflow.com/a/44197904).

### Sass

Sass support has been configured as described [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc).

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