# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0.

import argparse
import json
import os
import sys
import uuid

import boto3

import run_in_ci
import ci_iot_thing


def main():
    argument_parser = argparse.ArgumentParser(
        description="Run Shadow test in CI")
    argument_parser.add_argument(
        "--input-uuid", required=False, help="UUID for thing name. UUID will be generated if this option is omit")
    argument_parser.add_argument(
        "--region", required=False, default="us-east-1", help="The name of the region to use")
    argument_parser.add_argument(
        "--mqtt-version", required=True, choices=[3, 5], type=int, help="MQTT protocol version to use")
    argument_parser.add_argument(
        "--use-named-shadow", required=False, default=False, action='store_true', help="Use named shadow")
    parsed_commands = argument_parser.parse_args()

    try:
        iot_data_client = boto3.client('iot-data', region_name=parsed_commands.region)
        secrets_client = boto3.client("secretsmanager", region_name=parsed_commands.region)
    except Exception as e:
        print(f"ERROR: Could not make Boto3 iot-data client. Credentials likely could not be sourced. Exception: {e}",
              file=sys.stderr)
        return -1

    current_path = os.path.dirname(os.path.realpath(__file__))
    cfg_file_mqtt_version = "mqtt3_" if parsed_commands.mqtt_version == 3 else "mqtt5_"
    cfg_file_shadow_type = "named_" if parsed_commands.use_named_shadow else "";
    cfg_file = os.path.join(current_path, cfg_file_mqtt_version + cfg_file_shadow_type + "shadow_cfg.json")
    input_uuid = parsed_commands.input_uuid if parsed_commands.input_uuid else str(uuid.uuid4())

    thing_name = "ServiceTest_Shadow_" + input_uuid
    policy_name = secrets_client.get_secret_value(
        SecretId="ci/ShadowServiceClientTest/policy_name")["SecretString"]

    # Temporary certificate/key file path.
    certificate_path = os.path.join(os.getcwd(), "certificate.pem.crt")
    key_path = os.path.join(os.getcwd(), "private.pem.key")

    try:
        ci_iot_thing.create_iot_thing(
            thing_name=thing_name,
            region=parsed_commands.region,
            policy_name=policy_name,
            certificate_path=certificate_path,
            key_path=key_path)
    except Exception as e:
        print(f"ERROR: Failed to create IoT thing: {e}")
        sys.exit(-1)

    # Perform Shadow test. If it's successful, a shadow should appear for a specified thing.
    test_result = run_in_ci.setup_and_launch(cfg_file, input_uuid)

    # Test reported success, verify that shadow was indeed updated.
    if test_result == 0:
        print("Verifying that shadow was updated")
        color_value = None
        try:
            if parsed_commands.use_named_shadow:
                thing_shadow = iot_data_client.get_thing_shadow(thingName=thing_name, shadowName='testShadow')
            else:
                thing_shadow = iot_data_client.get_thing_shadow(thingName=thing_name)

            payload = thing_shadow['payload'].read()
            data = json.loads(payload)
            color_value = data.get('state', {}).get('reported', {}).get('color', None)
            if color_value != 'on':
                print(f"ERROR: Could not verify thing shadow: color is not set; shadow info: {data}")
                test_result = -1
        except KeyError as e:
            print(f"ERROR: Could not verify thing shadow: key {e} does not exist in shadow response: {thing_shadow}")
            test_result = -1
        except Exception as e:
            print(f"ERROR: Could not verify thing shadow: {e}")
            test_result = -1

    if test_result == 0:
        print("Test succeeded")

    # Delete a thing created for this test run.
    # NOTE We want to try to delete thing even if test was unsuccessful.
    try:
        ci_iot_thing.delete_iot_thing(thing_name, parsed_commands.region)
    except Exception as e:
        print(f"ERROR: Failed to delete thing: {e}")
        test_result = -1

    # Fail the test if unable to delete thing, so this won't remain unnoticed.
    if test_result != 0:
        sys.exit(-1)


if __name__ == "__main__":
    main()
