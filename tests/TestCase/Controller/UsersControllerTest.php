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
    ];
    
    


    // Test adding duplicate account
    public function testProfile() {
        $this->logUser();
        $this->get('/api/users/profile.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
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
        $this->assertResponseOk();

        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('success', $result);
        $this->assertFalse($result['success']);
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
        $this->assertTrue($result['success']);
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

    // Test adding a place when not logged in
//    public function testLoginFacebook() {
//        \App\Lib\ResultMessage::reset();
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
