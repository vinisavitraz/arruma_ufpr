export enum HttpOperationErrorCodes {
    INVALID_TOKEN_AUTH = 'AUTH_001',
    WRONG_PASSWORD = 'AUTH_002',
    INVALID_ROLE = 'AUTH_003',
    INVALID_AUTHENTICATED_USER = 'AUTH_004',
    USER_WITHOUT_PERMISSIONS = 'AUTH_005',
    TOKEN_NOT_FOUND = 'AUTH_006',
    USER_WITHOUT_ROLE = 'AUTH_007',
    USER_WITHOUT_PERMISSION = 'AUTH_008',
    TOKEN_NOT_MATCH = 'AUTH_009',
    USER_NOT_AUTHENTICATED = 'AUTH_010',
    USER_NOT_FOUND = 'USR_001',
    INVALID_USER_NAME = 'USR_002',
    INVALID_USER_EMAIL = 'USR_003',
    INVALID_USER_ROLE = 'USR_004',
    INVALID_USER_ID = 'USR_005',
    INVALID_USER_PASSWORD = 'USR_006',
    PASSWORDS_DO_NOT_MATCH = 'USR_007',
    INVALID_USER_DOCUMENT = 'USR_008',
    INVALID_USER_PHONE = 'USR_009',
    INVALID_USER_ADDRESS = 'USR_010',
    DUPLICATED_USER_EMAIL = 'USR_011',
    DUPLICATED_USER_DOCUMENT = 'USR_012',
    BLOCKED_USER_EMAIL = 'USR_013',
    BLOCKED_USER_DOCUMENT = 'USR_014',
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
    INCIDENT_NOT_VISIBLE = 'INC_018',
    INVALID_ASSIGNED_USER_ROLE_INCIDENT = 'INC_019',
    INVALID_INCIDENT_RATING = 'INC_020',
    INVALID_INCIDENT_ID = 'INC_021',
    INVALID_INCIDENT_PRIORITY = 'INC_022',
    INVALID_INCIDENT_FILEMETADATA = 'INC_023',
    INVALID_REOPEN_INCIDENT = 'INC_024',
    INVALID_ITEM_NAME = 'ITM_001',
    INVALID_ITEM_DESCRIPTION = 'ITM_002',
    INVALID_ITEM_LOCATION = 'ITM_003',
    ITEM_NOT_FOUND = 'ITM_004',
    INVALID_ITEM_ID = 'ITM_005',
    FILE_METADATA_NOT_FOUND = 'FM_001',
    FILE_NOT_FOUND_ON_PATH = 'FM_002',
}