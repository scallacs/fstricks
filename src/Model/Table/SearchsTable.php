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
    
    public function initFilters($mode = 'default') {
        $this->addBehavior('Search.Search');
        $this->searchManager()
                ->add('sport_id', 'MultipleValue', [
                    'field' => 'Searchs.sport_id',
                    'delimiter' => ',',
                    'acceptNull' => true,
                ])
                ->add('q', 'MultipleLike', [
                    'before' => true,
                    'after' => true,
                    'delimiter' => ' ',
                    'field' => 'Searchs.title',
                    'mode' => 'AND'
                ]);
    }

}
