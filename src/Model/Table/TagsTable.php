<?php
namespace App\Model\Table;

use App\Model\Entity\Tag;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\ORM\Entity;

/**
 * Tags Model
 *
 * @property \Cake\ORM\Association\BelongsToMany $Spots
 */
class TagsTable extends Table
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

        $this->table('tags');
        $this->displayField('name');
        $this->primaryKey('id');

        $this->hasMany('VideoTags', [
            'foreignKey' => 'tag_id',
        ]);
        $this->belongsTo('Categories', [
            'foreignKey' => 'category_id',
        ]);
        $this->belongsTo('Sports', [
            'foreignKey' => 'sport_id',
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
            // Min length is two cars

        $validator
            ->requirePresence('sport_id', 'create')
            ->notEmpty('sport_id');
        $validator
            ->requirePresence('category_id', 'create')
            ->notEmpty('category_id');
        $validator
            ->requirePresence('user_id', 'create')
            ->notEmpty('user_id');

        return $validator;
    }
    
    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options){
        if (!empty($entity->name)){
            $entity->name = strtolower($entity->name);
            $entity->slug = \Cake\Utility\Inflector::slug($entity->name);
        }
    }

}
