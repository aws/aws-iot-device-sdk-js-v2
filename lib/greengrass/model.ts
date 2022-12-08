/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

/**
 * @packageDocumentation
 * @module greengrass
 */

import { isArray } from 'util';

/**
 * Describes a Greengrass core endpoint that a device can connect to
 *
 * API Documentation: https://docs.aws.amazon.com/greengrass/latest/developerguide/gg-discover-api.html
 *
 * @category Greengrass
 */
export class ConnectivityInfo {
    private constructor(
        /** Connectivity entry identifier */
        readonly id: string,
        /** Endpoint address */
        readonly host_address: string,
        /** Endpoint port */
        readonly port: number,
        /** Additional user-configurable metadata about the connectivity entry */
        readonly metadata?: any) {

    }

    /** @internal */
    static from_json(json: any) {
        return new ConnectivityInfo(
            json.Id,
            json.HostAddress,
            json.PortNumber,
            json.Metadata
        )
    }
}

/**
 * Describes a Greengrass Core
 *
 * API Documentation: https://docs.aws.amazon.com/greengrass/latest/developerguide/gg-discover-api.html
 *
 * @category Greengrass
 */
export class GGCore {
    private constructor(
        /** resource name of the IoT thing associated with a Greengrass core */
        readonly thing_arn: string,
        /** list of distinct ways to connect to the associated Greengrass core */
        readonly connectivity: ConnectivityInfo[]) {

    }

    /** @internal */
    static from_json(json: any) {
        const connectivity: ConnectivityInfo[] = [];
        if (json.Connectivity && isArray(json.Connectivity)) {
            json.Connectivity.forEach((payload: any) => {
                connectivity.push(ConnectivityInfo.from_json(payload));
            });
        }
        return new GGCore(
            json.thingArn,
            connectivity
        );
    }
}

/**
 * Describes a Greengrass group
 *
 * API Documentation: https://docs.aws.amazon.com/greengrass/latest/developerguide/gg-discover-api.html
 *
 * @category Greengrass
 */
export class GGGroup {
    private constructor(
        /** identifier for the Greengrass group */
        readonly gg_group_id: string,
         /** List of Greengrass cores associated with the group */
        readonly cores: GGCore[] = [],
        /** List of certificate authorities (in PEM format) associated with the Greengrass group */
        readonly certificate_authorities: string[] = []) {

    }

    /** @internal */
    static from_json(json: any) {
        const cores: GGCore[] = [];
        if (json.Cores && isArray(json.Cores)) {
            json.Cores.forEach((payload: any) => {
                cores.push(GGCore.from_json(payload));
            });
        }
        return new GGGroup(
            json.GGGroupId,
            cores,
            json.CAs
        )
    }
}

/**
 * Response returned from a {@link DiscoveryClient.discover} call
 *
 * API Documentation: https://docs.aws.amazon.com/greengrass/latest/developerguide/gg-discover-api.html
 *
 * @category Greengrass
 */
export class DiscoverResponse {
    private constructor(
        /** List of discovered Greengrass groups */
        readonly gg_groups: GGGroup[] = []) {
    }

    /** @internal */
    static from_json(json: any) {
        const groups: GGGroup[] = [];
        if (json.GGGroups && isArray(json.GGGroups)) {
            json.GGGroups.forEach((payload: any) => {
                groups.push(GGGroup.from_json(payload));
            });
        }
        return new DiscoverResponse(groups);
    }
}
