import Form from 'react-bootstrap/Form';

type Props = {
    notesPerSet: number
    setNotesPerSet: (newValue: number) => void
}

export function NotePerSet({notesPerSet, setNotesPerSet}: Props) {
    return (<>
        <Form.Label htmlFor={"notesPerLabelSelect"}>Notes per Set</Form.Label>
        <Form.Select id={"notesPerLabelSelect"}
                     defaultValue={notesPerSet}
                     onChange={(e) => {
                         setNotesPerSet(parseInt(e.target.value));
                     }}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
        </Form.Select>
    </>);
}