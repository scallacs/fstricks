<?php

namespace App\Model\Table;

use App\Model\Entity\Tag;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\ORM\Entity;
use App\Lib\JsonConfigHelper;

/**
 * Tags Model
 *
 * @property \Cake\ORM\Association\BelongsToMany $Spots
 */
class TagsTable extends Table {

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
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
    public function validationDefault(Validator $validator) {
        $validator
                ->add('id', 'valid', ['rule' => 'numeric'])
                ->allowEmpty('id', 'create');

        
        $validator
                ->requirePresence('name', 'create')
                ->notEmpty('name')
                ->add('name', [
                    'minLength' => [
                        'rule' => ['minLength', JsonConfigHelper::rules('tags', 'name', 'min_length')],
                        'message' => 'Choose a longer name.'
                    ],
                    'maxLength' => [
                        'rule' => ['maxLength', JsonConfigHelper::rules('tags', 'name', 'max_length')],
                        'message' => 'Choose a shorter name.'
                    ],
                    'allowedChars' => [
                        'rule' => function($value, $context) {
                            return !preg_match(JsonConfigHelper::rules('tags', 'name', 'regex'), $value);
                        },
                        'message' => 'Only alpha numeric chars with accents.'
                    ]
        ]);
                        
        // TODO add rule sport and category exists
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

    public function buildRules(RulesChecker $rules) {
        parent::buildRules($rules);
        $rules->add($rules->isUnique(['name', 'category_id']));
        return $rules;
    }

    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options) {
        if (!empty($entity->name)) {
            // TODO remove from here (set in entity)
            $entity->name = \App\Lib\DataUtil::lowernamenumeric($entity->name);
            $entity->slug = \Cake\Utility\Inflector::slug($entity->name);
        }
    }

}
