<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\PlaylistsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

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
        // Max length
        $data = [
            'title' => 'Title very to long', // TODO 
            'description' => 'Title very to long', // TODO 
            'status' => 'Invalid status',
        ];
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test buildRules method
     *
     * @return void
     */
    public function testBuildRules()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
