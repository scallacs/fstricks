<?php

namespace App\Test\TestCase\Controller;

use App\Controller\VideosController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\VideosController Test Case
 */
class VideosControllerTest extends IntegrationTestCase {

    
    private function logUser(){
        // Set session data
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => 1,
                    'username' => 'testing',
                // other keys.
                ]
            ]
        ]);
    }
    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.videos',
        'app.users',
    ];

    /**
     * Test beforeFilter method
     *
     * @return void
     */
    public function setUp() {
        $this->configRequest([
            'headers' => ['Accept' => 'application/json']
        ]);
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAdd() {
        $table = \Cake\ORM\TableRegistry::get('Videos');
        // Set session data
        $this->logUser();
        $providers = \Cake\Core\Configure::read('videoProviders');
        $this->assertTrue(count($providers) > 0);
        $providerName = $providers[0]['name'];
        $data = [
            'provider_id' => $providerName,
            'video_url' => '6mEHw5q6Yfs'
        ];
        $table->deleteAll($data);
        $this->post('/Videos/add.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertTrue($result->success);
        
        // Add duplicate
        $this->post('/Videos/add.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertFalse($result->success);
        $this->assertNotEmpty($result->validationErrors->Videos->video_url);

    }
    /**
     * Test add method
     *
     * @return void
     */
    public function testAddInvalidData() {
        // ---------------------------------------------------------------------
        // Not logged in 
        $this->post('/Videos/add.json');
        $this->assertResponseCode(401);
        
        
        // Set session data
        $this->logUser();
        // No data
        $this->post('/Videos/add.json');
        $this->assertResponseOk();
        
        $result = json_decode($this->_response->body());
        $this->assertFalse($result->success);
        
        // ---------------------------------------------------------------------
        // Invalid provider
        $this->post('/Videos/add.json', [
            'provider' => 'feoizjfeijo',
            'videoId' => 'feizjfeio'
        ]);
        $this->assertResponseOk();
        
        $result = json_decode($this->_response->body());
        $this->assertFalse($result->success);
        $this->assertNotEmpty($result->validationErrors->Videos);
        $this->assertNotEmpty($result->validationErrors->Videos->provider_id);
        
        // ---------------------------------------------------------------------
        // valid provider, invalid video id
        $providers = \Cake\Core\Configure::read('videoProviders');
        $this->assertTrue(count($providers) > 0);
        
        $providerName = $providers[0]['name'];
        $this->post('/Videos/add.json', [
            'provider_id' => $providerName,
            'video_url' => 'feizjfvefefefezfezfezcezfeeio'
        ]);
        $this->assertResponseOk();
        
        $result = json_decode($this->_response->body());
        $this->assertFalse($result->success);
        $this->assertNotEmpty($result->validationErrors->Videos);
        $this->assertFalse(isset($result->validationErrors->Videos->provider_id));
        $this->assertNotEmpty($result->validationErrors->Videos->video_url);
        
    }

    public function testAddOrGet(){
        $this->logUser();
        $table = \Cake\ORM\TableRegistry::get('Videos');
        $providers = \Cake\Core\Configure::read('videoProviders');
        $this->assertTrue(count($providers) > 0);
        $providerName = $providers[0]['name'];
        $data = [
            'provider_id' => $providerName,
            'video_url' => '6mEHw5q6Yfs'
        ];
        $table->deleteAll($data);
        
        $this->post("/Videos/addOrGet.json", $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertTrue($result->success);
        
        $this->post("/Videos/addOrGet.json", $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertTrue($result->success);
    }
    
    public function testView(){
        $id = 1;
        $this->get("/Videos/view/$id.json");
        $this->assertResponseOk();
        
        $result = json_decode($this->_response->body());
//        debug($result);
        
        $this->assertTrue(isset($result->id));
    }
    
    public function testSearch(){
        $id = 1;
        $this->get("/Videos/search?video_url=tetetzeez?provider=youtube.json");
        $this->assertResponseOk();
        
        $result = json_decode($this->_response->body());
//        debug($result);
        
        $this->assertTrue(isset($result->id));
    }
}
