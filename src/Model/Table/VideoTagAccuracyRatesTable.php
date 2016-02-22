<?php

namespace App\Model\Table;

use App\Model\Entity\VideoTagAccuracyRate;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\Core\Configure;

/**
 * VideoTagAccuracyRates Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\BelongsTo $VideoTags
 */
class VideoTagAccuracyRatesTable extends Table {

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config) {
        parent::initialize($config);

        $this->table('video_tag_accuracy_rates');
        $this->displayField('user_id');
        $this->primaryKey(['user_id', 'video_tag_id']);

        $this->addBehavior('Timestamp');

        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
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
                ->requirePresence('video_tag_id', 'create')
                ->notEmpty('video_tag_id');
        $validator
                ->requirePresence('user_id', 'create')
                ->notEmpty('user_id');
        $validator
                ->requirePresence('value', 'create')
                ->notEmpty('value')
                ->add('value', 'custom', [
                    'rule' => function($value) {
                return $value === VideoTagAccuracyRate::VALUE_ACCURATE || $value === VideoTagAccuracyRate::VALUE_FAKE;
            },
                    'message' => 'Unknown rate'
        ]);

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
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        $rules->add($rules->existsIn(['video_tag_id'], 'VideoTags'));
        $rules->add($rules->isUnique(['video_tag_id', 'user_id']));
        return $rules;
    }

    /**
     * @param \App\Model\Table\Event $event
     * @param \Cake\ORM\Entity $entity
     * @param \App\Model\Table\ArrayObject $options
     */
    public function beforeSave($event, $entity, $options) {
        // check if we will publish the tag: 
        try {
            $videoTagTable = \Cake\ORM\TableRegistry::get('VideoTags');
            $videoTag = $videoTagTable->get($entity->video_tag_id);
            if ($videoTag->status !== \App\Model\Entity\VideoTag::STATUS_PENDING) {
                $event->stopPropagation();
                $entity->errors('video_tag_id', ['You cannot rate this trick, it has not a pending status']);
                return false;
            }
            $entity->videoTag = $videoTag;
        } catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
            $event->stopPropagation();
            $entity->errors('video_tag_id', ['Does\'t exist!']);
            return false;
        }
        return true;
    }

    public function afterSave($event, $entity, $options) {
        $videoTag = $entity->videoTag;
        $totalRate = $videoTag->count_fake + $videoTag->count_accurate + 1;

        if ($totalRate >= Configure::read('VideoTagValidation.min_rate')) {
            if ($entity->value === VideoTagAccuracyRate::VALUE_ACCURATE) {
                $videoTag->count_accurate++;
                $threshold = $videoTag->count_accurate / $totalRate;
                $newStatus = ($threshold >= Configure::read('VideoTagValidation.threshold_accurate')) ? \App\Model\Entity\VideoTag::STATUS_VALIDATED : null;
            } else {
                $threshold = $videoTag->count_fake++ / $totalRate;
                $newStatus = ($threshold >= Configure::read('VideoTagValidation.threshold_fake')) ? \App\Model\Entity\VideoTag::STATUS_REJECTED : null;
            }
            if ($newStatus !== null) {
                // Check if there is not already a validated tag 
                $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
                $videoTag->status = $newStatus;
//                debug($videoTag);
                if (!$videoTagsTable->save($videoTag)) {
                    // TODO log error
                }
//                debug($videoTag);
            }
        }
    }

}
