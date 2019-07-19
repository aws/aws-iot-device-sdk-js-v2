/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

import { mqtt } from "aws-iot-device-sdk-js-v2";

let config = mqtt.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
    .with_clean_session(true)
    .with_client_id('pub_sub_sample')
    .with_endpoint('a16523t7iy5uyg-ats.iot.us-east-1.amazonaws.com')
    .with_use_websockets()
    .build();

const client = new mqtt.Client(null);
const connection = client.new_connection(config);
connection.connect();
