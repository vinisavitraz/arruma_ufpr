export enum HttpOperationErrorCodes {
    INVALID_TOKEN_AUTH = 'AUTH_001',
    WRONG_PASSWORD = 'AUTH_002',
    INVALID_ROLE = 'AUTH_003',
    INVALID_AUTHENTICATED_USER = 'AUTH_004',
    USER_WITHOUT_PERMISSIONS = 'AUTH_005',
    TOKEN_NOT_FOUND = 'AUTH_006',
    USER_WITHOUT_ROLE = 'AUTH_007',
    USER_WITHOUT_PERMISSION = 'AUTH_008',
    USER_NOT_FOUND = 'USR_001',
    LOCATION_NOT_FOUND = 'LOC_001',
    INVALID_LOCATION_NAME = 'LOC_002',
    INVALID_LOCATION_DESCRIPTION = 'LOC_003',
    INVALID_INCIDENT_TYPE_NAME = 'INC_001',
    INVALID_INCIDENT_TYPE_DESCRIPTION = 'INC_002',
    INCIDENT_TYPE_NOT_FOUND = 'INC_003',
    INVALID_INCIDENT_TYPE_ID = 'INC_004',
    INVALID_INCIDENT_TITLE = 'INC_005',
    INVALID_INCIDENT_DESCRIPTION = 'INC_006',
    INVALID_INCIDENT_START_DATE = 'INC_007',
    INVALID_INCIDENT_TYPE = 'INC_008',
    INVALID_INCIDENT_LOCATION = 'INC_009',
    INVALID_INCIDENT_ITEM = 'INC_010',
    INCIDENT_NOT_FOUND = 'INC_011',
    INVALID_INCIDENT_USER = 'INC_012',
    INVALID_INCIDENT_INTERACTION_DESCRIPTION = 'INC_013',
    INVALID_INCIDENT_INTERACTION_USER = 'INC_014',
    INVALID_INCIDENT_INTERACTION_ORIGIN = 'INC_015',
    INVALID_INCIDENT_INTERACTION_INCIDENT = 'INC_016',
    INVALID_ASSIGNED_ADMIN_CLOSE_INCIDENT = 'INC_017',
    INVALID_ITEM_NAME = 'ITM_001',
    INVALID_ITEM_DESCRIPTION = 'ITM_002',
    INVALID_ITEM_LOCATION = 'ITM_003',
    ITEM_NOT_FOUND = 'ITM_004',
    INVALID_ITEM_ID = 'ITM_005',
}