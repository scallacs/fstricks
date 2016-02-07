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
            'name' => 'meme 3600 ',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' => 1
        ];
        $tag = $this->Tags->newEntity($data);
        $tag->user_id = 1;
        if (!$this->Tags->save($tag)){
            $this->assertTrue(false);
        }            
        $this->assertEquals('meme 3600', $tag->name);
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testDuplicateChar()
    {
        $entity = $this->Tags->newEntity([
            'name' => 'myuniqtag',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' =>1
        ]);
        if (!$this->Tags->save($entity)){
            debug($entity->errors());
            $this->assertTrue(false, "This tag should be created");
        }
        $entity = $this->Tags->newEntity([
            'name' => 'myuniqtag',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' => 1
        ]);
        $this->Tags->save($entity);
        $errors = $entity->errors();
        
        $this->assertTrue(!empty($errors), "Creating two times the same tag should not be possible");
        $this->assertArrayHasKey('name', $errors);
    }
    
    
    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testAddInvalidChars()
    {
        $entity = $this->Tags->newEntity([
            'name' => '',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
        
        $entity = $this->Tags->newEntity([
            'name' => '#salut',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
        
        $entity = $this->Tags->newEntity([
            'name' => '$salut',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
        
        $entity = $this->Tags->newEntity([
            'name' => 'saut@',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
        
        
        $entity = $this->Tags->newEntity([
            'name' => 'accentué',
            'sport_id' => 1,
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
    }
}