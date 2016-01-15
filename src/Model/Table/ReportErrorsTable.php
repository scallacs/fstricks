<?php

namespace App\Model\Table;

use App\Model\Entity\ReportError;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ReportErrors Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\BelongsTo $ErrorTypes
 * @property \Cake\ORM\Association\BelongsTo $VideoTags
 */
class ReportErrorsTable extends Table {

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->table('report_errors');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('Users', [
            'foreignKey' => 'user_id'
        ]);
        $this->belongsTo('ErrorTypes', [
            'foreignKey' => 'error_type_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('VideoTags', [
            'foreignKey' => 'video_tag_id',
            'joinType' => 'INNER'
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
                ->notEmpty('user_id', 'create')
                ->requirePresence('user_id', 'create');
        
        $validator
                ->notEmpty('video_tag_id', 'create')
                ->requirePresence('video_tag_id', 'create');
        
        $validator
                ->allowEmpty('comment');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules) {
        $rules->add($rules->isUnique(['video_tag_id', 'user_id', 'status'], 'You already have report an error for this trick.'));
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        $rules->add($rules->existsIn(['error_type_id'], 'ErrorTypes'));
        $rules->add($rules->existsIn(['video_tag_id'], 'VideoTags'));
        return $rules;
    }

}
