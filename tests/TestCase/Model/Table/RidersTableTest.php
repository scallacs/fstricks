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
}