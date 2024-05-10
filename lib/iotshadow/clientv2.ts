
import {CrtError, mqtt, mqtt5, mqtt_request_response} from 'aws-crt';

import * as model from './model';
import {EventEmitter} from "events";
import {fromUtf8, toUtf8} from "@aws-sdk/util-utf8-browser";
import {v4 as uuid} from "uuid";

export function validateValueAsTopicSegment(value : any, propertyName?: string, type?: string) : void {
    if (value === undefined) {
        throw new CrtError("NYI");
    }

    if (typeof value !== 'string') {
        throw new CrtError("NYI");
    }

    if (value.includes("/") || value.includes("#") || value.includes("+")) {
        throw new CrtError("NYI");
    }
}

function normalizeGetNamedShadowRequest(value: model.GetNamedShadowRequest) : any {
    let normalizedValue : any = {};
    if (value.clientToken) {
        normalizedValue.clientToken = value.clientToken;
    }

    return normalizedValue;
}

function buildGetNamedShadowRequestPayload(request: any) : ArrayBuffer {
    let value = normalizeGetNamedShadowRequest(request as model.GetNamedShadowRequest);

    return fromUtf8(JSON.stringify(value));
}

function buildGetNamedShadowRequestSubscriptions(request: any) : Array<string> {
    let typedRequest: model.GetNamedShadowRequest = request;

    return new Array<string>(
        `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get/+`
    );
}

function deserializeGetShadowResponse(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function deserializeErrorResponse(payload: ArrayBuffer): any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function buildGetNamedShadowRequestResponsePaths(request: any) : Array<RequestResponsePath> {
    let typedRequest: model.GetNamedShadowRequest = request;

    return new Array<RequestResponsePath>(
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get/accepted`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeGetShadowResponse,
        },
        {
            topic: `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get/rejected`,
            correlationTokenJsonPath: "clientToken",
            deserializer: deserializeErrorResponse,
        },
    )
}

function buildGetNamedShadowRequestPublishTopic(request: any) : string {
    let typedRequest: model.GetNamedShadowRequest = request;

    return `$aws/things/${typedRequest.thingName}/shadow/name/${typedRequest.shadowName}/get`;
}

function applyCorrelationTokenToGetNamedShadowRequest(request: any) : [any, string | undefined] {
    let typedRequest: model.GetNamedShadowRequest = request;

    let correlationToken = uuid();

    typedRequest.clientToken = correlationToken;

    return [typedRequest, correlationToken];
}

function createRequestResponseOperationServiceModelMap() : Map<string, RequestResponseOperationModel> {
    return new Map<string, RequestResponseOperationModel>([
        ["getNamedShadow", {
            inputShapeName: "GetNamedShadowRequest",
            payloadTransformer: buildGetNamedShadowRequestPayload,
            subscriptionGenerator: buildGetNamedShadowRequestSubscriptions,
            responsePathGenerator: buildGetNamedShadowRequestResponsePaths,
            publishTopicGenerator: buildGetNamedShadowRequestPublishTopic,
            correlationTokenApplicator: applyCorrelationTokenToGetNamedShadowRequest,
        }],
    ]);
}

function buildNamedShadowDeltaUpdatedSubscriptionTopicFilter(config: any) : string {
    const typedConfig : model.NamedShadowDeltaUpdatedSubscriptionRequest = config;

    return `$aws/things/${typedConfig.thingName}/shadow/name/${typedConfig.shadowName}/update/delta`;
}

function deserializeNamedShadowDeltaUpdatedPayload(payload: ArrayBuffer) : any {
    const payload_text = toUtf8(new Uint8Array(payload));

    return JSON.parse(payload_text);
}

function createStreamingOperationServiceModelMap() : Map<string, StreamingOperationModel> {
    return new Map<string, StreamingOperationModel>([
        ["createNamedShadowDeltaUpdatedEventStream", {
            inputShapeName : "NamedShadowDeltaUpdatedSubscriptionRequest",
            subscriptionGenerator: buildNamedShadowDeltaUpdatedSubscriptionTopicFilter,
            deserializer: deserializeNamedShadowDeltaUpdatedPayload,
        }],
    ]);
}

function validateGetNamedShadowRequest(request: any) : void {
    let typedRequest : model.GetNamedShadowRequest = request;

    validateValueAsTopicSegment(typedRequest.thingName, "thingName", "GetNamedShadowRequest");
    validateValueAsTopicSegment(typedRequest.shadowName, "shadowName", "GetNamedShadowRequest");
}

function validateNamedShadowDeltaUpdatedSubscriptionRequest(request: any) : void {
    let typedRequest : model.NamedShadowDeltaUpdatedSubscriptionRequest = request;

    validateValueAsTopicSegment(typedRequest.thingName, "thingName", "NamedShadowDeltaUpdatedSubscriptionRequest");
    validateValueAsTopicSegment(typedRequest.shadowName, "shadowName", "NamedShadowDeltaUpdatedSubscriptionRequest");
}

function createValidatorMap() : Map<string, (value: any) => void> {
    return new Map<string, (value: any) => void>([
        ["GetNamedShadowRequest", validateGetNamedShadowRequest],
        ["NamedShadowDeltaUpdatedSubscriptionRequest", validateNamedShadowDeltaUpdatedSubscriptionRequest]
    ]);
}

function makeServiceModel() : RequestResponseServiceModel {
    let model : RequestResponseServiceModel = {
        requestResponseOperations: createRequestResponseOperationServiceModelMap(),
        streamingOperations: createStreamingOperationServiceModelMap(),
        shapeValidators: createValidatorMap()
    };

    return model;
}

export class IotShadowClientv2 {
    private rrClient : mqtt_request_response.RequestResponseClient;
    private serviceModel : RequestResponseServiceModel;

    private constructor(rrClient: mqtt_request_response.RequestResponseClient) {
        this.rrClient = rrClient;
        this.serviceModel = makeServiceModel();
    }

    static new_from_mqtt311(protocolClient: mqtt.MqttClientConnection, options: mqtt_request_response.RequestResponseClientOptions) : IotShadowClientv2 {
        let rrClient = mqtt_request_response.RequestResponseClient.newFromMqtt311(protocolClient, options);
        let client = new IotShadowClientv2(rrClient);

        return client;
    }

    static newFromMqtt5(protocolClient: mqtt5.Mqtt5Client, options: mqtt_request_response.RequestResponseClientOptions) : IotShadowClientv2 {
        let rrClient = mqtt_request_response.RequestResponseClient.newFromMqtt5(protocolClient, options);
        let client = new IotShadowClientv2(rrClient);

        return client;
    }

    close() {
        this.rrClient.close();
    }

    async getNamedShadow(request: model.GetNamedShadowRequest) : Promise<model.GetShadowResponse> {
        let rrConfig : RequestResponseOperationConfig = {
            operationName: "getNamedShadow",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            request: request
        };

        return await doRequestResponse<model.GetShadowResponse>(rrConfig);
    }

    createNamedShadowDeltaUpdatedStream(config: model.NamedShadowDeltaUpdatedSubscriptionRequest) : StreamingOperation<model.ShadowDeltaUpdatedEvent> {
        let streamingOperationConfig : StreamingOperationConfig = {
            operationName: "createNamedShadowDeltaUpdatedEventStream",
            serviceModel: this.serviceModel,
            client: this.rrClient,
            modelConfig: config,
        };

        return StreamingOperation.create(streamingOperationConfig);
    }
}





export interface StreamingOperationConfig {
    operationName: string,

    serviceModel: RequestResponseServiceModel,

    client: mqtt_request_response.RequestResponseClient,

    modelConfig: any,
}

export interface RequestResponseOperationConfig {
    operationName: string,

    serviceModel: RequestResponseServiceModel,

    client: mqtt_request_response.RequestResponseClient,

    request: any,
}

type ResponseDeserializer = (payload: ArrayBuffer) => any;

export interface RequestResponsePath {
    topic: string,

    correlationTokenJsonPath?: string,

    deserializer: ResponseDeserializer;
}

export interface RequestResponseOperationModel {
    inputShapeName: string;

    payloadTransformer: (request: any) => ArrayBuffer;

    subscriptionGenerator: (request: any) => Array<string>;

    responsePathGenerator: (request: any) => Array<RequestResponsePath>;

    publishTopicGenerator: (request: any) => string;

    correlationTokenApplicator: (request: any) => [any, string | undefined];
}

export interface StreamingOperationModel {
    inputShapeName: string;

    subscriptionGenerator: (config: any) => string;

    deserializer: (payload: ArrayBuffer) => any;
}

export interface RequestResponseServiceModel {

    // operation name -> operation model
    requestResponseOperations: Map<string, RequestResponseOperationModel>,

    // operation name -> operation model
    streamingOperations: Map<string, StreamingOperationModel>,

    // shape name -> validator function
    shapeValidators: Map<string, (value: any) => void>;
}

// validate request

// map request to serializable payload object

// serialize payload to buffer

// map request to response path set and other options

// await submit request

// deserialize response appropriately

function buildResponseDeserializerMap(paths: Array<RequestResponsePath>) : Map<string, ResponseDeserializer> {
    return new Map<string, ResponseDeserializer>(
        paths.map((path) => {
            return [path.topic, path.deserializer];
        })
    );
}

function buildResponsePaths(paths: Array<RequestResponsePath>) : Array<mqtt_request_response.ResponsePath> {
    return paths.map((path) => {
        return {
            topic: path.topic,
            correlationTokenJsonPath: path.correlationTokenJsonPath,
        };
    });
}

async function doRequestResponse<ResponseType>(options: RequestResponseOperationConfig) : Promise<ResponseType> {
    let operationModel = options.serviceModel.requestResponseOperations.get(options.operationName);
    if (!operationModel) {
        throw new CrtError("NYI");
    }

    let validator = options.serviceModel.shapeValidators.get(operationModel.inputShapeName);
    if (!validator) {
        throw new CrtError("NYI");
    }

    validator(options.request);

    let publishTopic = operationModel.publishTopicGenerator(options.request);
    let subscriptionsNeeded = operationModel.subscriptionGenerator(options.request);
    let modelPaths = operationModel.responsePathGenerator(options.request);
    let deserializerMap = buildResponseDeserializerMap(modelPaths);
    let responsePaths = buildResponsePaths(modelPaths);

    let [request, correlationToken] = operationModel.correlationTokenApplicator(options.request);

    let payload = operationModel.payloadTransformer(request);

    let requestOptions : mqtt_request_response.RequestResponseOperationOptions = {
        subscriptionTopicFilters : subscriptionsNeeded,
        responsePaths: responsePaths,
        publishTopic: publishTopic,
        payload: payload,
        correlationToken: correlationToken
    };

    let response = await options.client.submitRequest(requestOptions);

    let responseTopic = response.topic;
    let responsePayload = response.payload;

    let deserializer = deserializerMap.get(responseTopic);
    if (!deserializer) {
        throw new CrtError("NYI");
    }

    return deserializer(responsePayload) as ResponseType;
}


export class StreamingOperation<EventType> extends EventEmitter {
    private operation: mqtt_request_response.StreamingOperationBase;

    private constructor(config: StreamingOperationConfig) {
        super();

        // validate
        let streamingOperationModel = config.serviceModel.streamingOperations.get(config.operationName);
        if (!streamingOperationModel) {
            throw new CrtError("NYI");
        }

        let validator = config.serviceModel.shapeValidators.get(streamingOperationModel.inputShapeName);
        if (!validator) {
            throw new CrtError("NYI");
        }

        validator(config.modelConfig);

        let streamOptions : mqtt_request_response.StreamingOperationOptions = {
            subscriptionTopicFilter: streamingOperationModel.subscriptionGenerator(config.modelConfig),
        };

        // create native operation
        this.operation = config.client.createStream(streamOptions);
    }

    static create<EventType>(config: StreamingOperationConfig) : StreamingOperation<EventType> {
        let operation = new StreamingOperation<EventType>(config);

        return operation;
    }

    open() {
        this.operation.open();
    }

    close() {
        this.operation.close();
    }
}



