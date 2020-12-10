import { useRef, useState, useEffect } from 'react';
import fillColorWheel from '@radial-color-picker/color-wheel';
import Rotator from '@radial-color-picker/rotator';

const noop = () => {};
const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'red'];
const keys = {
    ArrowUp: (oldAngle, step) => oldAngle + step,
    ArrowRight: (oldAngle, step) => oldAngle + step,
    ArrowDown: (oldAngle, step) => oldAngle - step,
    ArrowLeft: (oldAngle, step) => oldAngle - step,
    PageUp: (oldAngle, step) => oldAngle + step * 10,
    PageDown: (oldAngle, step) => oldAngle - step * 10,
    Home: () => 0,
    End: () => 359,
};

const ColorPicker = ({
    hue = 0,
    saturation = 100,
    luminosity = 50,
    alpha = 1,
    disabled = false,
    step = 1,
    variant = 'collapsible', // collapsible | persistent
    initiallyCollapsed = false,
    mouseScroll = false,
    ariaLabelColorWell = 'color well',
    onInput = noop,
    onChange = noop,
    onSelect = noop,
    className,
    ...rest
}) => {
    const paletteRef = useRef(null);
    const rotatorRef = useRef(null);
    const elRef = useRef(null);
    const rotator = useRef(null);

    const angleRef = useRef(hue);

    // set the SSR value just once when the component is created
    // prevents knob jumping when using Server Side Rendering
    // where the knob's position is updated only after the client-side code is executed (on mount)
    const [ssrHue, setSsrHue] = useState(hue);

    const [isKnobIn, setIsKnobIn] = useState(!initiallyCollapsed);
    const [isPaletteIn, setIsPaletteIn] = useState(!initiallyCollapsed);
    const [isPressed, setIsPressed] = useState(false);
    const [isRippling, setIsRippling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (mouseScroll) {
            rotatorRef.current.addEventListener('wheel', onScroll);
        }

        if (process.env.NODE_ENV === 'development' && initiallyCollapsed && variant === 'persistent') {
            console.warn(
                `Incorrect config: using variant="persistent" and initiallyCollapsed={true} at the same time is not supported.`
            );
        }

        const isConicGradientSupported = getComputedStyle(paletteRef.current).backgroundImage.includes('conic');

        if (!isConicGradientSupported) {
            fillColorWheel(paletteRef.current.firstElementChild, elRef.current.offsetWidth || 280);
        }

        rotator.current = new Rotator(rotatorRef.current, {
            angle: angleRef.current,
            onRotate(value) {
                angleRef.current = value;
                onInput(value);
            },
            onDragStart() {
                setIsDragging(true);
            },
            onDragStop() {
                setIsDragging(false);
                onChange(angleRef.current);
            },
        });

        return () => {
            rotator.current.destroy();
            rotator.current = null;

            if (mouseScroll) {
                rotatorRef.current.removeEventListener('wheel', onScroll);
            }
        };
    }, []);

    useEffect(() => {
        angleRef.current = hue;
        rotator.current.angle = hue;
    }, [hue]);

    const onScroll = ev => {
        if (isPressed || !isKnobIn) return;

        ev.preventDefault();

        const newAngle = ev.deltaY > 0
            ? rotator.current.angle + step
            : rotator.current.angle - step;

        rotator.current.angle = newAngle;

        angleRef.current = newAngle;
        onInput(newAngle);
        onChange(newAngle);
    };

    const onKeyUp = ev => {
        if (ev.key === 'Enter' && ev.target === elRef.current) {
            selectColor();
        }
    };

    const onKeyDown = ev => {
        if (disabled || isPressed || !isKnobIn || !(ev.key in keys)) return;

        ev.preventDefault();

        const newAngle = keys[ev.key](rotator.current.angle, step);

        rotator.current.angle = newAngle;

        angleRef.current = newAngle;
        onInput(newAngle);
        onChange(newAngle);
    };

    const rotateToMouse = ev => {
        if (isPressed || !isKnobIn || ev.target !== rotatorRef.current) return;

        rotator.current.setAngleFromEvent(ev);
    };

    const selectColor = () => {
        setIsPressed(true);

        if (isPaletteIn && isKnobIn) {
            onSelect(angleRef.current);
            setIsRippling(true);
        } else {
            setIsPaletteIn(true);
        }
    };

    const togglePicker = () => {
        if (variant !== 'persistent') {
            if (isKnobIn) {
                setIsKnobIn(false);
            } else {
                setIsKnobIn(true);
                setIsPaletteIn(true);
            }
        }

        setIsRippling(false);
        setIsPressed(false);
    };

    const hidePalette = () => {
        if (!isKnobIn) {
            setIsPaletteIn(false);
        }
    };

    const color = `hsla(${angleRef.current}, ${saturation}%, ${luminosity}%, ${alpha})`;

    return (
        <div
            aria-roledescription="radial slider"
            aria-label="color picker"
            aria-valuetext={colors[Math.round(angleRef.current / 60)]}
            {...rest}
            aria-expanded={isPaletteIn}
            aria-valuenow={angleRef.current}
            aria-disabled={disabled}
            aria-valuemin={0}
            aria-valuemax={359}
            ref={elRef}
            role="slider"
            className={`rcp ${className} ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`.trim()}
            tabIndex={disabled ? -1 : 0}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
        >
            <div ref={paletteRef} className={`rcp__palette ${isPaletteIn ? 'in' : 'out'}`}>
                <canvas />
            </div>

            <div
                ref={rotatorRef}
                className="rcp__rotator"
                style={{
                    pointerEvents: disabled || isPressed || !isKnobIn ? 'none' : null,
                    transform: `rotate(${ssrHue}deg)`,
                }}
            >
                <div className={`rcp__knob ${isKnobIn ? 'in' : 'out'}`} onTransitionEnd={hidePalette} />
            </div>

            <div className={`rcp__ripple ${isRippling ? 'rippling' : ''}`.trim()} style={{ borderColor: color }} />

            <button
                type="button"
                className={`rcp__well ${isPressed ? 'pressed' : ''}`.trim()}
                style={{ backgroundColor: color }}
                aria-label={ariaLabelColorWell}
                disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                onAnimationEnd={togglePicker}
                onClick={selectColor}
            />
        </div>
    );
};

export default ColorPicker;
