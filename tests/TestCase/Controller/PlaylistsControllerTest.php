<?php

namespace App\Test\TestCase\Controller;

use App\Controller\PlaylistsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\PlaylistsController Test Case
 */
class PlaylistsControllerTest extends MyIntegrationTestCase {

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
        'app.video_tag_accuracy_rates',
        'app.categories',
        'app.sports',
        'app.playlist_video_tags'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        $this->Playlists = \Cake\ORM\TableRegistry::get('Playlists');
    }

    /**
     * Test index method
     *
     * @return void
     */
    public function testIndex() {
        $this->get('/api/Playlists/index.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
//        debug($result);
        $this->assertArrayHasKeys(['total', 'items', 'perPage'], $result, 'It should be a pagination result');
    }

    /**
     * Test index method
     *
     * @return void
     */
    public function testSearch() {
        $this->get('/api/Playlists/search.json?q=playlist');
        $this->assertResponseOk();
    }

    /**
     * Test index method
     *
     * @return void
     */
    public function testUser() {
        $this->logUser();
        $this->get('/api/Playlists/user.json');
        $this->assertResponseOk();
    }

    /**
     * Test view method
     *
     * @return void
     */
    public function testViewPublic() {
        $this->get('/api/Playlists/view/' . \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC . '.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKeys(['id', 'title', 'description', 'count_tags', 'created', 'status'], $result);
    }

    public function testViewPrivate() {
        $this->get('/api/Playlists/view/' . \App\Test\Fixture\PlaylistsFixture::ID_PRIVATE . '.json');
        $this->assertResponseError(404, "It should not be possible to view a private playlist if not logged in");

        $playlist = $this->Playlists->get(\App\Test\Fixture\PlaylistsFixture::ID_PRIVATE);
        $this->logUser($playlist->user_id);
        $this->get('/api/Playlists/view/' . \App\Test\Fixture\PlaylistsFixture::ID_PRIVATE . '.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKeys(['id', 'title', 'description', 'count_tags', 'created', 'status'], $result);

        $this->logUser($playlist->user_id + 1);
        $this->get('/api/Playlists/view/' . \App\Test\Fixture\PlaylistsFixture::ID_PRIVATE . '.json');
        $this->assertResponseError(404, "It should not be possible to view a private playlist if it's not the owner");
    }

    public function testViewBlocked() {
        $this->get('/api/Playlists/view/' . \App\Test\Fixture\PlaylistsFixture::ID_BLOCKED . '.json');
        $this->assertResponseError(404, "It should not be possible to view a blocked playlist");
    }

    public function testViewUnkown() {
        $this->get('/api/Playlists/view.json');
        $this->assertResponseError(404, "Should not be possible to view an unknown playlist");
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAdd() {
        $userId = 1;
        $this->logUser($userId);
        $data = [
            'title' => 'This is my new title',
            'description' => 'This is the new description',
            'status' => \App\Model\Entity\Playlist::STATUS_PRIVATE,
            'count_tags' => 999,
            'user_id' => 999
        ];
        $this->post('/api/Playlists/add.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
        $this->assertArrayHasKeys(['data' => ['playlist_id']], $result);

        $playlist = $this->Playlists->get($result['data']['playlist_id']);
        $this->assertEquals($data['title'], $playlist->title);
        $this->assertEquals($data['description'], $playlist->description);
        $this->assertEquals($data['status'], $playlist->status);
        $this->assertEquals(0, $playlist->count_tags);
        $this->assertEquals($userId, $playlist->user_id);
    }

    
    /**
     * Test add method
     *
     * @return void
     */
    public function testAddWithErrors() {
        $this->logUser(1);
        $data = [
            'title' => 'T',
            'status' => \App\Model\Entity\Playlist::STATUS_PRIVATE,
        ];
        $this->post('/api/Playlists/add.json', $data);
        $this->assertValidationErrors('Playlists', ['title']);
    }
    /**
     * Test edit method
     *
     * @return void
     */
    public function testEdit() {
        $tagId = \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC;
        $playlistOrigin = $this->Playlists->get($tagId);

        $this->logUser($playlistOrigin->user_id);
        $data = [
            'title' => 'This is my new title',
            'description' => 'This is the new description',
            'status' => \App\Model\Entity\Playlist::STATUS_PRIVATE,
            'count_tags' => 999,
            'user_id' => 999
        ];
        $this->post('/api/Playlists/edit/' . $tagId . '.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);

        $playlist = $this->Playlists->get($tagId);
        $this->assertEquals($data['title'], $playlist->title);
        $this->assertEquals($data['description'], $playlist->description);
        $this->assertEquals($data['status'], $playlist->status);
        $this->assertEquals($playlistOrigin->count_tags, $playlist->count_tags);
        $this->assertEquals($playlistOrigin->user_id, $playlist->user_id);
    }

    public function testEditWithErrors() {
        $tagId = \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC;
        $playlistOrigin = $this->Playlists->get($tagId);

        $this->logUser($playlistOrigin->user_id);
        $data = [
            'title' => 't'
        ];
        $this->post('/api/Playlists/edit/' . $tagId . '.json', $data);
        $this->assertValidationErrors('Playlists', ['title']);
    }
    /**
     * Test edit method
     *
     * @return void
     */
    public function testEditBlocked() {
        $tagId = \App\Test\Fixture\PlaylistsFixture::ID_BLOCKED;
        $playlistOrigin = $this->Playlists->get($tagId);

        $this->logUser($playlistOrigin->user_id);
        $data = [
            'title' => 'This is my new title',
            'description' => 'This is the new description'
        ];
        $this->post('/api/Playlists/edit/' . $tagId . '.json', $data);
        $this->assertResponseError(404, "Should not be able to edit a blocked playlist");
    }

    public function testEditNotOwner() {
        $tagId = \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC;
        $playlistOrigin = $this->Playlists->get($tagId);

        $this->logUser($playlistOrigin->user_id + 1);
        $data = [
            'title' => 'This is my new title',
            'description' => 'This is the new description'
        ];
        $this->post('/api/Playlists/edit/' . $tagId . '.json', $data);
        $this->assertResponseError(404, "The user should not be able to delete "
                . "another user playlist.");
    }

    /**
     * Test delete method
     *
     * @return void
     */
    public function testDelete() {
        $tagId = \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC;
        $playlistOrigin = $this->Playlists->get($tagId);
        $this->logUser($playlistOrigin->user_id);
        $this->post('/api/Playlists/delete/' . $tagId . '.json');
        $this->assertResponseOk();
    }

    /**
     * Test delete Not owner method
     *
     * @return void
     */
    public function testDeleteNotOwner() {
        $tagId = \App\Test\Fixture\PlaylistsFixture::ID_PUBLIC;
        $playlistOrigin = $this->Playlists->get($tagId);

        $this->logUser($playlistOrigin->user_id + 1);
        $this->post('/api/Playlists/delete/' . $tagId . '.json');
        $this->assertResponseError(404, "The user should not be able to delete "
                . "another user playlist.");
    }

}
