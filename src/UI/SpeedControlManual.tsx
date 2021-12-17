import { useRef } from "react";
import Button from 'react-bootstrap/Button';

type Props = {
    readonly step: number
    readonly speed: number
    readonly setSpeed: React.Dispatch<number>
}

export function SpeedControlManual({ step, speed, setSpeed }: Props) {
    const ref = useRef<{ display: string }>({ display: (step > 0) ? '+' : "-" });

    const click = function () {
        setSpeed(speed + step)
    };

    return (
        <Button onClick={click} className="speedControlManual">{ref.current?.display}</Button>
    );
}