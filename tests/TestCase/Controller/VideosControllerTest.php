<?php

namespace App\Test\TestCase\Controller;

use App\Controller\VideosController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\VideosController Test Case
 */
class VideosControllerTest extends \App\Test\Util\MyIntegrationTestCase {

    /**
     *
     * @var \App\Test\Util\RestApiTester 
     */
    public $apiTester;
    
    
    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.video_providers',
        'app.videos',
        'app.users',
        'app.video_tags',
        'app.categories',
        'app.tags',
        'app.sports',
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

        //$this->providers = \Cake\Core\Configure::read('videoProviders');
        $this->providers = ['youtube'];
        $this->assertTrue(count($this->providers) > 0);
        $this->apiTester = new \App\Test\Util\RestApiTester($this, '/api/videos/');
    }

    public function testIndex(){
        $this->apiTester->paginate([
            'id', 'status', 'duration', 'provider_id', 'video_url'
        ]);
    }
    
    /**
     * Test add method for each provider
     *
     * @return void
     */
    public function testAddProviders() {
        // Set session data
        $this->logUser();

        $data = [
            [
                'provider_id' => 'youtube',
                'urls' => ['6mEHw5q6Yfs']
            ],
            [
                'provider_id' => 'vimeo',
                'urls' => ['36973502']
            ]
        ];
        foreach ($data as $d) {
            foreach ($d['urls'] as $url) {
                \App\Lib\ResultMessage::reset();
                $this->post('/api/Videos/add.json', [
                    'provider_id' => $d['provider_id'],
                    'video_url' => $url
                ]);
                $this->assertResponseOk();
                $result = json_decode($this->_response->body());
                $this->assertTrue($result->success, 
                        'Adding a video ' . $url . ' with ' . $d['provider_id'] . ' should be possible');
            }
        }
    }

    public function testAddDuplicateVideo() {
        $this->logUser();
        // Add duplicate
        $data = [
            'provider_id' => $this->providers[0],
            'video_url' => '6mEHw5q6Yfs'
        ];
        $this->post('/api/Videos/add.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertTrue($result->success);
        $data = [
            'provider_id' => $this->providers[0],
            'video_url' => '6mEHw5q6Yfs'
        ];
        $this->post('/api/Videos/add.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertFalse($result->success);
    }

    // ---------------------------------------------------------------------
    // Add Not logged in 
    public function testAddUnauthorized() {
        try {
            $this->post('/api/Videos/add.json');
            $this->assertResponseError();
        } catch (\Cake\Network\Exception\UnauthorizedException $ex) {
            
        }
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAddInvalidData() {
        // Set session data
        $this->logUser();
        // No data
        $this->post('/api/Videos/add.json');
        $this->assertResponseOk();

        $result = json_decode($this->_response->body());
        $this->assertFalse($result->success);

        // ---------------------------------------------------------------------
        // Invalid provider
        $this->post('/api/Videos/add.json', [
            'provider' => 'feoizjfeijo',
            'videoId' => 'feizjfeio'
        ]);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertFalse($result['success']);
        $this->assertArrayHasKey('validationErrors', $result);
        $this->assertArrayHasKey('Videos', $result['validationErrors']);
        $this->assertArrayHasKey('provider_id', $result['validationErrors']['Videos']);

        // ---------------------------------------------------------------------
        // valid provider, invalid video id
        $this->post('/api/Videos/add.json', [
            'provider_id' => $this->providers[0],
            'video_url' => 'feizjfvefefefezfezfezcezfeeio'
        ]);
        $this->assertResponseOk();

        $result = json_decode($this->_response->body());
        $this->assertFalse($result->success);
        $this->assertNotEmpty($result->validationErrors->Videos);
        $this->assertFalse(isset($result->validationErrors->Videos->provider_id));
        $this->assertNotEmpty($result->validationErrors->Videos->video_url);
    }

    public function testAddOrGet() {
        $this->logUser();
        $data = [
            'provider_id' => $this->providers[0],
            'video_url' => '6mEHw5q6Yfs'
        ];

        $this->post("/api/Videos/addOrGet.json", $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertTrue($result->success);

        $this->post("/api/Videos/addOrGet.json", $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertTrue($result->success);
    }

    public function testView() {
        $this->get("/api/Videos/view/1.json");
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertEquals(1, $result->id);
    }

    public function testViewNotExists() {
        try {
            $this->get("/api/Videos/view/99999.json");
            $this->assertResponseCode(404);
        } catch (\Cake\Network\Exception\NotFoundException $ex) {
            
        }
    }

    public function testSearch() {
        $this->get("/api/Videos/search?video_url=myfakevideourl&provider_id=youtube");
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('id', $result);
    }

    public function testReportDeadLink(){
        // Invalid provider / video
        $this->post("/api/Videos/report_dead_link.json", [
            'video_url' => 'blblzrele',
            'provider' => 'oupsy doupsy'
        ]);
        $this->assertResponseOk();
        
        $this->post("/api/Videos/report_dead_link.json", [
            'video_url' => \App\Test\Fixture\VideosFixture::VALID_YOUTUBE_ID,
            'provider' => 'youtube'
        ]);
        $this->assertResponseOk();
                
        // Vimeo
        $this->post("/api/Videos/report_dead_link.json", [
            'video_url' => \App\Test\Fixture\VideosFixture::VALID_VIMEO_ID,
            'provider' => 'vimeo'
        ]);
        $this->assertResponseOk();
    }
}
