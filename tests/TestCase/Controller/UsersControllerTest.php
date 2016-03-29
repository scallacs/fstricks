<?php

namespace App\Test\TestCase\Controller;

use App\Controller\UsersController;
use App\Test\TestCase\Controller\MyIntegrationTestCase;

/**
 * App\Controller\PlacesController Test Case
 */
class UsersControllerTest extends MyIntegrationTestCase {

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.users',
        'app.playlists',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        $this->Users = \Cake\ORM\TableRegistry::get('Users');
    }
    
    public function testCheckToken() {
        $this->get('/api/users/check_token.json');
        $this->assertResponseError();
        
        $this->logUser();
        $this->get('/api/users/check_token.json');
        $this->assertResultMessageSuccess();
    }
    
    public function testUsernameExists() {
        $this->get('/api/users/username_exists.json?q=scallacs');
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('exists', $result);
        $this->assertEquals($result['exists'], true);
        
        $this->get('/api/users/username_exists.json?q=inexistant');
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('exists', $result);
        $this->assertEquals($result['exists'], false);
        
        $this->get('/api/users/username_exists.json');
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('exists', $result);
        $this->assertEquals($result['exists'], false);
    }

    // Test adding duplicate account
    public function testProfile() {
        $this->logUser();
        $this->get('/api/users/profile.json');
        $this->assertResponseOk();
    }

    // Test adding duplicate account
//    public function testLoginValid() {
//        $data = [
//            'username' => "sca.leonard@gmail.com",
//            "password" => 'testtest',
//        ];
//        $this->post('/api/users/login.json', $data);
//        $this->assertResponseOk();
//
//        $result = json_decode($this->_response->body(), true);
//        debug($result);
//        $this->assertArrayHasKey('success', $result);
//        $this->assertTrue($result['success']);
//    }
    // Test adding duplicate account
    public function testLoginInvalid() {
        $data = [
            'username' => "invalid@gmail.com",
            "password" => 'testtest',
        ];
        $this->post('/api/users/login.json', $data);
        $this->assertResultMessageFailure();
    }

    // Test adding duplicate account
    public function testSignupValid() {
        $data = [
            'username' => "newuser",
            'email' => "newuser@gmail.com",
            "password" => 'testtest',
            'confirm_password' => 'testtest'
        ];
        $this->post('/api/users/signup.json', $data);
        $this->assertResponseOk();

        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('success', $result);
        // Fail because of captch...
        $this->assertTrue($result['success'], 'Should be possible to signup');
    }

    // Test adding duplicate account
    public function testSignupDuplicate() {
        $data = [
            'username' => "scallacs",
            'email' => "sca.leonard@gmail.com",
            "password" => 'testtest',
            'confirm_password' => 'testtest'
        ];
        $this->post('/api/users/signup.json', $data);
        $this->assertResponseOk();

        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('success', $result);
        $this->assertFalse($result['success']);
    }

    // Test adding a place when not logged in
//    public function testUnauthorizedEditProfile() {
//        \App\Lib\ResultMessage::reset();
//        try {
//            $this->post('/api/users/edit.json');
//        } catch (\Cake\Network\Exception\UnauthorizedException $ex) {
//            
//        }
//        $this->assertResponseCode(403);
//    }
    // Test adding a place when not logged in
    public function testLoginFacebookInvalidCode() {
        $data = [
            'code' => 'oijfeojfoej'
        ];
        $this->post('/api/users/facebook_login.json', $data);
        $this->assertResponseOk();

        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('success', $result);
        $this->assertFalse($result['success']);
    }

    // Test adding duplicate account
    public function testChangePassword() {
        $this->logUser(1);
        $entity = $this->Users->get(1);
        $entity->password = $this->Users->hashPassword('testtest');
        $this->assertTrue((bool) $this->Users->save($entity), "Should be able to save new password");

        $data = [
            'old_password' => "testtest",
            'password' => 'abcdefgh'
        ];
        $this->post('/api/users/change_password.json', $data);
        $this->assertResultMessageSuccess(null, "Should not possible to change the password with the valid one");

        // Check that we cannot change the password with the old one
        $this->post('/api/users/change_password.json', $data);
        $this->assertResultMessageFailure(null, "Should not be possible to change the password with the old one");

        
        $data['old_password'] = 'abcdefgh';
        // Should not be possible to change password with a weak one
        $data['password'] = 'a';
        $this->post('/api/users/change_password.json', $data);
        $this->assertResultMessageFailure(null, "Should not be possible to change password with a weak one");
        
        // Should be possible to change password with the new one
        $data['password'] = 'newnewnew';
        $this->post('/api/users/change_password.json', $data);
        $this->assertResultMessageSuccess(null, "Should be possible to change password with the new one");
    }
    public function testRequestPassword() {
        
        // Request password with invalid email
        $data = [
            'email' => 'cenes\'estpas un email'
        ];
        $this->post('/api/users/request_password.json', $data);
        $this->assertResultMessageFailure();
        
        // Request password with inexistant email
        $data = [
            'email' => 'validemailthatisnotindb@mail.com'
        ];
        $this->post('/api/users/request_password.json', $data);
        $this->assertResultMessageSuccess();
        
    }

    // Test adding duplicate account
    public function testResetPassword() {
        // Valid email
        $record = \App\Test\Fixture\UsersFixture::$RECORD_RESET_PASSWORD;
        $data = [
            'email' => $record['email']
        ];
        $this->post('/api/users/request_password.json', $data);
        $this->assertResultMessageSuccess(null, "Should be possible to request a new password (@warning: email should works')");
        
        // Should be possible to reset password with the new one
        $record = $this->Users->get($record['id']);
        $data['password'] = 'newnewnew';
        $data['token'] = $record->password_token;
        $this->post('/api/users/reset_password.json', $data);
        $result = json_decode($this->_response->body(), true);
        $this->assertResultMessageSuccess($result, "Should be possible to change password with the valid token");
        
        // Connect with the new password
        unset($data['token']);
        $this->post('/api/users/login.json', $data);
        $result = json_decode($this->_response->body(), true);
        $this->assertResultMessageSuccess($result, "Should be possible to login with the reseted password");
                
    }

    // Test adding a place when not logged in
//    public function testLoginFacebook() {
//        
//        
//        // TODO get code ? 
//        $data = [
//            'code' => 'oijfeojfoej'
//        ];
//        $this->post('/api/users/facebook_login.json', $data);
//        $this->assertResponseOk();
//
//        $result = json_decode($this->_response->body(), true);
//        $this->assertArrayHasKey('success', $result);
//        $this->assertFalse($result['success']);
//    }
}
