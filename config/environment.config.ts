interface EnvironmentConfig {
    baseUrl: string;
    auth: {
        username?: string;
        password?: string;
        token?: string;
    };
    timeouts: {
        defaultTimeout: number;
        apiTimeout: number;
    };
}

const environments: { [key: string]: EnvironmentConfig } = {
    development: {
        baseUrl: 'https://rzbtomt01.at.rzb.rbg.cc/cantest',
        auth: {
            username: process.env.DEV_USERNAME,
            password: process.env.DEV_PASSWORD
        },
        timeouts: {
            defaultTimeout: 30000,
            apiTimeout: 10000
        }
    },
    test: {
        baseUrl: 'https://test-api.example.com',
        auth: {
            username: process.env.TEST_USERNAME,
            password: process.env.TEST_PASSWORD
        },
        timeouts: {
            defaultTimeout: 30000,
            apiTimeout: 10000
        }
    },
    production: {
        baseUrl: 'https://api.example.com',
        auth: {
            token: process.env.PROD_TOKEN
        },
        timeouts: {
            defaultTimeout: 30000,
            apiTimeout: 10000
        }
    }
};

export const getConfig = (env: string = process.env.TEST_ENV || 'development'): EnvironmentConfig => {
    const config = environments[env];
    if (!config) {
        throw new Error(`Environment ${env} not found`);
    }
    return config;
};
