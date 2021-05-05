# Sketch plugin: Yoco icon export

## Installation

- [Download](../../releases/latest/download/sketch-icon-export.sketchplugin.zip)
  the latest release of the plugin
- Un-zip
- Double-click on `yoco-icon-export.sketchplugin`

## Development Guide

This plugin was created using `skpm`. For a detailed explanation on how things
work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md).

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

### Publishing

```bash
npm run skpm:publish <version_bump>
```

Where `version_bump` can be `patch`, `minor` or `major`.

`skpm publish` will create a new release on your GitHub repository and create an appcast file in order for Sketch users to be notified of the update.

You will need to specify a `repository` in the `package.json`:

```diff
...
+ "repository" : {
+   "type": "git",
+   "url": "git+https://github.com/ORG/NAME.git"
+  }
...
```
