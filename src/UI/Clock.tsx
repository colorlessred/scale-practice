import {useCallback, useEffect, useMemo, useRef} from 'react';

//TODO understand this
function useInterval(tickCallback: () => void, delay: number, isPlaying: boolean) {
    const timeout = useRef<any>(null);
    const savedDelay = useRef<number>(delay);
    const savedTickCallback = useRef(tickCallback);

    useEffect(() => {
        savedDelay.current = delay;
    }, [delay]);

    useEffect(() => {
        savedTickCallback.current = tickCallback;
    }, [tickCallback]);

    const startTimeout = useCallback(() => {
        const delay = savedDelay.current;
        console.log('next delay', delay);
        timeout.current = setTimeout(() => {
            console.log('delay done', delay);
            savedTickCallback.current();
            startTimeout();
        }, savedDelay.current);
    }, []);

    useEffect(() => {
            if (isPlaying) {
                if (!timeout.current) {
                    startTimeout();
                }
            } else {
                if (timeout.current) {
                    clearTimeout(timeout.current);
                    timeout.current = null;
                }
            }
        }, [isPlaying, startTimeout],
    );
}

type Props = {
    /** true if playing */
    isPlaying: boolean;

    /** return the current notes per minute */
    getNpm: () => number;

    /** function to be executed every tick */
    callback: () => void;
}

export function Clock({isPlaying, getNpm, callback}: Props) {

    const delay = useMemo(() => {
        console.log(`compute delay for npm ${getNpm()}`);
        return 60_000 / getNpm();
    }, [getNpm]);

    useInterval(callback, delay, isPlaying);

    return null;
}