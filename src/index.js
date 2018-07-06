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
    ipcMain.on(ipcEventRequest, async (evt, extensionEventName, requestData) => {
        const event = extensionManager.createEvent(extensionEventName);
        const requestResult = await event(requestData);
        evt.sender.send(ipcEventResponse, requestResult);
    });
}