import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: number;
            username: string;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: number;
            username: string;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

async function testAuthentication() {
    console.log('🚀 Starting JWT Authentication Tests\n');

    let accessToken = '';
    let refreshToken = '';
    let userId = 0;

    try {
        // Test 1: User Registration
        console.log('📝 Test 1: User Registration');
        const registerData = {
            username: 'testuser_' + Date.now(),
            email: `testuser_${Date.now()}@example.com`,
            password: 'password123',
        };

        const registerResponse = await axios.post<AuthResponse>(
            `${BASE_URL}/users/register`,
            registerData
        );

        if (registerResponse.data.success) {
            console.log('✅ Registration successful');
            console.log('   User:', registerResponse.data.data.user.username);
            console.log('   Email:', registerResponse.data.data.user.email);
            console.log('   Access Token:', registerResponse.data.data.accessToken.substring(0, 20) + '...');
            accessToken = registerResponse.data.data.accessToken;
            refreshToken = registerResponse.data.data.refreshToken;
            userId = registerResponse.data.data.user.id;
        } else {
            console.log('❌ Registration failed');
        }
        console.log('');

        // Test 2: User Login
        console.log('📝 Test 2: User Login');
        const loginResponse = await axios.post<LoginResponse>(
            `${BASE_URL}/auth/login`,
            {
                email: registerData.email,
                password: registerData.password,
            }
        );

        if (loginResponse.data.success) {
            console.log('✅ Login successful');
            console.log('   Access Token:', loginResponse.data.data.accessToken.substring(0, 20) + '...');
            accessToken = loginResponse.data.data.accessToken;
        } else {
            console.log('❌ Login failed');
        }
        console.log('');

        // Test 3: Access Protected Route with Valid Token
        console.log('📝 Test 3: Access Protected Route (with valid token)');
        const userResponse = await axios.get(
            `${BASE_URL}/users/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (userResponse.data.success) {
            console.log('✅ Protected route accessible with valid token');
            console.log('   User:', userResponse.data.data.username);
        } else {
            console.log('❌ Failed to access protected route');
        }
        console.log('');

        // Test 4: Access Protected Route without Token
        console.log('📝 Test 4: Access Protected Route (without token)');
        try {
            await axios.get(`${BASE_URL}/users/${userId}`);
            console.log('❌ Protected route should require authentication');
        } catch (error: any) {
            if (error.response?.status === 401) {
                console.log('✅ Protected route correctly requires authentication');
                console.log('   Status:', error.response.status);
                console.log('   Message:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        console.log('');

        // Test 5: Access Protected Route with Invalid Token
        console.log('📝 Test 5: Access Protected Route (with invalid token)');
        try {
            await axios.get(
                `${BASE_URL}/users/${userId}`,
                {
                    headers: {
                        Authorization: 'Bearer invalid-token-here',
                    },
                }
            );
            console.log('❌ Protected route should reject invalid tokens');
        } catch (error: any) {
            if (error.response?.status === 403) {
                console.log('✅ Protected route correctly rejects invalid token');
                console.log('   Status:', error.response.status);
                console.log('   Message:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        console.log('');

        // Test 6: Refresh Token
        console.log('📝 Test 6: Refresh Access Token');
        const refreshResponse = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {
                refreshToken: refreshToken,
            }
        );

        if (refreshResponse.data.success) {
            console.log('✅ Token refresh successful');
            console.log('   New Access Token:', refreshResponse.data.data.accessToken.substring(0, 20) + '...');
        } else {
            console.log('❌ Token refresh failed');
        }
        console.log('');

        // Test 7: Test Protected Category Route
        console.log('📝 Test 7: Test Protected Category Route');
        try {
            await axios.get(`${BASE_URL}/categories`);
            console.log('❌ Category route should require authentication');
        } catch (error: any) {
            if (error.response?.status === 401) {
                console.log('✅ Category route correctly requires authentication');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        console.log('');

        // Test 8: Logout
        console.log('📝 Test 8: User Logout');
        const logoutResponse = await axios.post(
            `${BASE_URL}/auth/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (logoutResponse.data.success) {
            console.log('✅ Logout successful');
            console.log('   Message:', logoutResponse.data.message);
        } else {
            console.log('❌ Logout failed');
        }
        console.log('');

        console.log('🎉 All tests completed!\n');
    } catch (error: any) {
        console.error('❌ Test failed with error:');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        } else {
            console.error('   Message:', error.message);
        }
    }
}

// Run tests
testAuthentication();
