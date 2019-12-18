import React from 'react';
import ColorPicker from './ColorPicker';

class App extends React.Component {
    state = {
        hue: 90,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
    };

    onInput = hue => {
        this.setState({ hue });
    };

    render() {
        return (
            <div className="App">
                <ColorPicker {...this.state} onInput={this.onInput} />
            </div>
        );
    }
}

export default App;
