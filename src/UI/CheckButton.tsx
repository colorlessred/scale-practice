import {ToggleButton} from "react-bootstrap";

type Props<T> = {
    selected: boolean;
    setSelected: (selected: boolean) => void;
    name: string;
}

/** check selector for Notes */
export function CheckButton<T>({selected, setSelected, name}: Props<T>) {

    return (
        <ToggleButton
            className={"toggle"}
            value={name}
            variant="outline-primary"
            type="checkbox"
            size="sm" checked={selected}
            onClick={() => {
                setSelected(!selected);
                return true;
            }}>{name}</ToggleButton>
    );
}