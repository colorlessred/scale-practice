# Model

```mermaid
flowchart LR

    noteSetsQueue --> noteSetProvider
    noteProviderProvider --> noteSetsQueue & noteRange
    changeProvider --> noteProviderProvider & notesPerSet
    proxy --> changeProvider & noteSetsQueue 
    
```