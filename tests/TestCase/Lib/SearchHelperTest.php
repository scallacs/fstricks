<?php

use Cake\ORM\TableRegistry;

/**
 * Description of ResultMessageTest
 *
 * @author stephane
 */
class SearchHelperTest extends \Cake\TestSuite\TestCase {

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown() {
        parent::tearDown();
    }

    public function testKeyWords(){
        $data = [
            'q' => 'multiple key words'
        ];
        
        $table = TableRegistry::get('tests');
        $query = $table->query('all');
        
        $query->select(['firstname', 'lastname']);
        
        $search = new \App\Lib\SearchHelper($data, $query);
        $search->required('q', 'CONCAT(tests.firstname,tests.lastname)', [
            'type' => 'keywords'
        ]);
        
        debug($query->sql());
    }
}
