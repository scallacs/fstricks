<?php

namespace App\Test\TestCase\Controller;

use App\Controller\RidersController;

/**
 * App\Controller\RidersController Test Case
 */
class RidersControllerTest extends MyIntegrationTestCase {

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.riders',
        'app.users',
    ];

    /**
     * Test index method
     *
     * @return void
     */
    public function testUnauthorizedSave() {
        $this->post('riders/save');
        $this->assertResponseError("Should raise a not authorh");
    }

    /**
     * Test index method
     *
     * @return void
     */
    public function testSave() {
        $this->logUser(2);
        $data = [
            'firstname' => 'test',
            'lastname' => 'test',
            'nationality' => 'fr',
            'is_pro' => false
        ];
        $this->post('riders/save.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
    }

    public function testEdit() {
        $this->logUser(1);
        $data = [
            'firstname' => 'test',
            'lastname' => 'test',
            'nationality' => 'fr',
            'is_pro' => false
        ];
        $this->post('riders/save.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
    }
    
    public function testAdd() {
        $this->logUser(1);
        $data = [
            'firstname' => 'test',
            'lastname' => 'test',
            'nationality' => 'fr',
            'is_pro' => false
        ];
        $this->post('riders/add.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
    }
    
    public function testAddMissingData() {
        $this->logUser(1);
        $data = [
            'firstname' => 'test',
            'lastname' => 'test',
        ];
        $this->post('riders/add.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertFalse($result['success']);
    }

    public function testUserRiderProfile() {
        $this->logUser(1);
        $this->get('riders/profile.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('id', $result);
    }

    public function testUserRiderProfileNotLoggedIn() {
        try {
            $this->get('riders/profile.json');
            $this->assertResponseCode(404);
        } catch (Exception $ex) {
            
        }
    }

    public function testViewProfile() {
        $this->get('riders/profile/2.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('id', $result);
    }

    public function testProfileNotFound() {
        try {
            $this->get('riders/profile/9999999.json');
            $this->assertResponseCode(404);
        } catch (Exception $ex) {
            
        }
    }
    
    
    public function testLocalSearch(){
        $this->get('riders/local_search.json?q=Stephane');
        $this->assertResponseOk();
    }

    
//    public function testFacebookSearch(){
//        $this->get('riders/facebook_search.json?q=Stephane');
//        $this->assertResponseOk();
//    }

}
