<?php
namespace App\Test\TestCase\Controller;

use App\Controller\PlaylistVideoTagsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\PlaylistVideoTagsController Test Case
 */
class PlaylistVideoTagsControllerTest extends MyIntegrationTestCase
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
    
    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        $this->Playlists = \Cake\ORM\TableRegistry::get('Playlists');
        $this->PlaylistVideoTags = \Cake\ORM\TableRegistry::get('PlaylistVideoTags');
    }

    
    
    public function testPlaylist(){
        $this->post('/api/PlaylistVideoTags/playlist/'.\App\Test\Fixture\PlaylistsFixture::ID_PUBLIC.'.json');
        $this->assertResponseOk();
    }
    
    public function testUp(){
        $playlistId = \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC;
        $playlist = $this->Playlists->get($playlistId);
        $userId = $playlist->user_id;
        $this->logUser($userId);
        $this->post('/api/PlaylistVideoTags/up/'.$playlist->id.'.json');
        $this->assertResponseOk();
        $this->assertResultMessageSuccess();
    }
    
    public function testDown(){
        $playlistId = \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC;
        $playlist = $this->Playlists->get($playlistId);
        $userId = $playlist->user_id;
        $this->logUser($userId);
        $this->post('/api/PlaylistVideoTags/down/'.$playlist->id.'.json');
        $this->assertResponseOk();
        $this->assertResultMessageSuccess();
    }
    
    public function testAdd(){
        $playlistId = \App\Test\Fixture\PlaylistsFixture::ID_EMPTY_PLAYLIST;
        $userId = $this->Playlists->get($playlistId)->user_id;
        $this->logUser($userId);
        $data = [
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_VALIDATED,
            'playlist_id' => $playlistId
        ];
        $this->post('/api/PlaylistVideoTags/add.json', $data);
        
        $this->assertResponseOk();
//        debug(json_decode($this->_response->body(), true));
        $this->assertResultMessageSuccess();
        
        // Duplicate
        \App\Lib\ResultMessage::reset();
        $this->post('/api/PlaylistVideoTags/add.json', $data);
        $this->assertResponseOk();
//        $result = json_decode($this->_response->body(), true);
        $this->assertResultMessageFailure();
    }
    public function testAddBlockedPlaylist(){
        $playlistId = \App\Test\Fixture\PlaylistsFixture::ID_BLOCKED;
        $userId = $this->Playlists->get($playlistId)->user_id;
        $this->logUser($userId);
        $data = [
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_VALIDATED,
            'playlist_id' => $playlistId
        ];
        $this->post('/api/PlaylistVideoTags/add.json', $data);
        $this->assertResponseError(404);
    }
    
    public function testDelete(){
        $playlistItem = $this->PlaylistVideoTags->get(1);
        $playlist = $this->Playlists->get($playlistItem->playlist_id);
        $this->logUser($playlist->user_id);
        $this->post('/api/PlaylistVideoTags/delete/'.$playlistItem->id.'.json');
        $this->assertResponseOk();
        $this->assertResultMessageSuccess();
    }
    public function testDeleteNotOwner(){
        $playlistItem = $this->PlaylistVideoTags->get(1);
        $playlist = $this->Playlists->get($playlistItem->playlist_id);
        $this->logUser($playlist->user_id + 1);
        $this->post('/api/PlaylistVideoTags/delete/'.$playlistItem->id.'.json');
        $this->assertResponseError();
    }
}
