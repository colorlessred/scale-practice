import React from "react";
import Button from 'react-bootstrap/Button';

type Props = {
    isPlaying: () => boolean,
    setPlaying: (newValue: boolean) => void,
}

export function PlayButton({ isPlaying, setPlaying }: Props) {
    const display = isPlaying() ? "Stop" : "Play";

    const click = () => { setPlaying(!isPlaying()) };

    return (
        <Button id="play-button" onClick={click}> {display}</Button >
    )
}
