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
        $config = TableRegistry::exists('Categories') ? [] : ['className' => 'App\Model\Table\CategoriesTable'];
        $this->Categories = TableRegistry::get('Categories', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Tags);
        unset($this->Categories);

        parent::tearDown();
    }

    
    public function testInvalidCategory() {
        
        $categoryId = -1;
        $data = [
            'name' => 'the new tag',
            'category_id' => $categoryId,
            'user_id' => 1
        ];
        $tag = $this->Tags->newEntity($data);
        $tag->user_id = 1;
        $success = (bool) $this->Tags->save($tag);
        $this->assertFalse($success, "Should not be possible to save an invalid category");
        
        
    }
    public function testGenerateSlug() {
        $categoryId = 1;
        $category = $this->Categories->get($categoryId, ['contain' => 'Sports']);
        $data = [
            'name' => 'the new tag',
            'category_id' => $category->id,
            'user_id' => 1
        ];
        $tag = $this->Tags->newEntity($data);
        $tag->user_id = 1;
        $success = (bool) $this->Tags->save($tag);
        $this->assertTrue($success);
        
        $tag = $this->Tags->get($tag->id);
        $this->assertEquals('snowboard-kicker-the-new-tag', $tag->slug);
        
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
            'category_id' => 1,
            'user_id' =>1
        ]);
        if (!$this->Tags->save($entity)){
            debug($entity->errors());
            $this->assertTrue(false, "This tag should be created");
        }
        $entity = $this->Tags->newEntity([
            'name' => 'myuniqtag',
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
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
        
        $entity = $this->Tags->newEntity([
            'name' => '$salut',
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
        
        $entity = $this->Tags->newEntity([
            'name' => 'saut@',
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
        
        
        $entity = $this->Tags->newEntity([
            'name' => 'accentué',
            'category_id' => 1,
            'user_id' =>1
        ]);
        $this->assertTrue(!empty($entity->errors()));
    }
}