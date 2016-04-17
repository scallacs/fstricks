<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\RidersTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\RidersTable Test Case
 */
class RidersTableTest extends TestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.riders',
        'app.users',
        'app.video_tags',
        'app.sports',
        'app.categories',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Riders') ? [] : ['className' => 'App\Model\Table\RidersTable'];
        $this->Riders = TableRegistry::get('Riders', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Riders);
        parent::tearDown();
    }


    
    
    /**
     * Test adding with accents and upper case
     * @return void
     */
    public function testAddWithAccent() {
        // Add a video:
        $data = [
            'user_id' => null,
            'firstname' => ' Stéphane ',
            'lastname' => 'De Léonard',
            'level' => 1,
            'nationality' => 'fr',
        ];
        $rider = $this->Riders->newEntity($data);
        if (!$this->Riders->save($rider)){
            $this->assertTrue(false);
        }            
        $this->assertEquals('stéphane', $rider->firstname);
        $this->assertEquals('de léonard', $rider->lastname);
    }

    

    /**
     * Test adding with accents and upper case
     * TODO
     * @return void
     */
    public function testValidationErrors() {
        // Add a video:
        $data = [
            'user_id' => null,
            'firstname' => 'a',
            'lastname' => 'b',
            'level' => 1000,
            'nationality' => 'blop',
        ];
        $rider = $this->Riders->newEntity($data);
        $errors = $rider->errors();
        $this->assertArrayHasKey('firstname', $errors);
        $this->assertArrayHasKey('lastname', $errors);
        $this->assertArrayHasKey('level', $errors);
        $this->assertArrayHasKey('nationality', $errors);
    }
    
    
    /**
     * It should not be possible to add a rider with the same name and a different nationality
     * @return void
     */
    public function testAddDuplicateRiderFirstAndLastName() {
        // Add a video:
        $data = [
            'user_id' => null,
            'firstname' => 'ridertest23',
            'lastname' => 'ridertest23',
            'level' => 1,
            'nationality' => 'fr',
        ];
        $entity = $this->Riders->newEntity($data);
        $this->assertTrue((bool)$this->Riders->save($entity));
        
        $data['nationality'] = 'ca';
        $entity = $this->Riders->newEntity($data);
        $success = (bool)$this->Riders->save($entity);
        $this->assertTrue($success, 
                "It should be possible to add a rider with the same name and a different nationality");
    }
    
    /**
     * It should not be possible to add  a rider with the same name and nationality
     * @return void
     */
    public function testAddDuplicateRiderFirstAndLastNameAndNationality() {
        // Add a video:
        $data = [
            'user_id' => null,
            'firstname' => 'ridertest23',
            'lastname' => 'ridertest23',
            'level' => 1,
            'nationality' => 'fr',
        ];
        $entity = $this->Riders->newEntity($data);
        $this->assertTrue((bool)$this->Riders->save($entity));
        
        $entity = $this->Riders->newEntity($data);
        $this->assertFalse((bool)$this->Riders->save($entity), 
                "It should not be possible to add a rider with the same name and nationality");
    }
    
    
    public function testFindRiderSports(){
        $riderId = 1;
        $results = $this->Riders->findRiderSports($riderId)->all();
        $this->assertTrue(count($results) > 1, "Should return sports");
    }
}