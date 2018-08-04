import React from 'react';
import ReactDOM from 'react-dom';

import ColorPicker from '../../src';

class Demo extends React.Component {
    state = {
        hue: 90,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
    };

    onChange = ({ hue, saturation, luminosity, alpha }) => {
        this.setState({ hue, saturation, luminosity, alpha });
    };

    render() {
        return <ColorPicker {...this.state} onChange={this.onChange} />;
    }
}

ReactDOM.render(<Demo />, document.querySelector('#demo'));
