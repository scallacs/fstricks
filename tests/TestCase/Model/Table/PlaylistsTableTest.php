<?php
namespace App\Test\TestCase\Model\Table;

use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;
use App\Lib\JsonConfigHelper;

/**
 * App\Model\Table\PlaylistsTable Test Case
 */
class PlaylistsTableTest extends TestCase
{

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
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Playlists') ? [] : ['className' => 'App\Model\Table\PlaylistsTable'];
        $this->Playlists = TableRegistry::get('Playlists', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Playlists);

        parent::tearDown();
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testValidationDefault()
    {
        // Min length
        $entity = $this->Playlists->newEntity(['title' => 'A']);
        $this->assertArrayHasKey('title', $entity->errors());
        // Max length
        $title = \App\Test\TestUtils::generateString(JsonConfigHelper::rules("playlists", "title", "max_length") + 2);
        $entity = $this->Playlists->newEntity([
            'title' => $title
        ]);
        $this->assertArrayHasKey('title', $entity->errors());
        // description
        $description = \App\Test\TestUtils::generateString(JsonConfigHelper::rules("playlists", "description", "max_length") + 1);
        $entity = $this->Playlists->newEntity(['description' => $description]);
        $this->assertArrayHasKey('description', $entity->errors());
        // Status
        $entity = $this->Playlists->newEntity(['status' => \App\Model\Entity\Playlist::STATUS_BLOCKED]);
        $this->assertArrayHasKey('status', $entity->errors());
    }

}
