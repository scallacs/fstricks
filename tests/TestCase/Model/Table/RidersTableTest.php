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
        'app.nationalities',
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
     * TODO
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

}