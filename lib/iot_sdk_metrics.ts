    /*
    * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
    * SPDX-License-Identifier: Apache-2.0.
    */

    /**
     * Private IoT SDK metrics module.
     *
     * Provides SDK-level metadata (version info) to pass to the CRT layer.
     * The CRT handles all feature detection (certificate source, TLS settings, etc.)
     * and embeds the combined metrics in the MQTT CONNECT packet username field.
     *
     * @internal
     */

    import { AwsIoTDeviceSDKMetrics } from "aws-crt/dist/common/mqtt_shared";

    /** SDK library name identifier used in the metrics payload. @internal */
    const SDK_LIBRARY_NAME = "IoTDeviceSDK/JS";

    /**
     * The current version of the IoT SDK metrics format.
     * This must match the version expected by the CRT layer.
     * Bumping this value should be done in lockstep with CRT changes.
     * @internal
     */
    const IOT_SDK_METRICS_VERSION = "1";

    /**
     * Returns the installed SDK package version string.
     *
     * Falls back to "dev" if the package metadata is unavailable (e.g., when
     * running from a source checkout without installing).
     *
     * @returns A version string like "1.27.0" or "dev".
     *
     * @internal
     */
    function get_sdk_version(): string {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const pkg = require("../package.json");
            return pkg.version ?? "dev";
        } catch {
            return "dev";
        }
    }

    /**
     * Builds the SDK-level {@link AwsIoTDeviceSDKMetrics} payload that is passed
     * down to the CRT layer.
     *
     * The returned object carries SDK identity and the metrics format version
     * via two metadata entries:
     *
     * - `IoTSDKVersion`: the installed SDK package version, used to identify the
     *   SDK release on the server side.
     * - `IoTSDKMetricsVersion`: the metrics format version this SDK supports.
     *   The CRT only merges SDK-supplied features when this value matches the
     *   version it expects.
     *
     * The CRT layer is responsible for detecting connection-level features
     * (protocol version, certificate source, TLS settings, proxy type, etc.)
     * and appending them to the metadata before embedding the result in the
     * MQTT CONNECT packet username field.
     *
     * @returns A populated metrics object ready to attach to an MQTT5 client
     *          or MQTT3 connection configuration.
     *
     * @internal
     */
    export function build_sdk_metrics(): AwsIoTDeviceSDKMetrics {
        const metrics = new AwsIoTDeviceSDKMetrics();
        metrics.libraryName = SDK_LIBRARY_NAME;
        metrics.metadata = [
            ["IoTSDKVersion", get_sdk_version()],
            ["IoTSDKMetricsVersion", IOT_SDK_METRICS_VERSION],
        ];
        return metrics;
    }
