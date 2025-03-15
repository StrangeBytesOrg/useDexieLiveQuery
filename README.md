# useDexieLiveQuery
[Dexie](https://dexie.org) integration for Vue 3

### Install
```shell
npm install @strangebytes/vue-dexie-live-query
```

## Examples

```typescript
import {useDexieLiveQuery} from '@strangebytes/vue-dexie-live-query'


const allTodos = await useDexieLiveQuery(() => db.todos.toArray())

```

## Acknowledgement
Based on implementation from [devweissmikhail](https://github.com/devweissmikhail/useDexieLiveQuery)
Modified to enable async initial load
