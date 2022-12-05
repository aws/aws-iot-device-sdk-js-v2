/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * This file is generated
 */

import { mqtt, mqtt5, CrtError } from 'aws-crt';

export interface IServiceClientMqttAdapter {

    publish(topic: string, payload: mqtt.Payload, qos: mqtt.QoS) : Promise<mqtt.MqttRequest>;

    subscribe(topic: string, qos: mqtt.QoS, on_message: mqtt.OnMessageCallback) : Promise<mqtt.MqttSubscribeRequest>;
}

export class ServiceClientMqtt311Adapter implements IServiceClientMqttAdapter {

    constructor(private connection: mqtt.MqttClientConnection) {
    }

    public async publish(topic: string, payload: mqtt.Payload, qos: mqtt.QoS) : Promise<mqtt.MqttRequest> {
        return this.connection.publish(topic, payload, qos);
    }

    public async subscribe(topic: string, qos: mqtt.QoS, on_message: mqtt.OnMessageCallback) : Promise<mqtt.MqttSubscribeRequest> {
        return this.connection.subscribe(topic, qos, on_message);
    }
}

export class ServiceClientMqtt5Adapter implements IServiceClientMqttAdapter {

    subscriptionHandlers: Map<string, mqtt.OnMessageCallback>;

    private onMessageReceivedHandler(eventData: mqtt5.MessageReceivedEvent) : void {
        let publish : mqtt5.PublishPacket = eventData.message;
        let topic: string = publish.topicName;
        let handler : mqtt.OnMessageCallback | undefined = this.subscriptionHandlers.get(topic);
        if (handler) {
            /* The payload field of a PublishPacket is always an ArrayBuffer */
            handler(topic, publish.payload as ArrayBuffer, false, publish.qos, publish.retain ?? false);
        }
    }

    constructor(private client: mqtt5.Mqtt5Client) {
        this.subscriptionHandlers = new Map<string, mqtt.OnMessageCallback>();

        client.on('messageReceived', this.onMessageReceivedHandler.bind(this));
    }

    public async publish(topic: string, payload: mqtt.Payload, qos: mqtt.QoS) : Promise<mqtt.MqttRequest> {
        return new Promise<mqtt.MqttRequest>(async (resolve, reject) => {

            try {
                let result: mqtt5.PublishCompletionResult = await this.client.publish({
                    topicName: topic,
                    payload: payload,
                    qos: (qos as number) as mqtt5.QoS
                });

                if (result === undefined) {
                    if (qos == mqtt.QoS.AtMostOnce) {
                        resolve({});
                    } else {
                        reject("Publish failed due to internal error");
                    }
                    return;
                }

                let puback: mqtt5.PubackPacket = result;
                if (mqtt5.isSuccessfulPubackReasonCode(puback.reasonCode)) {
                    resolve({});
                } else {
                    reject(new CrtError("Publish failed with reason code: " + puback.reasonCode));
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    public async subscribe(topic: string, qos: mqtt.QoS, on_message: mqtt.OnMessageCallback) : Promise<mqtt.MqttSubscribeRequest> {
        return new Promise<mqtt.MqttSubscribeRequest>(async (resolve, reject) => {

            try {
                this.subscriptionHandlers.set(topic, on_message);
                let result: mqtt5.SubackPacket = await this.client.subscribe({
                    subscriptions: [{topicFilter: topic, qos: (qos as number) as mqtt5.QoS}]
                });

                let reasonCode: mqtt5.SubackReasonCode = result.reasonCodes[0];
                if (mqtt5.isSuccessfulSubackReasonCode(reasonCode)) {
                    resolve({
                        topic: topic,
                        qos: qos
                    });
                } else {
                    throw new CrtError("Subscribe failed with reason code: " + reasonCode);
                }
            } catch (e) {
                this.subscriptionHandlers.delete(topic);
                reject(e);
            }
        });
    }
}