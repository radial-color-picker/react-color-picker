import { useRef, useState, useEffect } from 'react';
import fillColorWheel from '@radial-color-picker/color-wheel';
import Rotator from '@radial-color-picker/rotator';
import './style.css';

const noop = () => {};

const ColorPicker = ({
    hue = 0,
    saturation = 100,
    luminosity = 50,
    alpha = 1,
    step = 2,
    mouseScroll = false,
    variant = 'collapsible', // collapsible | persistent
    disabled = false,
    initiallyCollapsed = false,
    onInput = noop,
    onChange = noop,
}) => {
    const paletteRef = useRef(null);
    const rotatorRef = useRef(null);
    const elRef = useRef(null);
    const rotator = useRef(null);

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
            angle: hue,
            onRotate: updateColor,
            onDragStart() {
                setIsDragging(true);
            },
            onDragStop() {
                setIsDragging(false);
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
        rotator.current.angle = hue;
    }, [hue]);

    const onScroll = ev => {
        if (isPressed || !isKnobIn) return;

        ev.preventDefault();

        if (ev.deltaY > 0) {
            rotator.current.angle += step;
        } else {
            rotator.current.angle -= step;
        }

        updateColor(rotator.current.angle);
    };

    const onKeyUp = ev => {
        if (ev.key === 'Enter') {
            selectColor();
        }
    };

    const onKeyDown = ev => {
        if (disabled || isPressed || !isKnobIn) return;

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

            rotator.current.angle += step * multiplier;
            updateColor(rotator.current.angle);
        }
    };

    const updateColor = hue => {
        onInput(hue);
    };

    const rotateToMouse = ev => {
        if (isPressed || !isKnobIn || ev.target !== rotatorRef.current) return;

        rotator.current.setAngleFromEvent(ev);
    };

    const selectColor = () => {
        setIsPressed(true);

        if (isPaletteIn && isKnobIn) {
            onChange(hue);
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

    const color = `hsla(${hue}, ${saturation}%, ${luminosity}%, ${alpha})`;

    return (
        <div
            ref={elRef}
            className={`rcp ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`.trim()}
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
                style={{ pointerEvents: disabled || isPressed || !isKnobIn ? 'none' : null }}
                onDoubleClick={rotateToMouse}
            >
                <div className={`rcp__knob ${isKnobIn ? 'in' : 'out'}`} onTransitionEnd={hidePalette} />
            </div>

            <div className={`rcp__ripple ${isRippling ? 'rippling' : ''}`.trim()} style={{ borderColor: color }} />

            <button
                type="button"
                className={`rcp__well ${isPressed ? 'pressed' : ''}`.trim()}
                style={{ backgroundColor: color }}
                onClick={selectColor}
                onAnimationEnd={togglePicker}
            />
        </div>
    );
};

export default ColorPicker;
