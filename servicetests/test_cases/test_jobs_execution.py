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
        description="Run Jobs test in CI")
    argument_parser.add_argument(
        "--input-uuid", required=False, help="UUID for thing name. UUID will be generated if this option is omit")
    argument_parser.add_argument(
        "--region", required=False, default="us-east-1", help="The name of the region to use")
    argument_parser.add_argument(
        "--mqtt-version", required=True, choices=[3, 5], type=int, help="MQTT protocol version to use")
    parsed_commands = argument_parser.parse_args()

    try:
        iot_client = boto3.client('iot', region_name=parsed_commands.region)
        secrets_client = boto3.client("secretsmanager", region_name=parsed_commands.region)
    except Exception as e:
        print(f"ERROR: Could not make Boto3 iot-data client. Credentials likely could not be sourced. Exception: {e}",
              file=sys.stderr)
        return -1

    current_path = os.path.dirname(os.path.realpath(__file__))
    cfg_file_mqtt_version = "mqtt3_" if parsed_commands.mqtt_version == 3 else "mqtt5_"
    cfg_file = os.path.join(current_path, cfg_file_mqtt_version + "jobs_cfg.json")
    input_uuid = parsed_commands.input_uuid if parsed_commands.input_uuid else str(uuid.uuid4())

    thing_name = "ServiceTest_Jobs_" + input_uuid
    policy_name = secrets_client.get_secret_value(
        SecretId="ci/JobsServiceClientTest/policy_name")["SecretString"]

    # Temporary certificate/key file path.
    certificate_path = os.path.join(os.getcwd(), "./aws-iot-device-sdk-js-v2/servicetests/tests/jobs_execution/certificate.pem.crt")
    key_path = os.path.join(os.getcwd(), "./aws-iot-device-sdk-js-v2/servicetests/tests/jobs_execution/private.pem.key")

    try:
        ci_iot_thing.create_iot_thing(
            thing_name=thing_name,
            thing_group="CI_ServiceClient_Thing_Group",
            region=parsed_commands.region,
            policy_name=policy_name,
            certificate_path=certificate_path,
            key_path=key_path)
    except Exception as e:
        print(f"ERROR: Failed to create IoT thing: {e}")
        sys.exit(-1)

    # Perform Jobs test. If it's successful, the Job execution should be marked as SUCCEEDED for the thing.
    test_result = run_in_ci.setup_and_launch(cfg_file, input_uuid)

    # Test reported success, verify that Job was indeed executed by the thing.
    if test_result == 0:
        print("Verifying that Job was executed")
        try:
            job_id = secrets_client.get_secret_value(SecretId="ci/JobsServiceClientTest/job_id")["SecretString"]
            thing_job = iot_client.describe_job_execution(jobId=job_id, thingName=thing_name)
            job_status = thing_job.get('execution', {}).get('status', {})
            if job_status != 'SUCCEEDED':
                print(f"ERROR: Could not verify Job execution; Job info: {thing_job}")
                test_result = -1
        except Exception as e:
            print(f"ERROR: Could not verify Job execution: {e}")
            test_result = -1

    if test_result == 0:
        print("Test succeeded")

    # Delete a thing created for this test run.
    # NOTE We want to try to delete thing even if test was unsuccessful.
    delete_result = ci_iot_thing.delete_iot_thing(
        thing_name, parsed_commands.region)

    # Fail the test if unable to delete thing, so this won't remain unnoticed.
    if test_result != 0 or delete_result != 0:
        sys.exit(-1)


if __name__ == "__main__":
    main()
