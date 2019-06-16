import React from 'react';
import fillColorWheel from '@radial-color-picker/color-wheel';
import Rotator from '@radial-color-picker/rotator';
import './style.css';

const noop = () => {};

export default class ColorPicker extends React.Component {
    paletteRef = React.createRef();
    rotatorRef = React.createRef();
    elRef = React.createRef();

    rotator = null;

    state = {
        isKnobIn: !this.props.initiallyCollapsed,
        isPaletteIn: !this.props.initiallyCollapsed,
        isPressed: false,
        isRippling: false,
        isDragging: false,
    };

    static defaultProps = {
        hue: 0,
        saturation: 100,
        luminosity: 50,
        alpha: 1,
        step: 2,
        mouseScroll: false,
        variant: 'collapsible', // collapsible | persistent
        disabled: false,
        initiallyCollapsed: false,
        onInput: noop,
        onChange: noop,
    };

    componentDidMount() {
        if (this.props.mouseScroll) {
            this.rotatorRef.current.addEventListener('wheel', this.onScroll);
        }

        if (this.props.initiallyCollapsed && this.props.variant === 'persistent') {
            console.warn(`Incorrect config: using variant="persistent" and initiallyCollapsed={true} at the same time is not supported.`);
        }

        const isConicGradientSupported = getComputedStyle(this.paletteRef.current)
            .backgroundImage
            .includes('conic');

        if (!isConicGradientSupported) {
            fillColorWheel(
                this.paletteRef.current.firstElementChild,
                this.elRef.current.offsetWidth || 280
            );
        }

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
        if (this.state.isPressed || !this.state.isKnobIn)
            return;

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
        if (this.props.disabled || this.state.isPressed || !this.state.isKnobIn)
            return;

        const isIncrementing = ev.key === 'ArrowUp' || ev.key === 'ArrowRight';
        const isDecrementing = ev.key === 'ArrowDown' || ev.key === 'ArrowLeft';

        if (isIncrementing || isDecrementing) {
            ev.preventDefault();

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
        this.props.onInput(hue);
    };

    rotateToMouse = ev => {
        if (this.state.isPressed || !this.state.isKnobIn || ev.target !== this.rotatorRef.current)
            return;

        this.rotator.setAngleFromEvent(ev);
    };

    selectColor = () => {
        this.setState({ isPressed: true });

        if (this.state.isPaletteIn && this.state.isKnobIn) {
            this.props.onChange(this.props.hue);
            this.setState({ isRippling: true });
        } else {
            this.setState({ isPaletteIn: true });
        }
    };

    togglePicker = () => {
        if (this.props.variant !== 'persistent') {
            if (this.state.isKnobIn) {
                this.setState({ isKnobIn: false });
            } else {
                this.setState({
                    isKnobIn: true,
                    isPaletteIn: true,
                });
            }
        }

        this.setState({
            isRippling: false,
            isPressed: false,
        });
    };

    hidePalette = () => {
        if (!this.state.isKnobIn) {
            this.setState({ isPaletteIn: false });
        }
    };

    render() {
        const { disabled, hue, saturation, luminosity, alpha } = this.props;
        const { isDragging, isPressed, isPaletteIn, isKnobIn, isRippling } = this.state;

        const color = `hsla(${hue}, ${saturation}%, ${luminosity}%, ${alpha})`;

        return (
            <div
                ref={this.elRef}
                className={`rcp ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`.trim()}
                tabIndex={disabled ? -1 : 0}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
            >
                <div
                    ref={this.paletteRef}
                    className={`rcp__palette ${isPaletteIn ? 'in' : 'out'}`}
                >
                    <canvas />
                </div>

                <div
                    ref={this.rotatorRef}
                    className="rcp__rotator"
                    style={{ pointerEvents: disabled || isPressed || !isKnobIn ? 'none' : null }}
                    onDoubleClick={this.rotateToMouse}
                >
                    <div
                        className={`rcp__knob ${isKnobIn ? 'in' : 'out'}`}
                        onTransitionEnd={this.hidePalette}
                    />
                </div>

                <div
                    className={`rcp__ripple ${isRippling ? 'rippling' : ''}`.trim()}
                    style={{ borderColor: color }}
                />

                <button
                    type="button"
                    className={`rcp__well ${isPressed ? 'pressed' : ''}`.trim()}
                    style={{ backgroundColor: color }}
                    onClick={this.selectColor}
                    onAnimationEnd={this.togglePicker}
                />
            </div>
        );
    }
}
