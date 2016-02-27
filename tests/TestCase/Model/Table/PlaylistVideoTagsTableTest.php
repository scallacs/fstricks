<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\PlaylistVideoTagsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\PlaylistVideoTagsTable Test Case
 */
class PlaylistVideoTagsTableTest extends TestCase
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
        'app.sports',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('PlaylistVideoTags') ? [] : ['className' => 'App\Model\Table\PlaylistVideoTagsTable'];
        $this->PlaylistVideoTags = TableRegistry::get('PlaylistVideoTags', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->PlaylistVideoTags);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testValidationDefault()
    {
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
