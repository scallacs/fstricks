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
    public function testCreateNewProfileForUser() {
        $this->logUser(3);
        $data = [
            'firstname' => 'test',
            'lastname' => 'test',
            'nationality' => 'fr',
            'level' => 1
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
            'level' => 1
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
            'level' => 1
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
        } catch (Cake\Network\Exception\UnauthorizedException $ex) {
            
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
    
    /**
     * Test index method
     *
     * @return void
     */
    public function testUpload() {
        $this->logUser();
        
        $fileFolder = ROOT . '/tests/Fixture/files/';
        $folder = new \Cake\Filesystem\Folder($fileFolder . 'pictures');
        $folder->copy(['to' => $fileFolder . 'tmp/pictures']);
        $fileInfo = [
            'name' => 'small_file.jpg',
            'type' => 'image/jpeg',
            'size' => 542,
            'tmp_name' => $fileFolder . 'tmp/pictures/small_file.jpg',
            'error' => 0
        ];
        $this->post('/riders/save.json', [
            'picture' => $fileInfo
        ]);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success'], 'File should be uploaded');
        
        $targetFolder = ROOT . DS . 'webroot' . DS . 'files' . DS . 'pictures' . DS . 'photo';
        $folderToDelete = new \Cake\Filesystem\Folder($targetFolder);
        $folderToDelete->delete();
    }


    /**
     * Test index method
     *
     * @return void
     */
    public function testUploadNotLogin() {
        $this->post('/riders/save.json');
        $this->assertResponseCode(401);
    }
    
//    public function testFacebookSearch(){
//        $this->get('riders/facebook_search.json?q=Stephane');
//        $this->assertResponseOk();
//    }

}
