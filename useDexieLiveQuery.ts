import {liveQuery, type Subscription} from 'dexie'
import {shallowRef, getCurrentScope, onScopeDispose, type ShallowRef} from 'vue'

type UseDexieLiveQueryOptions = {
    onError?: (error: Error | unknown) => void
}

function tryOnScopeDispose(fn: () => void) {
    if (getCurrentScope()) onScopeDispose(fn)
}

export async function useDexieLiveQuery<T>(
    querier: () => T | Promise<T>,
    options: UseDexieLiveQueryOptions = {},
): Promise<ShallowRef<T>> {
    const {onError} = options

    let initialData: T
    try {
        initialData = await querier()
    } catch (error) {
        onError?.(error)
        throw error
    }

    const value = shallowRef<T>(initialData)
    let subscription: Subscription | undefined = undefined

    const start = () => {
        subscription?.unsubscribe()

        const observable = liveQuery(querier)

        subscription = observable.subscribe({
            next: (result) => {
                value.value = result
            },
            error: (error) => {
                onError?.(error)
            },
        })
    }

    const cleanup = () => {
        subscription?.unsubscribe()
        // Set to undefined to avoid calling unsubscribe multiple times on a same subscription
        subscription = undefined
    }

    start()
    tryOnScopeDispose(cleanup)

    return value
}
