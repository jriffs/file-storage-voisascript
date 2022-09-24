import { EventEmitter } from "events";

export const Events = new EventEmitter()

Events.on('upload-event-sucess', (target) => {
    if (typeof target !== 'function') {
        throw new Error('target parameter must be a function')
    }
    target()
})


// Events.emit('upload-event', somn, 'this is it')