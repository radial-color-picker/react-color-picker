import { useState } from 'react';
import ColorPicker from './ColorPicker.jsx';

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

export default App;
