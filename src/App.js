import { useState } from 'react';
import ColorPicker from './ColorPicker';
import './ColorPicker/style.css';

function App() {
    const [color, setColor] = useState({
        hue: 90,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
    });

    const onInput = hue => {
        setColor(prev => ({ ...prev, hue }));
    };

    return (
        <div className="App">
            <ColorPicker {...color} onInput={onInput} />
        </div>
    );
}

export default App;
