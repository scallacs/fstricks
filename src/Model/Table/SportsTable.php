<?php
namespace App\Model\Table;

use App\Model\Entity\Sport;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Sports Model
 *
 * @property \Cake\ORM\Association\HasMany $Categories
 * @property \Cake\ORM\Association\HasMany $Tags
 */
class SportsTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('sports');
        $this->displayField('name');
        $this->primaryKey('id');

        $this->hasMany('Categories', [
            'foreignKey' => 'sport_id'
        ]);
        $this->hasMany('Tags', [
            'foreignKey' => 'sport_id'
        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('id', 'create');

        $validator
            ->requirePresence('name', 'create')
            ->notEmpty('name');

        return $validator;
    }
    
    public function findAllCached(){
        return $this
                ->find('all')
                ->contain(['Categories'])
                ->cache('sports', 'veryLongCache');
    }
    
    public function findFromNameCached($name){
        $data = $this->findAllCached();
        foreach ($data as $d){
            if ($d['name'] === strtolower($name)){
                return $d;
            }
        }
        return null;
    }
    public function findFromCategoryCached($sportName, $categoryName){
        $categoryName = strtolower($categoryName);
        $sportName = strtolower($sportName);
        $data = $this->findAllCached();
        foreach ($data as $d){
            if ($d['name'] === $sportName){
                foreach ($d['categories'] as $category){
                    if ($category['name'] === $categoryName){
                        return $category;
                    }
                }
            }
        }
        return null;
    }
}
