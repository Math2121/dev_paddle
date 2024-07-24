export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum API_URL_CONSULT {
    GET_CUSTOMER = 'customers/',
    SUBSCRIPTION_ROUTE = 'subscriptions/',
    PRICE_ROUTE = "prices/",
    TRANSACTIONS = 'transactions'
}

export enum SUBSCRIPTION_LOWER_OR_HIGHER{
    LOWER = 'lower',
    HIGHER = 'higher'
}

export enum OPTIONS_EVENTS {
    CREATE_CUSTOMER = 'create_customer',
    CREATE_SUBSCRIPTION = 'create_subscription',
    CREATE_PRICE = 'create_price',
    CREATE_PRODUCT = 'create_product',
    PAUSE_RENOVATION = 'pause_renovation',
    CHANGE_PLAN = 'change_plan',
    CHANGE_PRICE = 'change_price',
    CHANGE_PRODUCT = 'change_product',
    RESUME_RENOVATION ='resume_renovation',
    GET_CUSTOMER = 'get_customer'
}