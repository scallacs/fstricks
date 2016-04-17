<?php

namespace App\Model\Table;

use App\Model\Entity\Tag;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\ORM\Entity;
use App\Lib\JsonConfigHelper;
use App\Lib\ResultMessage;

/**
 * Tags Model
 *
 * @property \Cake\ORM\Association\BelongsToMany $Spots
 */
class TagsTable extends Table {

    const STATUS_REJECTED       = 'rejected';
    const STATUS_PENDING        = 'pending';
    const STATUS_VALIDATED      = 'validated';
    const STATUS_BLACKLISTED    = 'blacklisted';
    
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
    }

    public function initFilters($mode = 'default') {
        $this->addBehavior('Search.Search');
        $this->searchManager()
                ->add('user_id', 'Search.Value')
                ->add('status', 'Search.Value', [
                    'field' => $this->aliasField('status')
                ])
                ->add('q', 'Search.Like', [
                    'before' => true,
                    'after' => true,
                    'field' => [$this->aliasField('name')]
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

        $validator
                ->requirePresence('category_id', 'create')
                ->notEmpty('category_id');

        $validator
                ->requirePresence('user_id', 'create')
                ->allowEmpty('user_id', 'update');

        return $validator;
    }

    public function findByName($name, $categoryId) {
        return $this->find()
                        ->where([
                            'Tags.name' => $name,
                            'Tags.category_id' => $categoryId
                        ])
                        ->limit(1)
                        ->first();
    }

    public function createOrGet($entity, $userId) {
        $entity->user_id = $userId;
        if ($this->save($entity)) {
            return $entity;
        }
        $errors = $entity->errors();

        if (count($errors) === 1 && isset($errors['name']['_isUnique'])) {
            $entity = $this->findByName($entity->name, $entity->category_id);
            if ($entity) {
                return $entity;
            }
        } else {
            \Cake\Log\Log::notice("Cannot create a new tag: " . print_r($entity->errors(), true), 'messages');
            ResultMessage::addValidationErrorsModel($entity);
            ResultMessage::setMessage(__('Cannot create this trick'), false);
        }
        return $entity;
    }

    public function buildRules(RulesChecker $rules) {
        parent::buildRules($rules);
        // Test exists category
        $rules->add(function($entity, $options) {
            $categoriesTable = \Cake\ORM\TableRegistry::get('Categories');
            try {
                $category = $categoriesTable->get($entity->category_id, ['contain' => 'Sports']);
                $entity->__category = $category;

                return true;
            } catch (\Exception $ex) {
                return false;
            }
        });

        $rules->add($rules->isUnique(['name', 'category_id']));

        return $rules;
    }

    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options) {
        if ($entity->isNew() && empty($entity->slug)) {
            $entity->generateSlug($entity->__category);
        }
    }

    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function afterSave($event, $entity, $options) {
        if ($entity->isNew() && empty($entity->slug)) {
            $entity->updateSlug($entity->id);
        }
    }

    public function findPublic() {
        return $this->find('all');
    }

    public function findForSitemap() {
        return $this->find('all')
                        ->order(['Tags.count_ref DESC'])
                        ->where([
                            'Tags.count_ref >=' => '1',
                            'Tags.status' => \App\Model\Entity\Tag::STATUS_VALIDATED
                        ])
                        ->limit(50000);
    }

    public function updateSlug($id) {
        $entity = $this->get($id, [
            'contain' => ['Categories' => ['Sports']]
        ]);
        $entity->generateSlug($entity->category);
        return $this->save($entity);
    }

}
