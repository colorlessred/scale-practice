import React, {useEffect, useState} from "react";
import {CheckButton} from "./CheckButton";
import Button from "react-bootstrap/Button";

type Props<T> = {
    name: string
    allValues: Array<T>
    selectedValues: Set<T>
    setSelectedValues: React.Dispatch<Set<T>>
    getName: (v: T) => string
}

/**
 * select multiple values
 */
export function SelectorUI<T>({name, allValues, selectedValues, setSelectedValues, getName}: Props<T>) {
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
                        if (newSelectedValues.size > 0) {
                            // there must be at least one value to avoid breaking the
                            // "select next" logic
                            setSelectedValues(newSelectedValues);
                        }
                    };

                    return (
                        <CheckButton
                            key={`${value}`}
                            selected={selectedValues.has(value)}
                            setSelected={handler}
                            name={getName(value)}/>
                    );
                })
                // <CheckButton />
            }
            <Button variant="light" size="sm" onClick={() => {
                const newSelectedValues = new Set(selectedValues);
                newSelectedValues.clear();
                const firstValue = selectedValues.values().next().value;
                newSelectedValues.add(firstValue);
                setSelectedValues(newSelectedValues);
            }}>first</Button>
            <Button variant="light" size="sm" onClick={() => {
                setSelectedValues(new Set(allValues));
            }}>all</Button>
        </div>
        <div>{error}</div>
    </>);
}
