<?php
namespace App\Test\TestCase\Controller;

use App\Controller\PlaylistVideoTagsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\PlaylistVideoTagsController Test Case
 */
class PlaylistVideoTagsControllerTest extends IntegrationTestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.playlists',
        'app.playlist_video_tags',
        'app.users',
        'app.tags',
        'app.video_tags',
        'app.videos',
        'app.riders',
        'app.video_tag_accuracy_rates',
        'app.categories',
        'app.sports'
    ];
    
    
    public function testUp(){
        $this->markTestIncomplete('Not implemented yet.');
        $this->post('/api/PlaylistVideoTags/down/1');
    }
    public function testDown(){
        $this->markTestIncomplete('Not implemented yet.');
        $this->post('/api/PlaylistVideoTags/down/1');
    }
    public function testAdd(){
        $this->markTestIncomplete('Not implemented yet.');
        $data = [
            'video_tag_id' => '',
            'playlist_id' => ''
        ];
        $this->post('/api/PlaylistVideoTags/add', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
    }
    public function testRemove(){
        $this->markTestIncomplete('Not implemented yet.');
        $this->post('/api/PlaylistVideoTags/delete/1');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
    }
}
