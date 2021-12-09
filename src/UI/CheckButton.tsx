import { Note } from "../musicEngine/Note";

type Props<T> = {
    item: T;
    selected: boolean;
    setSelected: (selected: boolean) => void;
    getName: (v: T) => string;
}

/** check selector for Notes */
export function CheckButton<T>({ item, selected, setSelected, getName }: Props<T>) {

    return (
        <button type="button" className={`note-check btn btn-secondary btn-sm ${selected ? 'btn-selected' : ''}`}
            onClick={() => { setSelected(!selected); return true; }}>{getName(item)}</button>
    )
}