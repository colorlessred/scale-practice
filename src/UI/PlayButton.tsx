import Button from 'react-bootstrap/Button';
import * as Tone from "tone";

type Props = {
    readonly isPlaying: boolean,
    readonly setPlaying: React.Dispatch<boolean>,
}

export function PlayButton({isPlaying, setPlaying}: Props) {
    const display = isPlaying ? "Stop" : "Play";

    const click = () => {
        setPlaying(!isPlaying);
    };

    return (
        <Button id="play-button" onClick={click}>{display}</Button>
    );
}
