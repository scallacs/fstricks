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
        'app.nationalities',
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
    public function testCreateNewProfileForUser() {
        $this->logUser(3);
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

    public function testEditExistingRiderProfile() {
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
//        debug($this->_response->body());
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
        $this->assertArrayHasKey('validationErrors', $result);
        $this->assertArrayHasKey('Riders', $result['validationErrors']);
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
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('data', $result);
        
        $this->get('riders/local_search.json?firstname=Stephane');
        $this->assertResponseOk();
        
        $this->get('riders/local_search.json?firstname=Stephane&lastname=test');
        $this->assertResponseOk();
    }
    
    public function testLocalSearchResults(){
        $this->get('riders/local_search.json?q=XaVIer de le rue');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $data = $result['data'];
        $this->assertCount(1, $data);
        $this->assertEquals(3, $data[0]['id']);
        
        // Test ignore accents
        $this->get('riders/local_search.json?q=Stephane Leonard');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $data = $result['data'];
        $this->assertCount(1, $data);
        $this->assertEquals(1, $data[0]['id']);
        
        // Test no results
        $this->get('riders/local_search.json?q=Stephane De le rue');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $data = $result['data'];
        $this->assertCount(0, $data);
    }


    
//    public function testFacebookSearch(){
//        $this->get('riders/facebook_search.json?q=Stephane');
//        $this->assertResponseOk();
//    }

}
