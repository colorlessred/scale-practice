import Button from 'react-bootstrap/Button';

type Props = {
    isPlaying: boolean,
    setPlaying: React.Dispatch<boolean>,
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
