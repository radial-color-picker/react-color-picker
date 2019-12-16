import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
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
    const palette = useRef(null);
    const rotator = useRef(null);
    const el = useRef(null);
    const rcp = useRef(null);

    const [isKnobIn, setIsKnobIn] = useState(!initiallyCollapsed);
    const [isPaletteIn, setIsPaletteIn] = useState(!initiallyCollapsed);
    const [isPressed, setIsPressed] = useState(false);
    const [isRippling, setIsRippling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    function onScroll(ev) {
        if (isPressed || !isKnobIn) return;

        ev.preventDefault();

        if (ev.deltaY > 0) {
            rcp.current.angle += step;
        } else {
            rcp.current.angle -= step;
        }

        updateColor(rcp.current.angle);
    }

    function onKeyUp(ev) {
        if (ev.key === 'Enter') {
            selectColor();
        }
    }

    function onKeyDown(ev) {
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

            rcp.current.angle += step * multiplier;
            updateColor(rcp.current.angle);
        }
    }

    function updateColor(hue) {
        onInput(hue);
    }

    function rotateToMouse(ev) {
        if (isPressed || !isKnobIn || ev.target !== rotator.current) return;

        rcp.current.setAngleFromEvent(ev);
    }

    function selectColor() {
        setIsPressed(true);

        if (isPaletteIn && isKnobIn) {
            onChange(hue);
            setIsRippling(true);
        } else {
            setIsPaletteIn(true);
        }
    }

    function togglePicker() {
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
    }

    function hidePalette() {
        if (!isKnobIn) {
            setIsPaletteIn(false);
        }
    }

    useLayoutEffect(() => {
        const rotatorEl = rotator.current;
        if (mouseScroll) {
            rotatorEl.addEventListener('wheel', onScroll);
        }

        if (initiallyCollapsed && variant === 'persistent') {
            console.warn(
                `Incorrect config: using variant="persistent" and initiallyCollapsed={true} at the same time is not supported.`
            );
        }

        const isConicGradientSupported = getComputedStyle(palette.current).backgroundImage.includes('conic');

        if (!isConicGradientSupported) {
            fillColorWheel(palette.current.firstElementChild, el.current.offsetWidth || 280);
        }

        rcp.current = new Rotator(rotator.current, {
            angle: hue,
            onRotate: updateColor,
            onDragStart: () => setIsDragging(true),
            onDragStop: () => setIsDragging(false),
        });

        return () => {
            rcp.current.destroy();

            if (mouseScroll) {
                rotatorEl.removeEventListener('wheel', onScroll);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        rcp.current.angle = hue;
    }, [hue]);

    const color = `hsla(${hue}, ${saturation}%, ${luminosity}%, ${alpha})`;

    return (
        <div
            ref={el}
            className={`rcp ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`.trim()}
            tabIndex={disabled ? -1 : 0}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
        >
            <div ref={palette} className={`rcp__palette ${isPaletteIn ? 'in' : 'out'}`}>
                <canvas />
            </div>

            <div
                ref={rotator}
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
