<?php

namespace App\Test\TestCase\Controller;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\PlaylistsController Test Case
 * 
 * TODO FIND A WAY TO LOAD THE VIEW FOR THE TEST
 */
class SearchsControllerTest extends MyIntegrationTestCase {

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.playlists',
        'app.users',
        'app.tags',
        'app.video_tags',
        'app.videos',
        'app.riders',
        'app.categories',
        'app.sports',
        'app.searchs'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        $this->Searchs = \Cake\ORM\TableRegistry::get('Searchs');
    }

    /**
     * Test index method
     *
     * @return void
     */
    public function testSearch() {
        $this->get('/api/Searchs/search.json?sport_id=1&q=q query with too much words that can be handled therefor they are ignored.json');
        $this->assertResponseOk();
        
        
        $this->get('/api/Searchs/search.json?q=playlist.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue(!empty($result));
        $data = $result[0];
        $this->ssertArrayHasKeys(['title', 'id', 'sub_title', 'slug'], $data);
        
        // No request
        $this->get('/api/Searchs/search.json');
        $this->assertResponseError();
    }

}
