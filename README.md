## Radial Color Picker - React

<p align="center"><img width="250" src="https://raw.githubusercontent.com/radial-color-picker/react-color-picker/HEAD/screenshots/thumbnail.png" alt="screenshot"></p>

<p align="center">
    <a href="https://www.npmjs.com/package/@radial-color-picker/react-color-picker">
        <img src="https://img.shields.io/npm/dm/@radial-color-picker/react-color-picker.svg" alt="Downloads">
    </a>
    <a href="https://www.npmjs.com/package/@radial-color-picker/react-color-picker">
        <img src="https://img.shields.io/npm/v/@radial-color-picker/react-color-picker.svg" alt="Version">
    </a>
    <a href="https://www.npmjs.com/package/@radial-color-picker/react-color-picker">
        <img src="https://img.shields.io/npm/l/@radial-color-picker/react-color-picker.svg" alt="License">
    </a>
</p>

## Introduction

Great UX starts with two basic principles - ease of use and simplicity. Selecting a color should be as easy as moving a slider, clicking a checkbox or pressing a key just like other basic form elements behave.

This is a flexible and minimalistic color picker. Developed with mobile devices and keyboard usage in mind. Key features:
* Small size - 3.8 KB gzipped (JS and CSS combined)
* Supports touch devices
* Optimized animations
* Ease of use
    * Double click anywhere to move the knob to a color
    * <kbd>Tab</kbd> to focus the picker
    * <kbd>↑</kbd> or <kbd>→</kbd> arrow key to increase hue. <kbd>Shift + ↑/→</kbd> to go quicker and <kbd>Ctrl + ↑/→</kbd> to go even quicker.
    * <kbd>↓</kbd> or <kbd>←</kbd> arrow key to decrease hue. <kbd>Shift + ↓/←</kbd> to go quicker and <kbd>Ctrl + ↓/←</kbd> to go even quicker.
    * <kbd>Enter</kbd> to select a color and close the picker or to open it
    * Mouse <kbd>ScrollUp</kbd> to increase and <kbd>ScrollDown</kbd> to decrease hue (Opt-in)

## Ecosystem

The right color picker, but not the framework you're looking for?
* [React][link-react-color-picker] - you're here!
* [Vue][link-vue-color-picker]
* [AngularJs][link-angularjs-color-picker]
* [Angular][link-angular-color-picker] (under construction)

## Quick Links

* [Demos](#demos)
* [Usage](#usage)
* [Options](#options)
* [FAQ](#first-asked-questions)
* [Change log](#change-log)
* [Contributing](#contributing)
* [Credits](#credits)
* [License](#license)

## Demos

* Basic Example - [Codepen](https://codepen.io/rkunev/pen/mjKoyK/)

## Usage

Color Picker on [npm](https://www.npmjs.com/package/@radial-color-picker/react-color-picker)
```bash
npm install @radial-color-picker/react-color-picker
```

And in your app:

```jsx
import ColorPicker from '@radial-color-picker/react-color-picker';
import '@radial-color-picker/react-color-picker/dist/react-color-picker.umd.min.css';

class App extends React.Component {
    state = {
        hue: 90,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
    };

    onChange = (hue) => {
        this.setState({ hue });
    };

    render() {
        return <ColorPicker {...this.state} onChange={this.onChange} />;
    }
}
```

Depending on your build tool of choice (webpack, parcel, rollup) you may have to setup the appropriate loaders or plugins. If you're using `create-react-app` you don't have to do anything else - it comes preconfigured and supports CSS import out of the box.

[Back To Top](#quick-links)

## Options
`ColorPicker` is a controlled component. It's current state is defined and updated by the props you pass to it.

### Props

| Name         | Type    | Default        | Description |
|--------------|---------|----------------|-------------|
| hue          | Number  | `0`            | A number between `0-359`. **Required**. |
| saturation   | Number  | `100`          | A number between `0-100` |
| luminosity   | Number  | `50`           | A number between `0-100` |
| alpha        | Number  | `1`            | A number between `0-1` |
| disabled     | Boolean | `false`        | A boolean to disable UI interactions |
| step         | Number  | `2`            | Amount of degrees to rotate the picker with keyboard and/or wheel. |
| variant      | String  | `collapsible`  | Use `persistent` to prevent collapsing/closing |
| initiallyCollapsed | Boolean | `false` | Hides the palette initially |
| mouseScroll | Boolean | `false`        | Use wheel (scroll) event to rotate. |
| onInput    | Function | noop | Called every time the color changes (i.e. rotation). **Required**. |
| onChange    | Function | noop | Called when the user dismisses the color picker (i.e. interacting with the middle color well). |

[Back To Top](#quick-links)

## First Asked Questions

<details>
    <summary>How to select other shades of the solid colors?</summary>
    <p>We suggest to add a custom slider for saturation and luminosity or use <code>&lt;input type="range"&gt;</code>.</p>
</details>

<details>
    <summary>Why does Google Chrome throw a <code>[Violation] Added non-passive event listener to a scroll-blocking 'touchmove' event.</code> warning in the console?</summary>
    <p><code>touchmove</code> is used with <code>preventDefault()</code> to block scrolling on mobile while rotating the color knob. Even the <a href="https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#removing-the-need-to-cancel-events">Web Incubator Community Group</a> acknowledges that in some cases a passive event listener can't be used.</p>
</details>

<details>
    <summary>Why is the scroll-to-rotate functionality not turned on by default?</summary>
    <p>It's another non-passive event that could potentially introduce jank on scroll. To rotate the color knob, but stay on the same scrolling position the <code>wheel</code> event is blocked with <code>preventDefault()</code>. Thus, if you really want this feature for your users you'll have to explicitly add <code>:mouse-scroll="true"</code>.</p>
</details>
<br>

[Back To Top](#quick-links)


## Change log

Please see [Releases][link-releases] for more information on what has changed recently.

[Back To Top](#quick-links)

## Migration from v1

Straight forward - the `onChange` prop now contains only the `hue` instead of an object with the full color model.

```diff
import ColorPicker from '@radial-color-picker/react-color-picker';
import '@radial-color-picker/react-color-picker/dist/react-color-picker.umd.min.css';

class App extends React.Component {
    state = {
        hue: 90,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
    };

-    onChange = ({ hue, saturation, luminosity, alpha }) => {
-        this.setState({ hue, saturation, luminosity, alpha });
-   };
+    onChange = (hue) => {
+        this.setState({ hue });
+   };

    render() {
        return <ColorPicker {...this.state} onChange={this.onChange} />;
    }
}
```

## Contributing

If you're interested in the project you can help out with feature requests, bugfixes, documentation improvements or any other helpful contributions. You can use the issue list of this repo for bug reports and feature requests and as well as for questions and support.

Please see [CONTRIBUTING](CONTRIBUTING.md) and [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) for details.

[Back To Top](#quick-links)

## Credits

- [Rosen Kanev][link-author]
- [All Contributors][link-contributors]

This component is based on the great work that was done for the AngularJs color picker [angular-radial-color-picker][link-angularjs-color-picker].

[Back To Top](#quick-links)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-react-color-picker]: https://github.com/radial-color-picker/react-color-picker
[link-vue-color-picker]: https://github.com/radial-color-picker/vue-color-picker
[link-angular-color-picker]: https://github.com/radial-color-picker/angular-color-picker
[link-angularjs-color-picker]: https://github.com/talamaska/angular-radial-color-picker
[link-author]: https://github.com/rkunev
[link-contributors]: ../../contributors
[link-releases]: ../../releases

[Back To Top](#quick-links)
