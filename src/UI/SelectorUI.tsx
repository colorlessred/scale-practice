import { useEffect, useState } from "react";
import { CheckButton } from "./CheckButton";

type Props<T> = {
    readonly name: string
    readonly allValues: Array<T>
    readonly selectedValues: Set<T>
    readonly setSelectedValues: React.Dispatch<Set<T>>
    readonly getName: (v: T) => string
}

/**
 * select multiple values
 */
export function SelectorUI<T>({ name, allValues, selectedValues, setSelectedValues, getName }: Props<T>) {
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!selectedValues || selectedValues.size === 0) {
            setError(`No item selected`);
        } else {
            setError('');
        }
    }, [error, setError, selectedValues]);

    return (<>
        <label htmlFor="roots" className="col-form-label">{name}</label>
        <div className="form-group" id="roots">
            {
                allValues.map((value) => {
                    const handler = () => {
                        const newSelectedValues = new Set(selectedValues);
                        if (newSelectedValues.has(value)) {
                            newSelectedValues.delete(value);
                        } else {
                            newSelectedValues.add(value);
                        }
                        setSelectedValues(newSelectedValues);
                    }

                    return (
                        <CheckButton
                            key={`${value}`} item={value}
                            selected={selectedValues.has(value)}
                            setSelected={handler}
                            getName={getName} />
                    )
                })
            }
        </div>
        <div>{error}</div>
    </>)
}
