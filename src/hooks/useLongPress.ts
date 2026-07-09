import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

const LONG_PRESS_MS = 450;

export default function useLongPress(onLongPress: () => void, onClick: () => void) {
	const timerRef = useRef<number | null>(null);
	const firedRef = useRef(false);

	const cancel = useCallback(() => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	useEffect(() => cancel, [cancel]);

	const onPointerDown = useCallback(() => {
		firedRef.current = false;
		cancel();
		timerRef.current = window.setTimeout(() => {
			timerRef.current = null;
			firedRef.current = true;
			onLongPress();
		}, LONG_PRESS_MS);
	}, [cancel, onLongPress]);

	const handleClick = useCallback(() => {
		// A click still arrives after the long-press fires; swallow it so the
		// short-tap action doesn't run on top of the long-press one.
		if (firedRef.current) {
			firedRef.current = false;
			return;
		}
		onClick();
	}, [onClick]);

	const onContextMenu = useCallback((e: ReactMouseEvent) => {
		e.preventDefault();
	}, []);

	return {
		onPointerDown,
		onPointerUp: cancel,
		onPointerLeave: cancel,
		onPointerCancel: cancel,
		onClick: handleClick,
		onContextMenu,
	};
}
