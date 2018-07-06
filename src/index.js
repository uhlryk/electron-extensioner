import { ipcRenderer, ipcMain } from "electron";
const ipcEventRequest = Symbol("IPC_EVENT_REQUEST");
const ipcEventResponse = Symbol("IPC_EVENT_RESPONSE");
export function callEvent(extensionEventName, requestData) {
    return new Promise(resolve => {
        ipcRenderer.send(ipcEventRequest, extensionEventName, requestData);
        ipcRenderer.once(ipcEventResponse, (evt, responseData) => {
            resolve(responseData);
        });
    });
}

export function handleEvent(extensionManager) {
    ipcMain.on(ipcEventRequest, (evt, extensionEventName, requestData) => {
        const event = extensionManager.createEvent(extensionEventName);
        event(requestData).then(requestResult => evt.sender.send(ipcEventResponse, requestResult));
    });
}
