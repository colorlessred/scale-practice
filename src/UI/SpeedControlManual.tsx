import Button from 'react-bootstrap/Button';

type Props = {
    step: number
    speed: number
    setSpeed: React.Dispatch<number>
}

export function SpeedControlManual({step, speed, setSpeed}: Props) {

    const click = function () {
        setSpeed(speed + step);
    };

    return (
        <Button onClick={click} className="speedControlManual">{(step > 0) ? '+' : "-"}</Button>
    );
}