<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ErrorTypesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ErrorTypesTable Test Case
 */
class ErrorTypesTableTest extends TestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.error_types',
        'app.report_errors',
        'app.users',
        'app.tags',
        'app.video_tags',
        'app.videos',
        'app.categories',
        'app.sports',
        'app.tags_users',
        'app.spots'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('ErrorTypes') ? [] : ['className' => 'App\Model\Table\ErrorTypesTable'];
        $this->ErrorTypes = TableRegistry::get('ErrorTypes', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ErrorTypes);

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
}
