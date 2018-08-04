import React from 'react';
import fillColorWheel from '@radial-color-picker/color-wheel';
import Rotator from '@radial-color-picker/rotator';
import './style.scss';

const noop = () => {};

export default class ColorPicker extends React.Component {
    paletteRef = React.createRef();
    rotatorRef = React.createRef();

    rotator = null;

    state = {
        isKnobIn: true,
        isPaletteIn: true,
        isPressed: false,
        isRippling: false,
        isDisabled: false,
        isDragging: false,
    };

    static defaultProps = {
        hue: 0,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
        step: 2,
        mouseScroll: false,
        onChange: noop,
        onSelect: noop,
    };

    componentDidMount() {
        if (this.props.mouseScroll) {
            this.rotatorRef.current.addEventListener('wheel', this.onScroll);
        }

        fillColorWheel(this.paletteRef.current, this.paletteRef.current.offsetWidth || 280);

        this.rotator = new Rotator(this.rotatorRef.current, {
            angle: this.props.hue,
            onRotate: this.updateColor,
            onDragStart: () => {
                this.setState({ isDragging: true });
            },
            onDragStop: () => {
                this.setState({ isDragging: false });
            },
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.hue !== prevProps.hue) {
            this.rotator.angle = this.props.hue;
        }
    }

    componentWillUnmount() {
        this.rotator.destroy();
        this.rotator = null;

        if (this.props.mouseScroll) {
            this.rotatorRef.current.removeEventListener('wheel', this.onScroll);
        }
    }

    onScroll = ev => {
        if (this.state.isDisabled) return;

        ev.preventDefault();

        if (ev.deltaY > 0) {
            this.rotator.angle += this.props.step;
        } else {
            this.rotator.angle -= this.props.step;
        }

        this.updateColor(this.rotator.angle);
    };

    onKeyUp = ev => {
        if (ev.key === 'Enter') {
            this.selectColor();
        }
    };

    onKeyDown = ev => {
        if (this.state.isDisabled) return;

        ev.preventDefault();

        const isIncrementing = ev.key === 'ArrowUp' || ev.key === 'ArrowRight';
        const isDecrementing = ev.key === 'ArrowDown' || ev.key === 'ArrowLeft';

        if (isIncrementing || isDecrementing) {
            let multiplier = isIncrementing ? 1 : -1;

            if (ev.ctrlKey) {
                multiplier *= 6;
            } else if (ev.shiftKey) {
                multiplier *= 3;
            }

            this.rotator.angle += this.props.step * multiplier;
            this.updateColor(this.rotator.angle);
        }
    };

    updateColor = hue => {
        const { saturation, luminosity, alpha } = this.props;

        this.props.onChange({ hue, saturation, luminosity, alpha });
    };

    rotateToMouse = ev => {
        if (this.isDisabled || ev.target !== this.rotatorRef.current) return;

        this.rotator.setAngleFromEvent(ev);
    };

    selectColor = () => {
        this.setState({ isPressed: true });

        if (!this.state.isDisabled) {
            const { hue, saturation, luminosity, alpha } = this.props;

            this.props.onSelect({ hue, saturation, luminosity, alpha });

            this.setState({ isRippling: true });
        } else {
            this.setState({ isPaletteIn: true });
        }
    };

    togglePicker = () => {
        this.setState({
            isKnobIn: this.state.isDisabled,
            isPressed: false,
        });
    };

    hidePalette = () => {
        if (!this.state.isDisabled) {
            this.setState({ isPaletteIn: false });
        } else {
            this.setState({ isDisabled: false });
        }
    };

    stopRipple = () => {
        this.setState({ isRippling: false });
    };

    toggleKnob = ev => {
        // 'transitionend' fires for every transitioned property
        if (ev.propertyName === 'transform') {
            if (this.state.isDisabled) {
                this.setState({ isKnobIn: true });
            } else {
                this.setState({ isDisabled: true });
            }
        }
    };

    render() {
        const { isRippling, isPressed, isPaletteIn, isDragging, isKnobIn, isDisabled } = this.state;

        const { hue, saturation, luminosity, alpha } = this.props;

        const paletteClassName = `palette ${isPaletteIn ? 'is-in' : 'is-out'}`;
        const colorSelClassName = `selector ${isPressed ? 'is-pressed' : ''}`;
        const colorShadowClassName = `ripple ${isRippling ? 'is-rippling' : ''}`;
        const rotatorClassName = `rotator ${isDisabled ? 'disabled' : ''} ${
            isDragging ? 'dragging' : ''
        }`;
        const knobClassName = `knob ${isKnobIn ? 'is-in' : 'is-out'}`;
        const color = `hsla(${hue}, ${saturation}%, ${luminosity}%, ${alpha})`;

        return (
            <div
                className="color-picker"
                tabIndex="0"
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
            >
                <div className={paletteClassName} onTransitionEnd={this.toggleKnob}>
                    <canvas ref={this.paletteRef} />
                </div>

                <div
                    ref={this.rotatorRef}
                    className={rotatorClassName}
                    onDoubleClick={this.rotateToMouse}
                >
                    <div onTransitionEnd={this.hidePalette} className={knobClassName} />
                </div>

                <div
                    className={colorShadowClassName}
                    style={{ borderColor: color }}
                    onAnimationEnd={this.stopRipple}
                />

                <button
                    type="button"
                    className={colorSelClassName}
                    style={{ backgroundColor: color }}
                    onClick={this.selectColor}
                    onAnimationEnd={this.togglePicker}
                />
            </div>
        );
    }
}
