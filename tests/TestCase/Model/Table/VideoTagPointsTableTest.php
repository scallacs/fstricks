<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\VideoTagPointsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\VideoTagPointsTable Test Case
 */
class VideoTagPointsTableTest extends TestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.video_tag_points',
        'app.users',
        'app.tags',
        'app.categories',
        'app.sports',
        'app.tags_users',
        'app.spots',
        'app.video_tags',
        'app.videos'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('VideoTagPoints') ? [] : ['className' => 'App\Model\Table\VideoTagPointsTable'];
        $this->VideoTagPoints = TableRegistry::get('VideoTagPoints', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->VideoTagPoints);

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
