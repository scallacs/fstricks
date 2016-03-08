<?php

namespace App\Model\Table;

/**
 * Searchs Model
 *
 * @property \Cake\ORM\Association\BelongsToMany $Spots
 */
class SearchsTable extends \Cake\ORM\Table {

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->table('searchs');
        $this->displayField('title');
        $this->primaryKey('id');

    }


}
