import { useRef } from "react";
import Button from 'react-bootstrap/Button';

type Props = {
    step: number,
    getSpeed: () => number,
    setSpeed: (newValue: number) => void,
}

export function SpeedControlManual({ step, getSpeed, setSpeed }: Props) {
    const ref = useRef<{ display: string }>({ display: (step > 0) ? '+' : "-" });

    const click = function () {
        setSpeed(getSpeed() + step)
    };

    return (
        <Button onClick={click} className="speedControlManual">{ref.current?.display}</Button>
    );
}