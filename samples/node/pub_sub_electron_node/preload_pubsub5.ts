
/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

import { contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld(
    'electron',
    {
      Mqtt5MtlsStart: () => ipcRenderer.invoke('PubSub5MtlsStart'),
      Mqtt5WebsocketsStart: () => ipcRenderer.invoke('PubSub5WebsocketsStart'),
      Mqtt5Stop: () => ipcRenderer.invoke('PubSub5Stop'),
      Mqtt5PublishQoS1: () => ipcRenderer.invoke('PublishTestMessage')
    }
  )


function log (msg : string){
    console.log(msg);
    let consoleDiv = document.getElementById("console") as HTMLInputElement;
    let div = document.createElement('div')
    div.innerHTML = msg;
    consoleDiv?.appendChild(div);
}

ipcRenderer.on('log', (event, args) => {
    log(args)
})