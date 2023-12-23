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
* Small size - 2.9 KB gzipped (JS and CSS combined)
* Supports touch devices
* Optimized animations
* Ease of use
    * Screen reader support.
    * <kbd>Tab</kbd> to focus the picker.
    * <kbd>↑</kbd> or <kbd>→</kbd> arrow key to increase hue. <kbd>PgUp</kbd> to go quicker.
    * <kbd>↓</kbd> or <kbd>←</kbd> arrow key to decrease hue. <kbd>PgDown</kbd> to go quicker.
    * <kbd>Enter</kbd> to select a color and close the picker or to open it.
    * Mouse <kbd>ScrollUp</kbd> to increase and <kbd>ScrollDown</kbd> to decrease hue (Opt-in).

## Ecosystem

The right color picker, but not the framework you're looking for?
* [React][link-react-color-picker] - you're here!
* [Vue][link-vue-color-picker]
* [AngularJs][link-angularjs-color-picker]
* [Angular][link-angular-color-picker]

## Demos

* Basic Example - [Codepen](https://codepen.io/rkunev/pen/mjKoyK/)

## Usage

#### With Module Build System

Color Picker on [npm](https://www.npmjs.com/package/@radial-color-picker/react-color-picker)

```bash
npm install @radial-color-picker/react-color-picker
```

And in your app:

```jsx
import ColorPicker from '@radial-color-picker/react-color-picker';
import '@radial-color-picker/react-color-picker/dist/style.css';

function App() {
    const [color, setColor] = useState({
        hue: 90,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
    });

    const onInput = (hue) => {
        setColor((prev) => ({ ...prev, hue }));
    };

    return <ColorPicker {...color} onInput={onInput} />;
}
```

Depending on your build tool of choice (vite, webpack, etc.) you may have to setup the appropriate plugins or loaders. If you're using `vite` you don't have to do anything else - it comes preconfigured and supports CSS import out of the box.

## Options

`ColorPicker` can be used either as a controlled component or as uncontrolled component.
```jsx
// Controlled component. Its current state is defined and updated by the props you pass to it.
<ColorPicker hue={value} onInput={(hue) => setValue(hue)} />

// Uncontrolled component. You can use onChange to react to knob rotation stop for example.
<ColorPicker onChange={(hue) => console.log('Current color:', hue)} />
```

| Name         | Type    | Default        | Description |
|--------------|---------|----------------|-------------|
| hue          | Number  | `0`            | A number between `0-359`. |
| saturation   | Number  | `100`          | A number between `0-100` |
| luminosity   | Number  | `50`           | A number between `0-100` |
| alpha        | Number  | `1`            | A number between `0-1` |
| disabled     | Boolean | `false`        | A boolean to disable UI interactions |
| step         | Number  | `2`            | Amount of degrees to rotate the picker with keyboard and/or wheel. |
| variant      | String  | `collapsible`  | Use `persistent` to prevent collapsing/closing |
| initiallyCollapsed | Boolean | `false` | Hides the palette initially |
| mouseScroll | Boolean | `false`        | Use wheel (scroll) event to rotate. |
| ariaLabelColorWell | String  | `color well`  | Labels the color well |
| onInput    | Function | noop | Called every time the color updates. Use this to update the hue prop. |
| onChange    | Function | noop |  Called every time the color changes, but unlike onInput this is not called while rotating the knob. |
| onSelect    | Function | noop |  Called when the user dismisses the color picker (i.e. interacting with the middle color well). |

## First Asked Questions

<details>
    <summary>What's the browser support?</summary>
    <p>The last two versions of major browsers (Chrome, Safari, Firefox, Edge) are supported though it will probably work in other browsers, webviews and runtimes as well.</p>
</details>

<details>
    <summary>How to select other shades of the solid colors?</summary>
    <p>We suggest to add a custom slider for saturation and luminosity or use <code>&lt;input type="range"&gt;</code>.</p>
</details>

<details>
    <summary>Why exactly <code>onInput</code>/<code>onChange</code> events?</summary>
    <p>Event names are based on the HTML <code>&lt;input type="color"&gt;</code>. <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color#Tracking_color_changes">MDN</a>: As is the case with other <code>&lt;input&gt;</code> types, there are two events that can be used to detect changes to the color value: input and change. input is fired on the <code>&lt;input&gt;</code> element every time the color changes. The change event is fired when the user dismisses the color picker.</p>
</details>

<details>
    <summary>Why is the scroll-to-rotate functionality not turned on by default?</summary>
    <p>It's another non-passive event that could potentially introduce jank on scroll. To rotate the color knob, but stay on the same scrolling position the <code>wheel</code> event is blocked with <code>preventDefault()</code>. Thus, if you really want this feature for your users you'll have to explicitly add <code>mouseScroll={true}</code>.</p>
</details>

<br>

## Change log

Please see [Releases][link-releases] for more information on what has changed recently.

## Migration

### Migration from v3 to v4

1. In an effort of project modernization, CJS build is no longer provided. The UMD build is deprecated and will be removed in a future version.
2. Non-minified builds are no longer provided. Use the minified build artifacts instead.
3. The StyleSheet in the `dist` directory has been renamed from `react-color-picker.min.css` to `style.css`. 

### Migration from v2 to v3

1. Double-click to move the knob to the current position of the pointer is gone since this is now the default behavior as soon as the clicks on the palette. If you had a tooltip or a help section in your app that described the shortcut you should remove it.

2. With v3 the keyboard shortcuts are better aligned with the suggested keys for any [sliders](https://www.w3.org/TR/wai-aria-practices/#slider). This means that the <kbd>Shift/Ctrl + ↑/→</kbd>/<kbd>Shift/Ctrl + ↓/←</kbd> non-standard key combos are replaced by the simpler <kbd>PageDown</kbd> and <kbd>PageUp</kbd>. If you had a tooltip or a help section in your app that described the shortcut keys you should update it.

3. The `onChange` event is now emitted when the user changes the color (knob drop, click on the palette, keyboard interaction, scroll) and a `onSelect` event is emitted when interacting with the color well (middle selector).

```diff
  <ColorPicker
      hue={hue}
      onInput={updateHue}
-     onChange={onColorSelect}
  />

  <ColorPicker
      hue={hue}
      onInput={updateHue}
+     onChange={onColorChange}
+     onSelect={onColorSelect}
  />
```

### Migration from v1 to v2

v2 comes with lots of performance improvements like native CSS `conic-gradient` support and lots of bugfixes, but some things were changed as well.

1. The UMD prefix in the CSS file name is now gone:

```diff
- import '@radial-color-picker/react-color-picker/dist/react-color-picker.umd.min.css';
+ import '@radial-color-picker/react-color-picker/dist/react-color-picker.min.css';
```

2. The `onChange` prop is called `onInput` and `onSelect` prop is called `onChange` now. The reason for that is to align with the event names on the HTML `<input type="color">`.

```diff
- <ColorPicker {...color} onChange={onHueChange} onSelect={onMiddleSelectorClick} />
+ <ColorPicker {...color} onInput={onHueChange} onChange={onMiddleSelectorClick} />
```

<br>

3. The `onInput` and `onChange` props were streamlined and will no longer pass the `saturation`, `luminosity` and `alpha` props back. Instead `hue` will be the only param. This reduces unneeded object creation and in certain edge-cases skips unneeded re-renders (comparing two numbers vs. two objects).

```diff
- const onHueChange = (color) => {
-     setHue(color.hue);
- };

+ const onHueChange = (hue) => {
+     setHue(hue);
+ };
```

4. The internal CSS class names also changed. You should avoid relying on the inner DOM structure and CSS class names, but if you did here's a handy list of what was renamed:
    * `.color-picker` -> `.rcp`
    * `.palette` -> `.rcp__palette`
    * `.knob` -> `.rcp__knob`
    * `.rotator` -> `.rcp__rotator`
    * `.selector` -> `.rcp__well`
    * `.ripple` -> `.rcp__ripple`
    * `.is-in` -> `.in`
    * `.is-out` -> `.out`
    * `.is-pressed` -> `.pressed`
    * `.is-rippling` -> `.rippling`
    * `@keyframes color-picker-ripple` -> `@keyframes rcp-ripple`
    * `@keyframes color-picker-beat` -> `@keyframes rcp-beat`

## Contributing

If you're interested in the project you can help out with feature requests, bugfixes, documentation improvements or any other helpful contributions. You can use the issue list of this repo for bug reports and feature requests and as well as for questions and support.

Please see [CONTRIBUTING](CONTRIBUTING.md) and [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) for details.

## Credits

- [Rosen Kanev][link-author]
- [All Contributors][link-contributors]

This component is based on the great work that was done for the AngularJs color picker [angular-radial-color-picker][link-angularjs-color-picker].

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-react-color-picker]: https://github.com/radial-color-picker/react-color-picker
[link-vue-color-picker]: https://github.com/radial-color-picker/vue-color-picker
[link-angular-color-picker]: https://github.com/radial-color-picker/angular-color-picker
[link-angularjs-color-picker]: https://github.com/talamaska/angular-radial-color-picker
[link-author]: https://github.com/rkunev
[link-contributors]: ../../contributors
[link-releases]: ../../releases