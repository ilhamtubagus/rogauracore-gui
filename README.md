<img src="https://user-images.githubusercontent.com/53269620/136634026-598db9c9-b19a-4933-af37-1cd99e066761.png" width="150"/>

# ROG AURA CORE - RGB Keyboard Control for ASUS ROG 
This project was built with [Electron](https://www.electronjs.org/), bootstrapped with create-react-app and [material-ui](https://mui.com/). Original rogauracore tool can be found at [Will Roberts Repository](https://github.com/wroberts/rogauracore). Supports RGB keyboards as described by [Will Roberts](https://github.com/wroberts/rogauracore) with IDs 0b05:1854 (`GL553`, `GL753`), 0b05:1869 (`GL503`, `FX503`, `GL703`), 0b05:1866 (`GL504`, `GL703`, `GX501`, `GM501`), and 0b05:19b6 (`GA503`). For more compatibility information please refer to the original [rogauracore tool](https://github.com/wroberts/rogauracore).

![Rog Aura Core Gui](https://user-images.githubusercontent.com/53269620/135981590-c8a59315-28c6-46fe-8d05-53bc5909bffa.png)

## Feature
- Single Section Color
  - Static
  - Breathing
  - Color cycle
- Multi Section Color (4 Zone)
  - Static
  - Breathing

## Download & Installation
This package only available in deb file. If you need other distributions you can directly clone this repo and build your own.

1. Download the file in [here](https://github.com/ilhamtubagus/rogauracore-gui/releases).
2. `cd ` into file directory.
3. run `sudo dpkg -i "replace with filename"` or you can open the file directly if you have `.deb` installer.

## Available Scripts

In the project directory, you can run:

` npm run dev `

Runs the app in the development mode with developer tools. The app will reload if you make edits. 
You will also see any lint errors in the console. 

`npm run build`

Builds the app for production to the `build` folder and `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance. It also pack the application into `.deb` package.
