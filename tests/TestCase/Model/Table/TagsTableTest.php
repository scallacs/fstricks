<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\TagsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\TagsTable Test Case
 */
class TagsTableTest extends TestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.tags',
        'app.sports',
        'app.categories',
        'app.users',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Tags') ? [] : ['className' => 'App\Model\Table\TagsTable'];
        $this->Tags = TableRegistry::get('Tags', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Tags);

        parent::tearDown();
    }


    /**
     * Test adding a similar tag 
     * TODO
     * @return void
     */
    public function testAddWithAccent() {
        // Add a video:
        $data = [
            'name' => 'méMé 3600 ',
            'sport_id' => 1,
            'category_id' => 1,
        ];
        $tag = $this->Tags->newEntity($data);
        $tag->user_id = 1;
        if (!$this->Tags->save($tag)){
            $this->assertTrue(false);
        }            
        $this->assertEquals('mémé 3600', $tag->name);
    }

}