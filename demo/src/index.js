import React from 'react';
import ReactDOM from 'react-dom';

import ColorPicker from '../../src';

class Demo extends React.Component {
    render() {
        return <ColorPicker />;
    }
}

ReactDOM.render(<Demo />, document.querySelector('#demo'));
