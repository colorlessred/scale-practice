
type Props<T> = {
    readonly item: T;
    readonly selected: boolean;
    readonly setSelected: (selected: boolean) => void;
    readonly getName: (v: T) => string;
}

/** check selector for Notes */
export function CheckButton<T>({ item, selected, setSelected, getName }: Props<T>) {

    return (
        <button type="button" className={`note-check btn btn-secondary btn-sm ${selected ? 'btn-selected' : ''}`}
            onClick={() => { setSelected(!selected); return true; }}>{getName(item)}</button>
    )
}