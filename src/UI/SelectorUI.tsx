import { CheckButton } from "./CheckButton";

type Props<T> = {
    name: string;
    allValues: Array<T>;
    selectedValues: Set<T>;
    setSelectedValues: React.Dispatch<Set<T>>;
    getName: (v: T) => string;
}

/**
 * select multiple values
 */
export function SelectorUI<T>({ name, allValues, selectedValues, setSelectedValues, getName }: Props<T>) {
    return (<>
        <label htmlFor="roots" className="col-form-label">{name}</label>
        <div className="form-group" id="roots">
            {
                // TODO find best practices to test logic inside jsx/tsx pages
                allValues.map((value) => {
                    const noteSelected = () => {
                        const newSelectedValues = new Set(selectedValues);
                        if (newSelectedValues.has(value)) {
                            newSelectedValues.delete(value);
                        } else {
                            newSelectedValues.add(value);
                        }
                        setSelectedValues(newSelectedValues);
                    }

                    return (
                        <CheckButton key={`${value}`} item={value} selected={selectedValues.has(value)} setSelected={noteSelected} getName={getName} />
                    )
                })
            }
        </div>
    </>)
}
