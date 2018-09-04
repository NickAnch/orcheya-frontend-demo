# Orcheya project

The client of MVP internal gaming platform for the organizations

## Our technologies
- `NVM`
- `NodeJS ^9.x`
- `TypeScript`, `ES6`, `ES7`, `ES8`
- `Angular 5`
- `yarn`

## To start contributing run:
- `git clone ...` - clone git repository
- `yarn install` - install the packages
- `yarn start` - start development server

## Available scripts
- `yarn start` - start the development server
- `yarn build` - run production build
- `yarn lint` - lint the code through tslint
- `yarn test` - test the code through karma and jasmine
- `yarn deploy` - deploy to test server

## Deploy information
You need the access to the test server using ssh-key to deploy.

To deploy the project you need to run yarn script.

```
$ yarn deploy
```

## Style Guides
#### TS and Angular
- We add `underscore` before private variables, methods and classes
- We write `public` before public things
- We add `I` before interfaces
- In other cases, we follow [Angular style guides](https://angular.io/guide/styleguide) and [TSlint](https://github.com/palantir/tslint)

#### HTML
- HTML doesn't have strict rules, so we follow [Google Style guide](https://google.github.io/styleguide/htmlcssguide.html) and [link to repository](https://github.com/google/styleguide)
- We don't use formatting html code in jsx style. Especially closing tag on new line. Please follow this [guide](https://google.github.io/styleguide/htmlcssguide.html#HTML_Line-Wrapping) in creating multiline tags. Third example.

#### CSS
- We use [this](https://github.com/brigade/scss-lint) for linting css code. You can integrate it in your redactor

## Additional Tools
### Template
We are using free admin template `AdminLTE` as a done markup parts.
You need to minimize the use of your pieces of layout and use what is already in the template to the maximum

[demo](https://adminlte.io/themes/AdminLTE/)
